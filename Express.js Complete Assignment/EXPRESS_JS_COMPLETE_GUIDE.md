# Express.js Complete Guide: Architecture, Routing, Middleware & REST APIs

> **Comprehensive Technical Guide on Express.js Framework & Production REST Engineering**  
> **Author**: Animesh Devarkar  
> **Repository**: [EDQUEST/Express.js Complete Assignment](https://github.com/animeshDevarkar/EDQUEST/tree/main/Express.js%20Complete%20Assignment)  

---

## 1. Introduction to Express.js Framework

### 1.1 What is Express.js?
**Express.js** is a fast, unopinionated, minimalist web framework for Node.js. It simplifies the development of web applications and RESTful APIs by providing a thin layer of fundamental web application features, without obscuring Node.js features that developers know and love.

### 1.2 Core Benefits
- **Speed & Efficiency**: Lightweight abstractions sitting directly on top of Node.js event loop.
- **Middleware System**: Modular request-response pipeline.
- **Routing Engine**: Powerful URL pattern matching and router grouping.
- **Ecosystem**: Thousands of npm packages engineered specifically as Express middlewares (Cors, Helmet, Morgan, Passport, Multer).

---

## 2. Express Setup & Configuration

### 2.1 Installation
```bash
npm install express dotenv cors helmet morgan compression express-rate-limit
```

### 2.2 Application Instantiation (`src/app.js`)
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Global Middleware Stack
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

module.exports = app;
```

---

## 3. Express Routing Masterclass

Routing refers to determining how an application responds to a client request to a particular endpoint.

### 3.1 Routing Features
- **Route Parameters (`req.params`)**: Extract path values like `/users/:id`.
- **Query Parameters (`req.query`)**: Parse search parameters like `/products?search=macbook`.
- **Param Validation (`router.param`)**: Intercept and validate params before hitting controller routes.
- **Route Chaining (`router.route`)**: Bind multiple HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`) to a single endpoint URI.

```javascript
const router = require('express').Router();

router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid ID format' });
  }
  next();
});

router.route('/items')
  .get((req, res) => res.json({ items: [] }))
  .post((req, res) => res.status(201).json({ created: true }));

module.exports = router;
```

---

## 4. Middleware Execution Model

In Express, everything is a middleware function. Middleware functions have access to the `req` object, `res` object, and the `next` function.

```javascript
function sampleMiddleware(req, res, next) {
  // 1. Perform logic (e.g. logging, token check)
  console.log(`Incoming request: ${req.method} ${req.url}`);
  
  // 2. Pass control to the next middleware in line
  next();
}
```

### 4.1 Global Error Handling Middleware
Express recognizes error-handling middleware by checking for four parameters: `(err, req, res, next)`:

```javascript
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message: err.message
  });
});
```

---

## 5. Building REST APIs & Optimization

### 5.1 RESTful Architecture Standards
- Standardized HTTP Verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`).
- Resource-oriented plural paths (`/api/v1/products`).
- Uniform status codes (`200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`).

### 5.2 Security & Performance
- **Helmet**: Secures HTTP response headers.
- **Rate Limiting**: Protects against denial-of-service (DoS).
- **Compression**: Compresses JSON responses using Gzip.
- **Layered Architecture**: Decouples logic into `Routes -> Middlewares -> Controllers -> Services`.

---
**EDQUEST Express.js Assignment** | Animesh Devarkar
