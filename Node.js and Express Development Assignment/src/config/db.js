const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && process.env.NODE_ENV !== 'test') {
      try {
        console.log(`[Database] Attempting connection to ${uri}...`);
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
        console.log('[Database] MongoDB connected successfully to provided URI.');
        return;
      } catch (err) {
        console.warn(`[Database] Warning: Could not connect to external MongoDB: ${err.message}`);
        console.log('[Database] Starting in-memory MongoDB fallback...');
      }
    }

    // Fallback or Test environment: use MongoMemoryServer
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to In-Memory MongoDB (${memoryUri})`);
  } catch (error) {
    console.error('[Database] Connection Error:', error.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (error) {
    console.error('[Database] Disconnect Error:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
