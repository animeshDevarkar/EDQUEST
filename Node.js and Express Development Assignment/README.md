# Real-Time Chat Application with Node.js, Express, MongoDB & Socket.io

A modern, full-stack real-time messaging platform built as part of the **Node.js and Express Development Assignment**.

![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-4.21-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black.svg)
![Mocha & Chai](https://img.shields.io/badge/Tested%20With-Mocha%20%26%20Chai-red.svg)

---

## 🌟 Key Features

- **Node.js & Express RESTful Backend**:
  - Modular Model-View-Controller (MVC) architectural pattern.
  - JWT (JSON Web Token) authentication with password hashing via `bcryptjs`.
  - Secure error handling and request validation.
- **MongoDB Integration**:
  - Mongoose schemas for Users and Chat Messages.
  - Automatic fallback to in-memory MongoDB (`mongodb-memory-server`) for zero-setup execution if a local MongoDB service is not running.
- **Real-Time Communication with Socket.io**:
  - Instant bi-directional messaging with zero delay.
  - Multiple chat channels (`#general`, `#tech`, `#random`).
  - Room member discovery and real-time online user count.
  - Interactive "User is typing..." indicators.
  - Persistent message history stored in MongoDB and loaded upon room entry.
- **Clean, Modern UI**:
  - Sleek dark theme interface designed with CSS variables and flexbox/grid.
  - Dedicated sign-in/registration modal + one-click Guest demo mode.
- **Mocha & Chai Test Suite**:
  - Automated integration and unit tests for Auth APIs, Chat APIs, and Socket.io events.

---

## 📁 Project Structure

```
├── public/                       # Frontend User Interface
│   ├── index.html                # Single-page chat interface
│   ├── css/
│   │   └── style.css             # Polished CSS styles
│   └── js/
│       ├── auth.js               # Frontend auth state management
│       └── chat.js               # Socket.io client logic & DOM updates
├── src/
│   ├── config/
│   │   └── db.js                 # Database connection & memory fallback
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and profile
│   │   └── chatController.js     # Room queries and message history
│   ├── middleware/
│   │   ├── auth.js               # JWT verification middleware
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── Message.js            # Mongoose schema for chat messages
│   │   └── User.js               # Mongoose schema for users
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   └── chatRoutes.js         # /api/chat routes
│   ├── sockets/
│   │   └── chatSocket.js         # Socket.io server events
│   ├── app.js                    # Express app configuration
│   └── server.js                 # HTTP server bootstrap
├── test/
│   ├── setup.js                  # Test suite lifecycle & in-memory DB setup
│   ├── auth.test.js              # Authentication API tests (Mocha & Chai)
│   ├── chat.test.js              # Chat REST endpoints tests
│   └── socket.test.js            # Socket.io real-time event tests
├── .env.example                  # Environment configuration template
├── .gitignore                    # Ignored files
├── package.json                  # Dependencies and scripts
└── DOCUMENTATION.md              # Detailed architecture report & assignment documentation
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone <your-repository-url>
cd "Node.js and Express Development Assignment"
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/chatapp
JWT_SECRET=supersecretjwtkey_for_edquest_assignment_2026
NODE_ENV=development
```
*(Note: If no local MongoDB is detected at `MONGODB_URI`, the server will automatically start an in-memory database instance so the app runs out of the box without setup).*

### 4. Running the Application
Start the application in production/standard mode:
```bash
npm start
```
Or start in development mode with auto-reload:
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🧪 Running Tests (Mocha & Chai)

The project includes an automated test suite verifying auth endpoints, chat APIs, and Socket.io real-time broadcasts.

Run tests using:
```bash
npm test
```

Sample test output:
```
  Authentication API Suite (Mocha & Chai)
    POST /api/auth/register
      ✔ should register a new user and return a JWT token
      ✔ should reject registration if username already exists
      ✔ should return 400 when missing username or password
    POST /api/auth/login
      ✔ should authenticate user and return token with valid credentials
      ✔ should reject login with wrong password
    GET /api/auth/me
      ✔ should return user profile when valid token is provided in headers
      ✔ should reject request when token is missing

  Chat REST API Suite (Mocha & Chai)
    GET /api/chat/rooms
      ✔ should return available chat rooms
    GET /api/chat/messages/:room
      ✔ should return empty list when no messages exist in room
      ✔ should return messages for the specified room
    POST /api/chat/messages
      ✔ should allow authenticated users to post a message
      ✔ should reject unauthenticated message posting with 401
      ✔ should reject message posting with empty content

  Socket.io Real-Time Suite (Mocha & Chai)
    ✔ should connect to the Socket.io server successfully
    ✔ should receive a welcome system message when joining a room
    ✔ should broadcast a chat message to room members

  13 passing
```

---

## 📡 API Reference

### Authentication Endpoints
- `POST /api/auth/register` — Register a new account (`username`, `password`)
- `POST /api/auth/login` — Sign in and receive JWT token (`username`, `password`)
- `GET /api/auth/me` — Retrieve current authenticated user profile (`Bearer <token>`)
- `GET /api/auth/users` — Retrieve all users with online status

### Chat Endpoints
- `GET /api/chat/rooms` — List available chat rooms (`#general`, `#tech`, `#random`)
- `GET /api/chat/messages/:room` — Retrieve message history for a channel
- `POST /api/chat/messages` — Post a message via REST (`room`, `content`)

### Socket.io Events
| Event | Direction | Payload / Description |
|---|---|---|
| `joinRoom` | Client ➔ Server | `{ room: 'general' }` |
| `sendMessage` | Client ➔ Server | `{ room: 'general', content: 'Hello!' }` |
| `newMessage` | Server ➔ Client | `{ id, senderName, avatarColor, room, content, createdAt }` |
| `systemMessage` | Server ➔ Client | `{ text: 'User joined #general', timestamp }` |
| `roomUsers` | Server ➔ Client | `{ room: 'general', users: [...] }` |
| `typing` | Client ➔ Server | `{ room: 'general' }` |
| `userTyping` | Server ➔ Client | `{ username: 'Alice' }` |
| `stopTyping` | Client ➔ Server | `{ room: 'general' }` |

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
