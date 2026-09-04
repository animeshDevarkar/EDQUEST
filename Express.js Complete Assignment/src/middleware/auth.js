const { AppError } = require('./errorHandler');
const env = require('../config/env');

/**
 * Authentication Middleware: Validates x-api-key header
 */
const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey) {
    return next(new AppError('Unauthorized: Missing X-API-KEY header', 401));
  }

  if (apiKey !== env.DEMO_API_KEY) {
    return next(new AppError('Forbidden: Invalid API key provided', 403));
  }

  // Attach mock user metadata to request object
  req.user = {
    id: 'usr_admin_101',
    name: 'EDquest Administrator',
    role: 'admin'
  };

  next();
};

/**
 * Role-Based Authorization Middleware Factory
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('Forbidden: You do not have permission to perform this action', 403));
    }
    next();
  };
};

module.exports = {
  requireApiKey,
  requireRole
};
