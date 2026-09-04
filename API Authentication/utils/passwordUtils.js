const bcrypt = require('bcryptjs');

/**
 * Hashes a plaintext password securely using bcrypt.
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} Hashed password string
 */
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compares plaintext password with stored bcrypt hash.
 * @param {string} password - Plaintext password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} Match result
 */
async function comparePassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

module.exports = {
  hashPassword,
  comparePassword
};
