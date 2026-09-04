const rateLimit = require('express-rate-limit');

// Rate limiter for Auth routes (Register/Login) to mitigate brute force attacks
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 authentication attempts per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Too many login/registration attempts from this IP. Please try again after 15 minutes.'
  }
});

// General API rate limiter
const apiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // Limit each IP to 60 API requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Rate Limit Exceeded',
    message: 'API rate limit exceeded. Please slow down requests.'
  }
});

module.exports = {
  authRateLimiter,
  apiRateLimiter
};
