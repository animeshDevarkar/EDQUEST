const mongoose = require('mongoose');

let mongoServer = null;

/**
 * Connect to MongoDB instance (or fallback to in-memory server).
 */
async function connectDB(customUri = null) {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  let uri = customUri || process.env.MONGODB_URI;

  if (!uri) {
    try {
      // Fallback: Try local MongoDB default URI first
      const defaultLocalUri = 'mongodb://127.0.0.1:27017/library_system';
      await mongoose.connect(defaultLocalUri, { serverSelectionTimeoutMS: 2000 });
      console.log(' Connected to local MongoDB daemon at:', defaultLocalUri);
      return mongoose.connection;
    } catch (err) {
      console.log(' Local MongoDB daemon not reachable. Launching in-memory MongoDB instance...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      process.env.MONGODB_URI = uri;
      await mongoose.connect(uri);
      console.log(' Connected to in-memory MongoDB instance at:', uri);
      return mongoose.connection;
    }
  } else {
    await mongoose.connect(uri);
    console.log(' Connected to MongoDB at:', uri);
    return mongoose.connection;
  }
}

/**
 * Disconnect from MongoDB and stop in-memory server if active.
 */
async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log(' Disconnected from MongoDB');
  }
  if (mongoServer) {
    await mongoServer.stop();
    console.log(' Stopped in-memory MongoDB instance');
    mongoServer = null;
    delete process.env.MONGODB_URI;
  }
}

module.exports = { connectDB, disconnectDB };
