const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET || 'greenbuild_jwt_secret_key_2026_super_secure';
const memoryUserStore = [];

function isDbConnected() {
  return mongoose.connection.readyState === 1;
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
        role: 'user',
        createdAt: new Date()
      };
      memoryUserStore.push(newUser);
    }

    const token = generateToken(newUser);

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

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials. Password incorrect.'
      });
    }

    const token = generateToken(user);

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
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.'
  });
};
