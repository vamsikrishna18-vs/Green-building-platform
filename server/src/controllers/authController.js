const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'greenbuild_jwt_secret_key_2026_super_secure';
const memoryUserStore = [];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.trim() : undefined;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET.trim() : undefined;
  const redirectUri = (process.env.GOOGLE_REDIRECT_URI ? process.env.GOOGLE_REDIRECT_URI.trim() : '') || 'http://localhost:5000/api/auth/google/callback';

  return new OAuth2Client(clientId, clientSecret, redirectUri);
}

/**
 * Generate JWT token for user
 */
const generateToken = (user) => {
  const userId = user._id ? user._id.toString() : user.id;
  return jwt.sign(
    {
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, and password.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Hash password with bcryptjs
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    let newUser;
    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email address already exists.'
        });
      }

      newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        authProvider: 'local',
        role: 'user'
      });
    } else {
      // In-Memory user registration fallback
      const existingInMemory = memoryUserStore.find(u => u.email === normalizedEmail);
      if (existingInMemory) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email address already exists.'
        });
      }

      newUser = {
        _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        authProvider: 'local',
        role: 'user',
        createdAt: new Date()
      };
      memoryUserStore.push(newUser);
    }

    const token = generateToken(newUser);
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both email and password.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user;

    if (isDbConnected()) {
      user = await User.findOne({ email: normalizedEmail });
    } else {
      user = memoryUserStore.find(u => u.email === normalizedEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. User not found.'
      });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        success: false,
        error: 'This account was created using Google Sign-In. Please click "Continue with Google" to log in.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Password incorrect.'
      });
    }

    const token = generateToken(user);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/google/login
 * Initiates Google OAuth 2.0 / OIDC Flow
 */
exports.googleLogin = async (req, res, next) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.trim() : undefined;
    if (!clientId) {
      return res.status(500).json({
        success: false,
        error: 'Google Client ID (GOOGLE_CLIENT_ID) is not configured in backend environment variables.'
      });
    }

    const oauth2Client = getOAuth2Client();
    const state = crypto.randomBytes(32).toString('hex');

    // Store state in HttpOnly cookie to prevent CSRF
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000 // 10 minutes
    });

    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: ['openid', 'email', 'profile'],
      state,
      prompt: 'select_account'
    });

    return res.redirect(authorizeUrl);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth Callback, validates state, verifies ID Token server-side,
 * finds or links user, sets HttpOnly token cookie, and redirects to frontend (NO tokens in URL).
 */
exports.googleCallback = async (req, res, next) => {
  try {
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const { code, state, error: oauthError } = req.query;

    if (oauthError) {
      console.error('[Google OAuth] Error from Google authorization:', oauthError);
      return res.redirect(`${frontendUrl}/?auth_error=${encodeURIComponent(oauthError)}`);
    }

    const savedState = req.cookies ? req.cookies.oauth_state : null;
    res.clearCookie('oauth_state');

    if (!state || !savedState || state !== savedState) {
      console.error('[Google OAuth] State mismatch / potential CSRF attempt');
      return res.status(400).json({
        success: false,
        error: 'Invalid OAuth state token. Authentication rejected for security.'
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Authorization code missing from Google redirect.'
      });
    }

    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens || !tokens.id_token) {
      return res.status(400).json({
        success: false,
        error: 'Failed to obtain ID token from Google OAuth service.'
      });
    }

    // Verify Google ID Token server-side using official Google library
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payload in Google ID token.'
      });
    }

    const { sub, email, email_verified, name, picture } = payload;

    if (!email_verified) {
      return res.status(400).json({
        success: false,
        error: 'Google account email is not verified.'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user;

    if (isDbConnected()) {
      // 1. Find user by stable googleSubject first
      user = await User.findOne({ googleSubject: sub });

      if (!user) {
        // 2. Search by verified email for safe account linking
        user = await User.findOne({ email: normalizedEmail });

        if (user) {
          user.googleSubject = sub;
          if (picture && !user.avatar) {
            user.avatar = picture;
          }
          await user.save();
        } else {
          // 3. Create new user with Google identity
          user = await User.create({
            name: name || 'Google User',
            email: normalizedEmail,
            googleSubject: sub,
            authProvider: 'google',
            avatar: picture || '',
            role: 'user'
          });
        }
      }
    } else {
      // In-Memory user lookup & creation fallback
      user = memoryUserStore.find(u => u.googleSubject === sub);

      if (!user) {
        user = memoryUserStore.find(u => u.email === normalizedEmail);
        if (user) {
          user.googleSubject = sub;
          if (picture && !user.avatar) user.avatar = picture;
        } else {
          user = {
            _id: 'usr_g_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
            name: name || 'Google User',
            email: normalizedEmail,
            googleSubject: sub,
            authProvider: 'google',
            avatar: picture || '',
            role: 'user',
            createdAt: new Date()
          };
          memoryUserStore.push(user);
        }
      }
    }

    // Generate JWT session token
    const token = generateToken(user);

    // Set Secure + HttpOnly authentication cookie
    setTokenCookie(res, token);

    // Clean redirect to frontend home WITHOUT any JWT/access tokens in the URL
    return res.redirect(`${frontendUrl}/`);
  } catch (error) {
    console.error('[Google OAuth Callback Exception]', error);
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    let user;
    if (isDbConnected() && !req.user._id.toString().startsWith('usr_')) {
      user = await User.findById(req.user._id).select('-passwordHash');
    } else {
      user = memoryUserStore.find(u => u._id.toString() === req.user._id.toString());
      if (!user && req.user) {
        user = { ...req.user };
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User account not found.'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        avatar: user.avatar || '',
        authProvider: user.authProvider || 'local',
        createdAt: user.createdAt || new Date()
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 */
exports.logout = async (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};
