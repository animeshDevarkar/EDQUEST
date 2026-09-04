/**
 * Custom HTTP Logger Middleware
 * Demonstrates calculating request duration and inspecting request lifecycle
 */
const customLogger = (req, res, next) => {
  const startTime = process.hrtime();
  const dateStr = new Date().toISOString();

  // Attach execution tracker
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const logLine = `[${dateStr}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${timeInMs}ms`;
    
    if (process.env.NODE_ENV !== 'test') {
      console.log(logLine);
    }
  });

  next();
};

module.exports = customLogger;
