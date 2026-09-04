const rateLimit = require('express-rate-limit');

/**
 * Global API Rate Limiter
 * Limits clients to 100 requests per 15-minute window
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

/**
 * Strict Rate Limiter for Mutation / Auth Endpoints
 */
const strictLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 mutation attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many mutation attempts. Please wait 5 minutes before trying again.'
  }
});

module.exports = {
  apiLimiter,
  strictLimiter
};
