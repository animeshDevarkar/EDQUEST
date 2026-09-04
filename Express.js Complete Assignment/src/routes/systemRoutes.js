const express = require('express');
const router = express.Router();

/**
 * GET /api/v1/system/health - Health check endpoint
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    memoryUsage: process.memoryUsage()
  });
});

/**
 * GET /api/v1/system/info - Technical Express framework architecture summary
 */
router.get('/info', (req, res) => {
  res.status(200).json({
    name: 'Express.js Complete Assignment API',
    author: 'Animesh Devarkar',
    features: [
      'Layered Architecture (Routes -> Middlewares -> Controllers -> Services)',
      'Built-in Middleware (express.json, express.urlencoded, express.static)',
      'Third-party Middleware (Helmet, CORS, Morgan, Compression, Express-Rate-Limit)',
      'Custom Middleware (Logger, Auth, Validation, Error Handler)',
      'RESTful Routing (Method chaining, Param validation, Route groups)'
    ]
  });
});

module.exports = router;
