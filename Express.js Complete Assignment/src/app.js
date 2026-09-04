const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const env = require('./config/env');
const customLogger = require('./middleware/logger');
const { apiLimiter } = require('./middleware/rateLimiter');
const { AppError, errorHandler } = require('./middleware/errorHandler');

const productRoutes = require('./routes/productRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();

// 1. Security Headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: false // Disabled for inline script ease in local static demo page
  })
);

// 2. Cross-Origin Resource Sharing (CORS)
app.use(cors());

// 3. Response Compression (Gzip)
app.use(compression());

// 4. Request Logging (Morgan in development/production, custom timing logger)
if (env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(customLogger);

// 5. Body Parsing Built-in Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 6. Rate Limiting Middleware for API
app.use(env.API_PREFIX, apiLimiter);

// 7. Static Files Middleware
app.use(express.static(path.join(__dirname, 'public')));

// 8. Mount Application Routes
app.use(`${env.API_PREFIX}/products`, productRoutes);
app.use(`${env.API_PREFIX}/system`, systemRoutes);

// Root route redirects or serves static landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 9. Handle Undefined Routes (404 Not Found)
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

// 10. Global Error Handling Middleware
app.use(errorHandler);

module.exports = app;
