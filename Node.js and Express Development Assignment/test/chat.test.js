const chai = require('chai');
const request = require('supertest');
const app = require('../src/app');
const Message = require('../src/models/Message');
const User = require('../src/models/User');

const { expect } = chai;

describe('Chat REST API Suite (Mocha & Chai)', function () {
  let token;
  let userId;

  beforeEach(async function () {
    await Message.deleteMany({});
    await User.deleteMany({});

    const reg = await request(app)
      .post('/api/auth/register')
      .send({ username: 'chattester', password: 'password123' });

    token = reg.body.token;
    userId = reg.body.user.id;
  });

  describe('GET /api/chat/rooms', function () {
    it('should return available chat rooms', async function () {
      const res = await request(app).get('/api/chat/rooms');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.rooms).to.be.an('array').with.lengthOf.at.least(3);
      expect(res.body.rooms[0]).to.have.property('id', 'general');
    });
  });

  describe('GET /api/chat/messages/:room', function () {
    it('should return empty list when no messages exist in room', async function () {
      const res = await request(app).get('/api/chat/messages/general');

      expect(res.status).to.equal(200);
      expect(res.body.messages).to.be.an('array').that.is.empty;
    });

    it('should return messages for the specified room', async function () {
      await Message.create({
        sender: userId,
        senderName: 'chattester',
        room: 'general',
        content: 'Hello World from test!'
      });

      const res = await request(app).get('/api/chat/messages/general');

      expect(res.status).to.equal(200);
      expect(res.body.messages).to.be.an('array').with.lengthOf(1);
      expect(res.body.messages[0].content).to.equal('Hello World from test!');
    });
  });

  describe('POST /api/chat/messages', function () {
    it('should allow authenticated users to post a message', async function () {
      const res = await request(app)
        .post('/api/chat/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({
          room: 'tech',
          content: 'Building with Node.js and Express is awesome!'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body.message.content).to.equal('Building with Node.js and Express is awesome!');
      expect(res.body.message.room).to.equal('tech');
      expect(res.body.message.senderName).to.equal('chattester');
    });

    it('should reject unauthenticated message posting with 401', async function () {
      const res = await request(app)
        .post('/api/chat/messages')
        .send({ room: 'tech', content: 'Unauthorized message' });

      expect(res.status).to.equal(401);
    });

    it('should reject message posting with empty content', async function () {
      const res = await request(app)
        .post('/api/chat/messages')
        .set('Authorization', `Bearer ${token}`)
        .send({ room: 'tech', content: '   ' });

      expect(res.status).to.equal(400);
    });
  });
});
