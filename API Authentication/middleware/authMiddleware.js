const { verifyAccessToken } = require('../utils/tokenUtils');

/**
 * Middleware to authenticate requests using JWT Bearer token in Authorization header.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized Access',
      message: 'Access token missing. Include Authorization header with Bearer token.'
    });
  }

  try {
    const userPayload = verifyAccessToken(token);
    req.user = userPayload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token Expired',
        message: 'The provided access token has expired. Please refresh your token.'
      });
    }
    return res.status(403).json({
      success: false,
      error: 'Invalid Token',
      message: 'Token verification failed. Signature is invalid or malformed.'
    });
  }
}

/**
 * Middleware for Role-Based Access Control (RBAC).
 * @param  {...string} allowedRoles 
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Role information missing from payload.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Role '${req.user.role}' is not authorized to access this resource. Required role(s): ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
