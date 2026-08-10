const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'greenbuild_jwt_secret_key_2026_super_secure';

/**
 * MANDATORY Auth Middleware - Requires valid JWT token
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token missing.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach decoded user metadata
    req.user = {
      _id: decoded.id || decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    console.error('[Auth Middleware] Invalid token:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid token. Please log in again.'
    });
  }
};

/**
 * OPTIONAL Auth Middleware - Attaches req.user if token is present, but does not reject request
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = {
          _id: decoded.id || decoded._id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role || 'user'
        };
      }
    }
  } catch (error) {
    // Ignore error for optional auth
    req.user = null;
  }
  next();
};

module.exports = { requireAuth, optionalAuth };
