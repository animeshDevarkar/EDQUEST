const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

exports.mochaHooks = {
  async beforeAll() {
    this.timeout(60000);
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test_secret_key_12345';

    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  },

  async afterAll() {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }
};
