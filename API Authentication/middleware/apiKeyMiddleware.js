const config = require('../config');

/**
 * Middleware to authenticate requests using API Key in headers (`x-api-key`).
 */
function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'API Key missing. Provide x-api-key header or api_key query parameter.'
    });
  }

  if (!config.VALID_API_KEYS.has(apiKey)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Invalid API Key provided.'
    });
  }

  req.apiKey = apiKey;
  next();
}

module.exports = {
  authenticateApiKey
};
