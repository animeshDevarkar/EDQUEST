# API Authentication Fundamentals

> **Assignment Submission**: API Authentication Fundamentals  
> **Author**: animeshDevarkar  
> **Repository**: [https://github.com/animeshDevarkar/EDQUEST](https://github.com/animeshDevarkar/EDQUEST)  
> **Project Directory**: `API Authentication`

---

## 📋 Table of Contents
1. [Overview & Project Objectives](#-overview--project-objectives)
2. [Why API Authentication is Crucial](#-why-api-authentication-is-crucial)
3. [Authentication Methods & Deep-Dive Comparison](#-authentication-methods--deep-dive-comparison)
4. [Real-World Architecture & Implementation Scenarios](#-real-world-architecture--implementation-scenarios)
5. [System Architecture & Features](#-system-architecture--features)
6. [API Endpoint Documentation](#-api-endpoint-documentation)
7. [Hands-On Practice & Testing Guide](#-hands-on-practice--testing-guide)
8. [API Security Best Practices](#-api-security-best-practices)
9. [Common Implementation Pitfalls & OWASP API Top 10](#-common-implementation-pitfalls--owasp-api-top-10)
10. [Automated Verification & Test Suite](#-automated-verification--test-suite)

---

## 🌐 Overview & Project Objectives

In modern web architecture, APIs serve as the backbone connecting frontend user interfaces, mobile applications, microservices, and third-party partner systems. Secure API authentication is paramount to ensure that requestors are positively identified and granted strictly appropriate permissions.

This project delivers a complete, production-grade reference implementation in **Node.js & Express** demonstrating:
- **Token-Based Authentication** using JSON Web Tokens (JWT) with Access & Refresh Token rotation.
- **Machine-to-Machine API Key Authentication** for external service integrations.
- **OAuth 2.0 Authorization Code Grant Simulation** showcasing third-party delegated authorization.
- **Security Controls**: Password hashing with `bcryptjs` (10 salt rounds), Role-Based Access Control (RBAC), rate-limiting via `express-rate-limit`, and security headers via `helmet`.
- **Interactive Web Dashboard**: An inline JWT inspector, real-time claim decoder, and endpoint tester.
- **Postman Collection & Automated Test Suite**: Comprehensive verification tooling.

---

## 🔒 Why API Authentication is Crucial

APIs operate over public network boundaries. Without robust authentication and authorization mechanisms, software systems face severe security risks:

1. **Identity Verification & Confidentiality**: Ensures requests originate from genuine users or systems before exchanging sensitive data.
2. **Access Control & Authorization (RBAC)**: Distinguishes between standard users, elevated administrators, and automated services, enforcing principle of least privilege.
3. **Data Integrity & Non-Repudiation**: Prevents unauthorized mutation of backend state and maintains an accurate audit trail of user actions.
4. **Protection Against Automated Attacks**: Prevents credential stuffing, brute force login attempts, and resource exhaustion attacks (DDoS).

---

## ⚖️ Authentication Methods & Deep-Dive Comparison

| Feature / Criteria | Token-Based Authentication (JWT) | OAuth 2.0 Framework | API Keys |
| :--- | :--- | :--- | :--- |
| **Primary Purpose** | User & Session Authentication across stateless APIs | Delegated Authorization & Third-Party Access | Service-to-Service / Developer API Access |
| **State Management** | **Stateless** (Self-contained signature verified on server) | **Delegated / Token-based** (Issued by Authorization Server) | **Stateless** (Database lookup or key verification) |
| **Security Payload** | Encoded Header + Payload + HMAC/RSA Signature | Opaque or JWT Access Tokens + Scopes | Plaintext key string (sent in HTTP headers) |
| **Revocation** | Difficult without short expiry or blacklisting database | Easy (Authorization Server revokes token/refresh token) | Easy (Instantly revoke key in admin database) |
| **User Identity** | Contains user claim attributes (`sub`, `email`, `role`) | Obtains user info via `/userinfo` endpoint using granted scopes | Represents the application/client, not an individual user |
| **Best Use Case** | SPAs, Mobile Apps, Internal Microservices | Third-party integrations ("Sign in with Google/GitHub") | B2B API feeds, Webhooks, Developer SDKs |

---

## 🏗️ Real-World Architecture & Implementation Scenarios

### Scenario A: Single Page Application (SPA) with JWT & Refresh Tokens
- **Flow**: User inputs credentials $\rightarrow$ Server verifies password hash $\rightarrow$ Server issues short-lived **JWT Access Token** (15 mins) and long-lived **Refresh Token** (7 days).
- **Execution**: The client attaches `Authorization: Bearer <token>` to each API request. When access token expires, client uses `/api/auth/refresh` to obtain a fresh token without requiring user to re-login.

### Scenario B: Delegated Third-Party Integration via OAuth 2.0
- **Flow**: Client app redirects user to Authorization Server (`/api/oauth/authorize`) $\rightarrow$ User approves permissions $\rightarrow$ Client receives temporary `authorization_code` $\rightarrow$ Client exchanges code + secret for `access_token` (`/api/oauth/token`) $\rightarrow$ Client requests resources (`/api/oauth/userinfo`).

### Scenario C: Machine-to-Machine Partner API via API Keys
- **Flow**: Partner application receives unique API Key (`x-api-key: demo-api-key-partner-9988`) $\rightarrow$ Server validates key against whitelist and applies partner-specific rate limits.

---

## 🛠️ System Architecture & Features

```
d:\EDquest\API Authentication\
├── config.js                   # Application secrets, token expiries, API key set
├── server.js                   # Express application setup, security headers, routing
├── middleware/
│   ├── authMiddleware.js       # JWT validation & RBAC (requireRole)
│   ├── apiKeyMiddleware.js     # API Key verification
│   └── rateLimiter.js          # Rate-limiting middleware (brute force protection)
├── utils/
│   ├── passwordUtils.js        # Bcrypt password hashing & verification
│   └── tokenUtils.js           # JWT signing, verification, and inspection
├── routes/
│   ├── authRoutes.js           # Register, Login, Refresh, Profile, Inspect
│   ├── protectedRoutes.js      # User Dashboard, Admin Portal (RBAC), API Key data
│   └── oauthRoutes.js          # OAuth 2.0 Authorize, Token, UserInfo endpoints
├── public/
│   ├── index.html              # Interactive Web Control Center
│   ├── styles.css              # Dashboard styling
│   └── app.js                  # Dynamic API tester & live JWT visualizer
├── postman/
│   └── API_Authentication_Fundamentals.postman_collection.json
├── tests/
│   └── api.test.js             # Automated integration test suite
└── README.md                   # Complete technical documentation report
```

---

## 📡 API Endpoint Documentation

### 1. Authentication Endpoints

#### `POST /api/auth/register`
- **Description**: Registers a new user with password hashing (`bcryptjs`).
- **Request Body**:
  ```json
  {
    "username": "alex_student",
    "email": "alex@example.com",
    "password": "StrongPassword123!",
    "role": "user"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "User registered successfully with password hash.",
    "user": { "id": "usr_1788547925000", "username": "alex_student", "email": "alex@example.com", "role": "user" }
  }
  ```

#### `POST /api/auth/login`
- **Description**: Verifies credentials and returns JWT Access Token & Refresh Token.
- **Request Body**:
  ```json
  {
    "email": "student@edquest.com",
    "password": "UserPass123!"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "auth": {
      "tokenType": "Bearer",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "15m"
    }
  }
  ```

#### `GET /api/auth/profile`
- **Description**: Retrieves protected user profile. Requires Bearer Token.
- **Header**: `Authorization: Bearer <accessToken>`

---

### 2. Protected & RBAC Endpoints

#### `GET /api/protected/user-dashboard`
- **Access**: Any authenticated user (`user` or `admin`).
- **Header**: `Authorization: Bearer <accessToken>`

#### `GET /api/protected/admin-dashboard`
- **Access**: Strictly restricted to `admin` role via RBAC middleware.
- **Response (403 Forbidden if student user)**:
  ```json
  {
    "success": false,
    "error": "Forbidden",
    "message": "Role 'user' is not authorized to access this resource. Required role(s): admin"
  }
  ```

#### `GET /api/protected/apikey-data`
- **Access**: Machine-to-machine header authentication.
- **Header**: `x-api-key: demo-api-key-partner-9988`

---

### 3. OAuth 2.0 Simulation Endpoints

- `GET /api/oauth/authorize?client_id=edquest_demo_client_id&response_type=code&scope=read:profile`
- `POST /api/oauth/token` (Body: `grant_type`, `client_id`, `client_secret`, `code`)
- `GET /api/oauth/userinfo` (Header: `Authorization: Bearer <oauthToken>`)

---

## 🧪 Hands-On Practice & Testing Guide

### Option A: Interactive Web Dashboard
1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to: `http://localhost:3000`
3. Use the quick presets (**Fill Admin Credentials** / **Fill Student Credentials**) to login and generate JWT tokens.
4. Inspect the JWT Header, Payload, and Signature in the **Live JWT Token Inspector**.
5. Test RBAC permissions by calling the **User Dashboard** and **Admin Portal**.

---

### Option B: Postman Collection
1. Import `postman/API_Authentication_Fundamentals.postman_collection.json` into Postman.
2. Execute **2. User Login & Issue JWT**. The post-response script automatically sets `{{accessToken}}` into environment variables.
3. Test subsequent protected routes seamlessly!

---

### Option C: cURL Command Line Examples

#### 1. Login Request
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@edquest.com\",\"password\":\"AdminPass123!\"}"
```

#### 2. Protected Profile Access
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

#### 3. API Key Request
```bash
curl -X GET http://localhost:3000/api/protected/apikey-data \
  -H "x-api-key: demo-api-key-partner-9988"
```

---

## 🛡️ API Security Best Practices

1. **Password Hashing**: Store passwords using strong key derivation functions (`bcrypt` with $\ge 10$ rounds, Argon2, or PBKDF2). Never store plaintext passwords.
2. **Short Token Expiration**: Keep JWT Access Token lifespan short (e.g., 15 minutes) to minimize impact if stolen.
3. **Transport Layer Security (TLS/HTTPS)**: Always enforce HTTPS in production to protect bearer tokens and API keys from packet sniffing.
4. **Token Storage**: Store access tokens in memory or `HttpOnly`, `Secure`, `SameSite=Strict` cookies to prevent XSS (Cross-Site Scripting) theft.
5. **Rate Limiting**: Enforce IP-based rate limiting on authentication routes to mitigate brute force attacks.
6. **Least Privilege & Scopes**: Restrict tokens to minimal required scopes and roles.

---

## ⚠️ Common Implementation Pitfalls & OWASP API Top 10

1. **OWASP API1: Broken Object Level Authorization (BOLA)**
   - *Pitfall*: Checking if user is logged in, but not verifying if user owns requested resource ID.
   - *Fix*: Always validate `req.user.id === resource.ownerId` before serving data.
2. **OWASP API2: Broken Authentication (`alg: none` attack)**
   - *Pitfall*: Accepting unsigned JWTs or allowing algorithm substitution (`alg: none` or HS256/RS256 confusion).
   - *Fix*: Explicitly specify allowed algorithms during verification (`jwt.verify(token, secret, { algorithms: ['HS256'] })`).
3. **Hardcoding Secrets in Source Code**
   - *Pitfall*: Committing JWT secrets or API keys to public version control.
   - *Fix*: Store secrets in environment variables (`.env`) loaded at runtime.
4. **Storing Sensitive Information in JWT Payloads**
   - *Pitfall*: Storing passwords, credit card numbers, or PII in JWT payloads.
   - *Fix*: JWT payloads are Base64URL encoded (publicly readable). Store only non-sensitive claims (e.g., `userId`, `role`).

---

## ✅ Automated Verification & Test Suite

The project includes an automated test suite leveraging Node's native test runner (`node:test`).

Run tests using:
```bash
npm test
```

### Test Suite Output Verification:
```
✔ API Health Check (221ms)
✔ Authentication Flow: Student Login & Issue JWT (308ms)
✔ Protected Route Access: Reject Request Without Token (401) (3ms)
✔ Protected Route Access: Accept Valid Bearer Token (200) (83ms)
✔ RBAC Access Control: Student User Accessing Admin Portal (403 Forbidden) (86ms)
✔ RBAC Access Control: Admin User Accessing Admin Portal (200 OK) (87ms)
✔ API Key Authentication: Valid API Key (200 OK) (3ms)
✔ API Key Authentication: Missing / Invalid API Key (401 / 403) (4ms)
✔ OAuth 2.0 Authorization Code Grant Flow Simulation (5ms)

ℹ tests 9 | pass 9 | fail 0
```
