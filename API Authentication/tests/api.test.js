const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const app = require('../server');

let server;
const PORT = 3099;
const BASE_URL = `http://localhost:${PORT}`;

// Helper function to send HTTP requests to test server
function makeRequest(path, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (postData && !reqOptions.headers['Content-Type']) {
      reqOptions.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(url, reqOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: json || body });
      });
    });

    req.on('error', reject);

    if (postData) {
      req.write(typeof postData === 'object' ? JSON.stringify(postData) : postData);
    }
    req.end();
  });
}

test.before(async () => {
  await new Promise(resolve => {
    server = app.listen(PORT, resolve);
  });
});

test.after(async () => {
  await new Promise(resolve => {
    server.close(resolve);
  });
});

test('API Health Check', async () => {
  const res = await makeRequest('/api/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.status, 'OK');
});

test('Authentication Flow: Student Login & Issue JWT', async () => {
  const res = await makeRequest('/api/auth/login', { method: 'POST' }, {
    email: 'student@edquest.com',
    password: 'UserPass123!'
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.auth.accessToken);
  assert.equal(res.body.user.role, 'user');
});

test('Protected Route Access: Reject Request Without Token (401)', async () => {
  const res = await makeRequest('/api/protected/user-dashboard');
  assert.equal(res.status, 401);
  assert.equal(res.body.success, false);
});

test('Protected Route Access: Accept Valid Bearer Token (200)', async () => {
  // 1. Login
  const loginRes = await makeRequest('/api/auth/login', { method: 'POST' }, {
    email: 'student@edquest.com',
    password: 'UserPass123!'
  });
  const token = loginRes.body.auth.accessToken;

  // 2. Access protected endpoint
  const res = await makeRequest('/api/protected/user-dashboard', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.authenticatedAs, 'student');
});

test('RBAC Access Control: Student User Accessing Admin Portal (403 Forbidden)', async () => {
  const loginRes = await makeRequest('/api/auth/login', { method: 'POST' }, {
    email: 'student@edquest.com',
    password: 'UserPass123!'
  });
  const token = loginRes.body.auth.accessToken;

  const res = await makeRequest('/api/protected/admin-dashboard', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  assert.equal(res.status, 403);
  assert.equal(res.body.success, false);
  assert.match(res.body.message, /not authorized/i);
});

test('RBAC Access Control: Admin User Accessing Admin Portal (200 OK)', async () => {
  const loginRes = await makeRequest('/api/auth/login', { method: 'POST' }, {
    email: 'admin@edquest.com',
    password: 'AdminPass123!'
  });
  const token = loginRes.body.auth.accessToken;

  const res = await makeRequest('/api/protected/admin-dashboard', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.role, 'admin');
});

test('API Key Authentication: Valid API Key (200 OK)', async () => {
  const res = await makeRequest('/api/protected/apikey-data', {
    headers: { 'x-api-key': 'demo-api-key-partner-9988' }
  });

  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
});

test('API Key Authentication: Missing / Invalid API Key (401 / 403)', async () => {
  const noKeyRes = await makeRequest('/api/protected/apikey-data');
  assert.equal(noKeyRes.status, 401);

  const invalidKeyRes = await makeRequest('/api/protected/apikey-data', {
    headers: { 'x-api-key': 'wrong-key' }
  });
  assert.equal(invalidKeyRes.status, 403);
});

test('OAuth 2.0 Authorization Code Grant Flow Simulation', async () => {
  // 1. Authorize
  const authRes = await makeRequest('/api/oauth/authorize?client_id=edquest_demo_client_id&response_type=code&scope=read:profile');
  assert.equal(authRes.status, 200);
  const code = authRes.body.authorizationCode;
  assert.ok(code);

  // 2. Token Exchange
  const tokenRes = await makeRequest('/api/oauth/token', { method: 'POST' }, {
    grant_type: 'authorization_code',
    client_id: 'edquest_demo_client_id',
    client_secret: 'edquest_demo_client_secret_99',
    code: code
  });

  assert.equal(tokenRes.status, 200);
  const oauthToken = tokenRes.body.access_token;
  assert.ok(oauthToken);

  // 3. Resource Request using OAuth Token
  const userinfoRes = await makeRequest('/api/oauth/userinfo', {
    headers: { 'Authorization': `Bearer ${oauthToken}` }
  });

  assert.equal(userinfoRes.status, 200);
  assert.equal(userinfoRes.body.name, 'Alex Johnson (OAuth User)');
});
