const { test, describe, before, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const ProductService = require('../src/services/productService');

// Helper function to simulate HTTP requests against Express app directly
async function makeRequest(app, method, path, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      const payload = body ? JSON.stringify(body) : null;
      
      const reqHeaders = {
        ...headers
      };
      if (payload) {
        reqHeaders['Content-Type'] = 'application/json';
        reqHeaders['Content-Length'] = Buffer.byteLength(payload);
      }

      const req = http.request(
        {
          host: '127.0.0.1',
          port: port,
          path: path,
          method: method,
          headers: reqHeaders
        },
        (res) => {
          let data = '';
          res.on('data', chunk => { data += chunk; });
          res.on('end', () => {
            server.close();
            let json = null;
            try {
              json = JSON.parse(data);
            } catch (e) {}
            resolve({
              status: res.statusCode,
              headers: res.headers,
              body: json,
              rawBody: data
            });
          });
        }
      );

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (payload) req.write(payload);
      req.end();
    });
  });
}

describe('Express.js Complete Assignment API Test Suite', () => {
  beforeEach(() => {
    ProductService.reset();
  });

  test('GET /api/v1/products should return list of products', async () => {
    const res = await makeRequest(app, 'GET', '/api/v1/products');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'success');
    assert.equal(Array.isArray(res.body.data.products), true);
    assert.equal(res.body.data.products.length, 5);
  });

  test('GET /api/v1/products?category=Electronics should filter results', async () => {
    const res = await makeRequest(app, 'GET', '/api/v1/products?category=Electronics');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.products.length, 2);
  });

  test('GET /api/v1/products/:id with valid numeric ID should return single product', async () => {
    const res = await makeRequest(app, 'GET', '/api/v1/products/101');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.product.name, 'MacBook Pro 16 M3');
  });

  test('GET /api/v1/products/:id with non-numeric ID should trigger router.param validation (400)', async () => {
    const res = await makeRequest(app, 'GET', '/api/v1/products/invalid_id');
    assert.equal(res.status, 400);
    assert.equal(res.body.status, 'fail');
    assert.match(res.body.message, /Invalid product ID format/);
  });

  test('GET /api/v1/products/:id for non-existent ID should return 404', async () => {
    const res = await makeRequest(app, 'GET', '/api/v1/products/999');
    assert.equal(res.status, 404);
    assert.equal(res.body.status, 'fail');
  });

  test('POST /api/v1/products without API Key should return 401 Unauthorized', async () => {
    const payload = { name: 'Test Product', category: 'Electronics', price: 99.99 };
    const res = await makeRequest(app, 'POST', '/api/v1/products', {}, payload);
    assert.equal(res.status, 401);
    assert.equal(res.body.status, 'fail');
  });

  test('POST /api/v1/products with valid API Key and payload should create product (201)', async () => {
    const payload = { name: 'Sony Bravia TV', category: 'Electronics', price: 999.99, stock: 10 };
    const res = await makeRequest(
      app,
      'POST',
      '/api/v1/products',
      { 'x-api-key': 'edquest-secret-key-2026' },
      payload
    );
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'success');
    assert.equal(res.body.data.product.name, 'Sony Bravia TV');
  });

  test('DELETE /api/v1/products/:id with valid API key should return 204 No Content', async () => {
    const res = await makeRequest(
      app,
      'DELETE',
      '/api/v1/products/101',
      { 'x-api-key': 'edquest-secret-key-2026' }
    );
    assert.equal(res.status, 204);
  });

  test('GET /api/v1/system/health should return system metrics', async () => {
    const res = await makeRequest(app, 'GET', '/api/v1/system/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'success');
    assert.ok(res.body.uptime);
  });

  test('GET non-existent route should trigger global 404 error handler', async () => {
    const res = await makeRequest(app, 'GET', '/api/v1/unknown-route');
    assert.equal(res.status, 404);
    assert.equal(res.body.status, 'fail');
    assert.match(res.body.message, /Cannot find/);
  });
});
