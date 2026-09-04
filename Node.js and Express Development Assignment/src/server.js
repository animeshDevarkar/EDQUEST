require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { connectDB } = require('./config/db');
const { setupChatSocket } = require('./sockets/chatSocket');

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Setup Socket.io event listeners
setupChatSocket(io);

// Start server after connecting to database
const startServer = async () => {
  await connectDB();
  
  let currentPort = Number(process.env.PORT) || 5000;
  const maxRetries = 10;
  let attempts = 0;

  const tryListen = (port) => {
    server.listen(port)
      .on('listening', () => {
        console.log(`===============================================`);
        console.log(`🚀 Chat Server running on http://localhost:${port}`);
        console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`===============================================`);
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE' && attempts < maxRetries) {
          attempts++;
          console.warn(`[Server] Port ${port} is in use. Trying port ${port + 1}...`);
          tryListen(port + 1);
        } else {
          console.error('[Server] Fatal listen error:', err);
          process.exit(1);
        }
      });
  };

  tryListen(currentPort);
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = { server, io, app, startServer };
