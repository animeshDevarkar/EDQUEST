# Node.js and Express Development Assignment: Technical Report & Process Documentation

**Course / Module**: Node.js and Express Development Assignment  
**Author**: Assignment Submission  
**Date**: September 2026  

---

## 1. Executive Summary

This document provides a comprehensive analysis and technical walkthrough of the design, development, and testing of a real-time chat application built using **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and **Socket.io**, validated through automated testing with **Mocha** and **Chai**.

The application fulfills all fundamental objectives specified in the assignment brief:
1. Exploring and applying **Node.js architecture** and its event-driven ecosystem.
2. Setting up a modular, scalable project structure with strict environment separation.
3. Integrating a **NoSQL MongoDB database** for persisting user profiles, encrypted credentials, and chat histories.
4. Implementing full-duplex, low-latency **bi-directional communication via Socket.io** with channel support and typing notifications.
5. Establishing a complete automated test suite using **Mocha and Chai**.

---

## 2. Node.js Architecture and Core Concepts

### 2.1 Single-Threaded Event Loop
Node.js executes JavaScript on a single thread powered by the Google Chrome **V8 JavaScript engine** and **libuv**:
- **Non-blocking I/O**: Network, filesystem, and database operations are delegated to OS asynchronous primitives or libuv's thread pool.
- **Event-Driven Architecture**: The event loop continuously polls for events, dequeues callback functions, and processes them without blocking concurrent requests.
- **Suitability for Real-Time Applications**: This architecture makes Node.js exceptionally well-suited for high-concurrency, I/O-intensive workloads like real-time chat servers where thousands of concurrent socket connections remain idle or push micro-payloads.

### 2.2 Express.js Micro-Framework
Express.js acts as an unopinionated routing and middleware layer on top of Node's native `http` module. In this project:
- **Middleware Pipeline**: Requests sequentially pass through `cors()`, `express.json()`, authentication filters, route dispatchers, and centralized error handling middleware.
- **Modular Routing**: Routes are logically divided into `/api/auth` and `/api/chat` using `express.Router()`.

---

## 3. Environment Setup & Configuration

### 3.1 Project Initialization & Dependencies
The application uses standard npm packaging:
- **Production Dependencies**:
  - `express`: Web server routing and REST API framework.
  - `socket.io`: Real-time WebSocket engine with polling fallbacks.
  - `mongoose`: MongoDB Object Data Modeling (ODM) library.
  - `dotenv`: Loads environment variables from `.env` files into `process.env`.
  - `bcryptjs`: Secure blowfish-based password hashing with salt generation.
  - `jsonwebtoken`: Stateless token generation for RESTful session authorization.
  - `cors`: Cross-Origin Resource Sharing middleware.
- **Testing & Development Dependencies**:
  - `mocha`: Asynchronous test framework runner.
  - `chai`: BDD/TDD assertion library providing `expect` syntaxes.
  - `supertest`: HTTP assertions for Express endpoint testing.
  - `socket.io-client`: Programmatic WebSocket client for testing live events.
  - `mongodb-memory-server`: Self-contained in-memory MongoDB daemon for testing and zero-configuration local runs.

### 3.2 Configuration Management
All dynamic variables (port number, database URIs, secret keys, environment modes) are centralized in environment variables with sensible defaults:
- `PORT` (Default: `3000`)
- `MONGODB_URI` (Default: `mongodb://127.0.0.1:27017/chatapp`)
- `JWT_SECRET` (Cryptographic key for signing tokens)
- `NODE_ENV` (`development`, `production`, `test`)

---

## 4. Database Integration (MongoDB & Mongoose)

### 4.1 Schema Modeling
The application utilizes two core Mongoose models:

#### 1. `User` Schema
```javascript
{
  username: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
  password: { type: String, required: true, minlength: 6 },
  avatarColor: { type: String, default: '#4F46E5' },
  isOnline: { type: Boolean, default: false }
}
```
- **Security**: Pre-save Mongoose hook transparently hashes passwords using `bcrypt.genSalt(10)` and `bcrypt.hash()`.
- **Sanitization**: Overridden `toJSON()` method strips out password hashes before returning user entities to client callers.

#### 2. `Message` Schema
```javascript
{
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  avatarColor: { type: String, default: '#4F46E5' },
  room: { type: String, required: true, default: 'general' },
  content: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now }
}
```
- **Compound Indexing**: Indexed on `{ room: 1, createdAt: -1 }` for sub-millisecond retrieval of recent room chat histories.

### 4.2 High Availability & In-Memory Fallback
To ensure that evaluators or developers can test the application without needing an already-running local MongoDB daemon or an active internet connection to MongoDB Atlas, `src/config/db.js` incorporates an automatic fallback:
- It first attempts connection to `process.env.MONGODB_URI`.
- If connection fails or is unavailable, it boots an isolated `mongodb-memory-server` instance and binds Mongoose seamlessly.

---

## 5. Real-Time Chat Engine (Socket.io)

### 5.1 Protocol Overview
HTTP request-response is half-duplex; Socket.io provides full-duplex communication on top of WebSockets with automatic reconnection, heartbeat ping/pong, and long-polling fallbacks.

### 5.2 Event Flow Architecture
```
Client A                     Socket.io Server                     Client B
   |                                |                                |
   |---- [joinRoom: 'general'] ---->|                                |
   |<--- [systemMessage: Welcome] --|                                |
   |                                |--- [systemMessage: Joined] --->|
   |                                |                                |
   |---- [typing: 'general'] ------>|                                |
   |                                |--- [userTyping: Client A] ---->|
   |                                |                                |
   |---- [sendMessage: 'Hi!'] ----->| (Persists in MongoDB)          |
   |<--- [newMessage: 'Hi!'] -------|--- [newMessage: 'Hi!'] ------->|
```

1. **Authentication Handshake**:
   - Clients pass their JWT token in `auth.token` during initial handshake.
   - Server verifies token validity and associates the socket session with the verified user identity.
2. **Channel Rooms**:
   - Supported channels include `#general`, `#tech`, and `#random`.
   - Rooms isolate message broadcasts using `socket.join(room)` and `io.to(room).emit()`.
3. **Typing Indicators**:
   - User typing events are debounced on the client (1.5s) and broadcast via `socket.to(room).emit('userTyping')`.
4. **History Synchronization**:
   - When a user joins or switches a channel, recent history is fetched from `/api/chat/messages/:room` and populated into the feed.

---

## 6. Testing with Mocha & Chai

### 6.1 Test Suite Organization
Tests are housed in the `/test` directory and executed via `npm test`:
- `test/setup.js`: Hooks `before` and `after` suite lifecycles to configure an in-memory database and drop collections cleanly.
- `test/auth.test.js`:
  - Validates user registration with success (201) and duplicate prevention (400).
  - Validates login authentication, password rejection, and JWT generation.
  - Validates protected routes (`/api/auth/me`) requiring valid `Bearer` tokens.
- `test/chat.test.js`:
  - Validates room listing endpoint (`GET /api/chat/rooms`).
  - Validates room message history querying (`GET /api/chat/messages/:room`).
  - Validates message submission with and without authorization headers.
- `test/socket.test.js`:
  - Verifies socket connectivity over a dynamic ephemeral port.
  - Verifies room join acknowledgement and welcome broadcasts.
  - Verifies bidirectional message broadcast and receipt.

---

## 7. Submission Details Summary

Below is the verified project information formatted for the submission portal:

| Submission Field | Input Value |
|---|---|
| **Title** | Real-Time Chat Application using Node.js, Express, MongoDB & Socket.io |
| **Link** | *GitHub repository URL (e.g. `https://github.com/<your-username>/node-express-realtime-chat`)* |

---

## 8. Conclusion
The developed system demonstrates the full capabilities of modern Node.js and Express web development. The combination of RESTful API services for authentication and data retrieval, alongside Socket.io for low-latency stateful events and Mongoose for structured schema enforcement, represents standard, enterprise-grade architecture.
