const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Generates a signed JWT Access Token.
 * @param {object} payload - User object payload (id, email, role)
 * @returns {string} Signed JWT Access Token
 */
function generateAccessToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.ACCESS_TOKEN_EXPIRY,
    issuer: 'EDQuest-Auth-API'
  });
}

/**
 * Generates a signed JWT Refresh Token.
 * @param {object} payload - User object payload (id)
 * @returns {string} Signed JWT Refresh Token
 */
function generateRefreshToken(payload) {
  return jwt.sign(payload, config.REFRESH_TOKEN_SECRET, {
    expiresIn: config.REFRESH_TOKEN_EXPIRY,
    issuer: 'EDQuest-Auth-API'
  });
}

/**
 * Verifies a JWT Access Token.
 * @param {string} token 
 * @returns {object} Decoded payload
 */
function verifyAccessToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}

/**
 * Verifies a JWT Refresh Token.
 * @param {string} token 
 * @returns {object} Decoded payload
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, config.REFRESH_TOKEN_SECRET);
}

/**
 * Decodes a token without verifying signature (for inspection/debugging).
 * @param {string} token 
 * @returns {object|null}
 */
function decodeTokenDetails(token) {
  try {
    const decoded = jwt.decode(token, { complete: true });
    return decoded;
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeTokenDetails
};
