const chai = require('chai');
const http = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');
const app = require('../src/app');
const { setupChatSocket } = require('../src/sockets/chatSocket');
const User = require('../src/models/User');
const { generateToken } = require('../src/middleware/auth');

const { expect } = chai;

describe('Socket.io Real-Time Suite (Mocha & Chai)', function () {
  let ioServer;
  let httpServer;
  let serverPort;
  let clientSocket;
  let testUser;
  let authToken;

  before(function (done) {
    httpServer = http.createServer(app);
    ioServer = new Server(httpServer);
    setupChatSocket(ioServer);

    httpServer.listen(() => {
      serverPort = httpServer.address().port;
      done();
    });
  });

  after(function (done) {
    ioServer.close();
    httpServer.close(done);
  });

  beforeEach(async function () {
    testUser = await User.create({
      username: `socketuser_${Date.now()}`,
      password: 'password123'
    });
    authToken = generateToken(testUser._id);
  });

  afterEach(function (done) {
    if (clientSocket && clientSocket.connected) {
      clientSocket.disconnect();
    }
    done();
  });

  it('should connect to the Socket.io server successfully', function (done) {
    clientSocket = Client(`http://localhost:${serverPort}`, {
      auth: { token: authToken }
    });

    clientSocket.on('connect', () => {
      expect(clientSocket.connected).to.be.true;
      done();
    });
  });

  it('should receive a welcome system message when joining a room', function (done) {
    clientSocket = Client(`http://localhost:${serverPort}`, {
      auth: { token: authToken }
    });

    clientSocket.on('connect', () => {
      clientSocket.emit('joinRoom', { room: 'general' });
    });

    clientSocket.on('systemMessage', (msg) => {
      if (msg.text.includes('Welcome to #general')) {
        expect(msg.text).to.include(testUser.username);
        done();
      }
    });
  });

  it('should broadcast a chat message to room members', function (done) {
    const client1 = Client(`http://localhost:${serverPort}`, {
      auth: { token: authToken }
    });

    client1.on('connect', () => {
      client1.emit('joinRoom', { room: 'tech' });

      // After joining, send message
      setTimeout(() => {
        client1.emit('sendMessage', {
          room: 'tech',
          content: 'Testing Socket.io realtime broadcast!'
        });
      }, 50);
    });

    client1.on('newMessage', (msg) => {
      expect(msg.content).to.equal('Testing Socket.io realtime broadcast!');
      expect(msg.room).to.equal('tech');
      expect(msg.senderName).to.equal(testUser.username);
      client1.disconnect();
      done();
    });
  });
});
