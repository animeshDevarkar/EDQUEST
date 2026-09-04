const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const config = require('./config');

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const { apiRateLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false // Disabled for inline demo script UI ease
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general API rate limiting to all /api routes
app.use('/api', apiRateLimiter);

// Serve static frontend dashboard
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/oauth', oauthRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'API Authentication Fundamentals Demo Server',
    timestamp: new Date().toISOString(),
    supportedAuthMethods: [
      'Token-Based JWT (JSON Web Tokens)',
      'API Key Authentication (Header x-api-key)',
      'OAuth 2.0 Authorization Code Grant Simulation'
    ]
  });
});

// Catch-all route to serve frontend index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server if run directly
if (require.main === module) {
  app.listen(config.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🔐 API Authentication Fundamentals Server Running!`);
    console.log(`🌐 Web Dashboard: http://localhost:${config.PORT}`);
    console.log(`🚀 API Base URL:  http://localhost:${config.PORT}/api`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
