const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');
const { authenticateApiKey } = require('../middleware/apiKeyMiddleware');

/**
 * GET /api/protected/user-dashboard
 * Accessible by any authenticated user (JWT Bearer Auth)
 */
router.get('/user-dashboard', authenticateToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Protected User Dashboard.',
    securityLevel: 'Authenticated (User/Admin)',
    authenticatedAs: req.user.username,
    role: req.user.role,
    data: {
      enrolledCourses: ['API Security 101', 'OAuth 2.0 In Depth'],
      assignmentsSubmitted: 4,
      securityScore: '98/100'
    }
  });
});

/**
 * GET /api/protected/admin-dashboard
 * RBAC Protected: Requires role 'admin'
 */
router.get('/admin-dashboard', authenticateToken, requireRole('admin'), (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to the Secure Admin Portal. Role-Based Access Control verified.',
    securityLevel: 'RBAC Enforced (Admin Only)',
    authenticatedAs: req.user.username,
    role: req.user.role,
    adminData: {
      totalUsers: 1420,
      activeSessions: 87,
      securityAlerts: 0,
      systemHealth: 'Optimal'
    }
  });
});

/**
 * GET /api/protected/apikey-data
 * Protected by API Key middleware (`x-api-key`)
 */
router.get('/apikey-data', authenticateApiKey, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Machine-to-Machine data retrieved via valid API Key authentication.',
    securityLevel: 'API Key Verification',
    authenticatedKey: `${req.apiKey.slice(0, 12)}...`,
    partnerMetrics: {
      apiCallsToday: 3410,
      rateLimitQuota: '10,000 requests/day',
      status: 'Active Partner'
    }
  });
});

module.exports = router;
