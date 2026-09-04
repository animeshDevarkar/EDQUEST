# Express.js Complete Assignment & Architectural Masterclass

> **Author**: Animesh Devarkar  
> **Repository**: [EDQUEST/Express.js Complete Assignment](https://github.com/animeshDevarkar/EDQUEST/tree/main/Express.js%20Complete%20Assignment)  
> **Tech Stack**: Node.js, Express.js (v4.19), Helmet, CORS, Morgan, Compression, Express-Rate-Limit, Native Node Test Runner  

---

## 📋 Table of Contents
1. [Overview & Introduction to Express.js](#1-overview--introduction-to-expressjs)
2. [Setting Up an Express Application](#2-setting-up-an-express-application)
3. [Express Routing Deep-Dive](#3-express-routing-deep-dive)
4. [Middleware Architecture & Custom Pipeline](#4-middleware-architecture--custom-pipeline)
5. [Building Enterprise REST APIs with Express](#5-building-enterprise-rest-apis-with-express)
6. [Advanced Techniques & Performance Optimization](#6-advanced-techniques--performance-optimization)
7. [Repository Structure & Project Guide](#7-repository-structure--project-guide)
8. [Automated Test Suite & Verification](#8-automated-test-suite--verification)

---

## 1. Overview & Introduction to Express.js

### 1.1 What is Express.js?
**Express.js** (or simply Express) is the standard, minimalist, and highly unopinionated web application framework for **Node.js**. Developed originally by TJ Holowaychuk in 2010 and currently maintained under the OpenJS Foundation, Express serves as the backbone for backend JavaScript development and forms the core of popular technology stacks such as **MERN** (MongoDB, Express, React, Node) and **MEAN** (MongoDB, Express, Angular, Node).

### 1.2 Core Architecture: Native Node.js vs. Express.js
At its core, Node.js provides a low-level `http` module. While capable of serving HTTP traffic, building complex applications directly on raw Node.js requires manual parsing of URLs, manual header management, verbose body chunk decoding, and complex `if/else` route matching logic.

```
       Native Node.js HTTP                        Express.js Framework
 ┌─────────────────────────────┐           ┌────────────────────────────────┐
 │ http.createServer((req,res)│           │ app.use(express.json());       │
 │   - Raw Stream Reading     │   VS      │ app.get('/api/users', (req,res)│
 │   - Manual URL Parsing      │           │   - Built-in Request Parsing   │
 │   - Boilerplate Routing     │           │   - Middleware Pipeline         │
 └─────────────────────────────┘           └────────────────────────────────┘
```

#### Code Comparison
**Native Node.js HTTP Server:**
```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/data' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const data = JSON.parse(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'success', data }));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});
server.listen(3000);
```

**Express.js Implementation:**
```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/data', (req, res) => {
  res.status(200).json({ status: 'success', data: req.body });
});

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.listen(3000);
```

### 1.3 Key Architectural Features
- **Minimal & Flexible**: Unopinionated structure allows developers to choose database engines, folder structures, and view renderers.
- **Middleware Pipeline**: Requests pass through sequential processing steps (logging, auth, parsing, validation) before hitting handlers.
- **Robust Routing**: Built-in regex path matching, param extraction, query string parsing, and router modularization (`express.Router`).
- **High Performance**: Asynchronous, non-blocking I/O event loop foundation capable of processing thousands of concurrent connections.

---

## 2. Setting Up an Express Application

### 2.1 Step-by-Step Setup
1. **Initialize Project & Package Manifest**:
   ```bash
   mkdir express-app && cd express-app
   npm init -y
   ```
2. **Install Dependencies**:
   ```bash
   npm install express dotenv cors helmet morgan compression express-rate-limit
   ```
3. **Environment Configuration (`.env`)**:
   ```env
   PORT=5000
   NODE_ENV=development
   API_PREFIX=/api/v1
   DEMO_API_KEY=edquest-secret-key-2026
   ```

### 2.2 Production-Ready Application Structure
```
express-js-complete-assignment/
├── src/
│   ├── config/
│   │   └── env.js             # Environment variable validation & loader
│   ├── controllers/
│   │   ├── productController.js # REST request/response handling logic
│   │   └── systemController.js  # System metrics & health checks
│   ├── middleware/
│   │   ├── auth.js            # API key & role authorization
│   │   ├── errorHandler.js    # Operational AppError & centralized error handler
│   │   ├── logger.js          # Execution timing & request logger
│   │   ├── rateLimiter.js     # IP rate limiting configurations
│   │   └── validate.js        # Request payload schema validation
│   ├── routes/
│   │   ├── productRoutes.js   # Modular product resource routes
│   │   └── systemRoutes.js    # System health diagnostics
│   ├── services/
│   │   └── productService.js  # Business logic & data persistence layer
│   ├── public/
│   │   └── index.html         # Interactive API Client & Web Dashboard
│   ├── app.js                 # Express application instantiation & pipeline configuration
│   └── server.js              # Server bootstrapper & process exception listener
├── test/
│   └── api.test.js            # Automated integration tests using Node test runner
├── .env.example
├── package.json
└── README.md
```

---

## 3. Express Routing Deep-Dive

Express routing defines how an application responds to client requests to particular endpoints (URIs) and HTTP request methods (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`).

### 3.1 HTTP Method Handlers
```javascript
// Basic Route Handlers
app.get('/api/v1/products', (req, res) => { /* Fetch products */ });
app.post('/api/v1/products', (req, res) => { /* Create product */ });
app.put('/api/v1/products/:id', (req, res) => { /* Replace product */ });
app.patch('/api/v1/products/:id', (req, res) => { /* Partial update */ });
app.delete('/api/v1/products/:id', (req, res) => { /* Delete product */ });
```

### 3.2 Dynamic Route Parameters & Query Strings
Express automatically extracts path variables into `req.params` and URL search parameters into `req.query`:

```javascript
// Route: GET /api/v1/products/101?category=Electronics&page=2
app.get('/api/v1/products/:id', (req, res) => {
  const { id } = req.params;          // '101'
  const { category, page } = req.query; // category: 'Electronics', page: '2'

  res.json({ id, category, page });
});
```

### 3.3 Param Middleware (`router.param`)
Param middleware functions execute automatically whenever a specific route parameter is present in the path:

```javascript
// Pre-validate numeric ID parameter for all routes in this router
router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      status: 'fail',
      message: `Invalid product ID '${id}'. ID must be a numeric integer.`
    });
  }
  next();
});
```

### 3.4 Modular Router (`express.Router`) & Route Chaining (`router.route()`)
```javascript
const express = require('express');
const router = express.Router();

// Chain multiple HTTP handlers to the same endpoint path
router.route('/products')
  .get(productController.getProducts)
  .post(requireApiKey, validateProduct, productController.createProduct);

router.route('/products/:id')
  .get(productController.getProductById)
  .put(requireApiKey, validateProduct, productController.updateProduct)
  .delete(requireApiKey, requireRole('admin'), productController.deleteProduct);

module.exports = router;
```

---

## 4. Middleware Architecture & Custom Pipeline

Middleware functions are functions that have access to the Request object (`req`), the Response object (`res`), and the `next` middleware function in the application's request-response cycle.

```
 Client Request ──> [ Helmet ] ──> [ CORS ] ──> [ JSON Parser ] ──> [ Auth Guard ] ──> Controller
                                                                                          │
 Client Response <── [ Gzip Compression ] <── [ Response Payload / Central Error ] <──────┘
```

### 4.1 Categories of Middleware

| Category | Description | Example |
|---|---|---|
| **Built-in** | Included natively with Express | `express.json()`, `express.urlencoded()`, `express.static()` |
| **Application-level** | Bound to an instance of `app` using `app.use()` | `app.use(cors())`, `app.use(logger)` |
| **Router-level** | Bound to an instance of `express.Router()` | `router.use('/admin', authGuard)` |
| **Error-handling** | Accepts four arguments `(err, req, res, next)` | Centralized error formatter |
| **Third-party** | Node modules installed via npm | `helmet`, `morgan`, `compression`, `express-rate-limit` |

### 4.2 Writing Custom Middleware Examples

#### 1. Request Timing & Logger Middleware
```javascript
const customLogger = (req, res, next) => {
  const startTime = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(startTime);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${timeInMs}ms`);
  });

  next();
};
```

#### 2. Authentication & Header Guard Middleware
```javascript
const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;

  if (!apiKey || apiKey !== process.env.DEMO_API_KEY) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Missing or invalid X-API-KEY header'
    });
  }
  
  req.user = { id: 'usr_admin', role: 'admin' };
  next();
};
```

#### 3. Centralized Error-Handling Middleware
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};
```

---

## 5. Building Enterprise REST APIs with Express

REST (Representational State Transfer) APIs provide standardized stateless access to application resources.

### 5.1 HTTP Method & Status Code Standard

| Resource Action | HTTP Method | Endpoint Path | Success Status Code | Failure Status Code |
|---|---|---|---|---|
| Read All Products | `GET` | `/api/v1/products` | `200 OK` | `500 Internal Error` |
| Read Product | `GET` | `/api/v1/products/:id` | `200 OK` | `400 Bad Param` / `404 Not Found` |
| Create Product | `POST` | `/api/v1/products` | `201 Created` | `400 Validation Error` / `401 Unauthorized` |
| Replace Product | `PUT` | `/api/v1/products/:id` | `200 OK` | `404 Not Found` / `400 Bad Body` |
| Delete Product | `DELETE` | `/api/v1/products/:id` | `204 No Content` | `403 Forbidden` / `404 Not Found` |

### 5.2 Controller Implementation (Clean Response Envelope Pattern)
```javascript
const getProducts = catchAsync(async (req, res) => {
  const result = ProductService.getAll(req.query);

  res.status(200).json({
    status: 'success',
    results: result.data.length,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    },
    data: {
      products: result.data
    }
  });
});
```

---

## 6. Advanced Techniques & Performance Optimization

### 6.1 Security Best Practices
1. **HTTP Security Headers (`helmet`)**: Sets security headers like `X-Frame-Options`, `X-Content-Type-Options`, and `Strict-Transport-Security`.
2. **Rate Limiting (`express-rate-limit`)**: Prevents Brute-Force and Denial of Service (DoS) attacks by capping requests per IP window.
   ```javascript
   const apiLimiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // Limit each IP to 100 requests per windowMs
     standardHeaders: true
   });
   app.use('/api/', apiLimiter);
   ```
3. **CORS Guard**: Prevents unauthorized cross-origin requests from external web browsers.

### 6.2 Performance Optimization & Scaling
1. **Gzip Response Compression (`compression`)**: Decreases HTTP payload sizes by up to 70-80% for JSON and static assets.
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```
2. **Node.js Clustering & Multi-core PM2 Execution**:
   Node.js runs on a single thread. Utilizing Node's native `cluster` module or **PM2 process manager** spawns worker processes per CPU core:
   ```javascript
   const cluster = require('cluster');
   const os = require('os');

   if (cluster.isMaster) {
     const numCPUs = os.cpus().length;
     for (let i = 0; i < numCPUs; i++) cluster.fork();
   } else {
     require('./src/server.js');
   }
   ```
3. **Asynchronous Non-Blocking I/O**: Eliminating synchronous blocking calls (`fs.readFileSync`) ensures high throughput event-loop responsiveness.

---

## 7. Repository Structure & Project Guide

This repository contains a full working implementation of the Express.js concepts documented above.

### 7.1 Running the Server Locally
```bash
# 1. Navigate to project folder
cd "Express.js Complete Assignment"

# 2. Install dependencies
npm install

# 3. Start the Express server
npm start
```
The server will launch at:
- **API Base URL**: `http://localhost:5000/api/v1`
- **Interactive Web Dashboard**: `http://localhost:5000`

---

## 8. Automated Test Suite & Verification

The project includes an automated test suite using Node's native `node:test` runner.

### Running Automated Tests:
```bash
npm test
```

### Test Suite Execution Output:
```text
✔ GET /api/v1/products should return list of products (45ms)
✔ GET /api/v1/products?category=Electronics should filter results (8ms)
✔ GET /api/v1/products/:id with valid numeric ID should return single product (6ms)
✔ GET /api/v1/products/:id with non-numeric ID should trigger router.param validation (400) (6ms)
✔ GET /api/v1/products/:id for non-existent ID should return 404 (6ms)
✔ POST /api/v1/products without API Key should return 401 Unauthorized (182ms)
✔ POST /api/v1/products with valid API Key and payload should create product (201) (5ms)
✔ DELETE /api/v1/products/:id with valid API key should return 204 No Content (4ms)
✔ GET /api/v1/system/health should return system metrics (7ms)
✔ GET non-existent route should trigger global 404 error handler (7ms)

ℹ tests 10 | pass 10 | fail 0 | duration 2.7s
```

---
**EDQUEST Development Assignment** | Animesh Devarkar
