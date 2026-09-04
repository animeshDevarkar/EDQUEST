const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken, decodeTokenDetails } = require('../utils/tokenUtils');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authRateLimiter } = require('../middleware/rateLimiter');

// In-memory database simulation for users & active refresh tokens
const usersDB = [];
const refreshTokensDB = new Set();

// Pre-seed mock users (Async initialization function)
async function seedDefaultUsers() {
  if (usersDB.length === 0) {
    const adminHashed = await hashPassword('AdminPass123!');
    const userHashed = await hashPassword('UserPass123!');

    usersDB.push({
      id: 'usr_admin_01',
      username: 'admin',
      email: 'admin@edquest.com',
      password: adminHashed,
      role: 'admin'
    });

    usersDB.push({
      id: 'usr_student_02',
      username: 'student',
      email: 'student@edquest.com',
      password: userHashed,
      role: 'user'
    });
  }
}
seedDefaultUsers();

/**
 * POST /api/auth/register - Register new user with hashed password
 */
router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Username, email, and password are required fields.'
      });
    }

    const existingUser = usersDB.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'User with this email or username already exists.'
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      id: `usr_${Date.now()}`,
      username,
      email,
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'user'
    };

    usersDB.push(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully with password hash.',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/login - Authenticate user & issue JWT Access & Refresh Tokens
 */
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Email and password are required.'
      });
    }

    const user = usersDB.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid credentials. User not found.'
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid credentials. Password incorrect.'
      });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken({ id: user.id });

    refreshTokensDB.add(refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful. Token-based session established.',
      auth: {
        tokenType: 'Bearer',
        accessToken,
        refreshToken,
        expiresIn: '15m'
      },
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/auth/refresh - Exchange Refresh Token for new Access Token
 */
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: 'Bad Request',
      message: 'Refresh token is required.'
    });
  }

  if (!refreshTokensDB.has(refreshToken)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Invalid or revoked refresh token.'
    });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = usersDB.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const newAccessToken = generateAccessToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return res.status(200).json({
      success: true,
      message: 'New Access Token generated successfully.',
      accessToken: newAccessToken,
      tokenType: 'Bearer',
      expiresIn: '15m'
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Expired or invalid refresh token.'
    });
  }
});

/**
 * POST /api/auth/logout - Revoke Refresh Token
 */
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    refreshTokensDB.delete(refreshToken);
  }
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully. Refresh token revoked.'
  });
});

/**
 * GET /api/auth/profile - Protected User Profile route
 */
router.get('/profile', authenticateToken, (req, res) => {
  const user = usersDB.find(u => u.id === req.user.id);
  return res.status(200).json({
    success: true,
    message: 'Protected resource accessed successfully using valid Bearer JWT.',
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    },
    tokenClaims: {
      issuer: req.user.iss,
      issuedAt: new Date(req.user.iat * 1000).toISOString(),
      expiresAt: new Date(req.user.exp * 1000).toISOString()
    }
  });
});

/**
 * POST /api/auth/inspect - Utility route to decode JWT payload & headers
 */
router.post('/inspect', (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, message: 'Token string required' });
  }
  const decoded = decodeTokenDetails(token);
  if (!decoded) {
    return res.status(400).json({ success: false, message: 'Invalid JWT structure' });
  }

  return res.status(200).json({
    success: true,
    decoded: {
      header: decoded.header,
      payload: decoded.payload,
      signatureSnippet: decoded.signature ? `${decoded.signature.slice(0, 10)}...[SECRET]` : 'N/A'
    }
  });
});

module.exports = router;
