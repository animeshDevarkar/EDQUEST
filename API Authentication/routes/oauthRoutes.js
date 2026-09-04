const express = require('express');
const router = express.Router();
const config = require('../config');

// In-memory store for active OAuth authorization codes & access tokens
const authCodesDB = new Map();
const oauthTokensDB = new Map();

/**
 * GET /api/oauth/authorize
 * Simulates OAuth 2.0 Authorization Server endpoint.
 */
router.get('/authorize', (req, res) => {
  const { client_id, redirect_uri, response_type, state, scope } = req.query;

  if (client_id !== config.OAUTH.CLIENT_ID) {
    return res.status(400).json({
      success: false,
      error: 'invalid_client',
      error_description: 'Client ID is invalid or unregistered.'
    });
  }

  if (response_type !== 'code') {
    return res.status(400).json({
      success: false,
      error: 'unsupported_response_type',
      error_description: 'Only response_type=code (Authorization Code Grant) is supported.'
    });
  }

  // Issue temporary authorization code (valid for 5 mins)
  const authCode = `code_${Math.random().toString(36).substring(2, 12)}_${Date.now()}`;
  authCodesDB.set(authCode, {
    clientId: client_id,
    scope: scope || 'read:profile',
    createdAt: Date.now()
  });

  return res.status(200).json({
    success: true,
    message: 'User approved authorization request.',
    flowStep: 'Step 1: Authorization Granted',
    authorizationCode: authCode,
    state: state || null,
    nextStepInstruction: 'Post authorizationCode to /api/oauth/token with client_secret to exchange for Access Token.'
  });
});

/**
 * POST /api/oauth/token
 * Simulates OAuth 2.0 Token exchange endpoint.
 */
router.post('/token', (req, res) => {
  const { grant_type, client_id, client_secret, code } = req.body;

  if (grant_type !== 'authorization_code') {
    return res.status(400).json({
      error: 'unsupported_grant_type',
      error_description: 'Grant type must be authorization_code'
    });
  }

  if (client_id !== config.OAUTH.CLIENT_ID || client_secret !== config.OAUTH.CLIENT_SECRET) {
    return res.status(401).json({
      error: 'invalid_client',
      error_description: 'Client authentication failed (invalid client_id or client_secret).'
    });
  }

  if (!code || !authCodesDB.has(code)) {
    return res.status(400).json({
      error: 'invalid_grant',
      error_description: 'Authorization code is invalid, expired, or previously redeemed.'
    });
  }

  // Burn authorization code (single-use restriction as per OAuth 2.0 specs RFC 6749)
  const codeDetails = authCodesDB.get(code);
  authCodesDB.delete(code);

  // Issue OAuth Access Token
  const oauthAccessToken = `oauth_at_${Math.random().toString(36).substring(2, 16)}_${Date.now()}`;
  oauthTokensDB.set(oauthAccessToken, {
    clientId: client_id,
    scope: codeDetails.scope,
    user: {
      sub: 'oauth_user_99182',
      name: 'Alex Johnson (OAuth User)',
      email: 'alex.oauth@example.com',
      provider: 'EDQuest OAuth Server'
    }
  });

  return res.status(200).json({
    access_token: oauthAccessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    scope: codeDetails.scope,
    message: 'OAuth 2.0 Access Token issued successfully.'
  });
});

/**
 * GET /api/oauth/userinfo
 * Simulates OAuth 2.0 Resource Server user info endpoint.
 */
router.get('/userinfo', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || !oauthTokensDB.has(token)) {
    return res.status(401).json({
      error: 'invalid_token',
      error_description: 'The access token provided is invalid, revoked, or expired.'
    });
  }

  const tokenData = oauthTokensDB.get(token);

  return res.status(200).json({
    success: true,
    sub: tokenData.user.sub,
    name: tokenData.user.name,
    email: tokenData.user.email,
    provider: tokenData.user.provider,
    grantedScope: tokenData.scope
  });
});

module.exports = router;
