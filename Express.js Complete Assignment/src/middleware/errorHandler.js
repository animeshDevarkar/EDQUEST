/**
 * Custom Operational Error Class
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async Error Wrapper (eliminates repetitive try-catch blocks in controllers)
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

/**
 * Centralized Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const isDev = process.env.NODE_ENV === 'development';

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(isDev && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

module.exports = {
  AppError,
  catchAsync,
  errorHandler
};
