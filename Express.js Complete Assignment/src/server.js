const app = require('./app');
const env = require('./config/env');

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const server = app.listen(env.PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Express.js Server running on port ${env.PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`📌 API Base URL: http://localhost:${env.PORT}${env.API_PREFIX}`);
  console.log(`💻 Interactive Web Dashboard: http://localhost:${env.PORT}`);
  console.log(`==================================================`);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Graceful shutdown sequence initiated.');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
