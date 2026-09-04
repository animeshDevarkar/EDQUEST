const chai = require('chai');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

const { expect } = chai;

describe('Authentication API Suite (Mocha & Chai)', function () {
  beforeEach(async function () {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', function () {
    it('should register a new user and return a JWT token', async function () {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('token');
      expect(res.body.user).to.have.property('username', 'testuser');
      expect(res.body.user).to.not.have.property('password');
    });

    it('should reject registration if username already exists', async function () {
      await User.create({ username: 'existinguser', password: 'password123' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'existinguser',
          password: 'password123'
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.include('already taken');
    });

    it('should return 400 when missing username or password', async function () {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ username: 'onlyuser' });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('success', false);
    });
  });

  describe('POST /api/auth/login', function () {
    beforeEach(async function () {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'validuser', password: 'secretpassword' });
    });

    it('should authenticate user and return token with valid credentials', async function () {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'validuser',
          password: 'secretpassword'
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body).to.have.property('token');
      expect(res.body.user.username).to.equal('validuser');
    });

    it('should reject login with wrong password', async function () {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'validuser',
          password: 'wrongpassword'
        });

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('success', false);
      expect(res.body.message).to.equal('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', function () {
    let token;

    beforeEach(async function () {
      const reg = await request(app)
        .post('/api/auth/register')
        .send({ username: 'profileuser', password: 'password123' });
      token = reg.body.token;
    });

    it('should return user profile when valid token is provided in headers', async function () {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('success', true);
      expect(res.body.user.username).to.equal('profileuser');
    });

    it('should reject request when token is missing', async function () {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('success', false);
    });
  });
});
