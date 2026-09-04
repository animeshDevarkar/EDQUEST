const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'super_secret_jwt_access_key_2026_edquest',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'super_secret_refresh_token_key_2026_edquest',
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  VALID_API_KEYS: new Set([
    'demo-api-key-partner-9988',
    'demo-api-key-client-1234'
  ]),
  OAUTH: {
    CLIENT_ID: 'edquest_demo_client_id',
    CLIENT_SECRET: 'edquest_demo_client_secret_99',
    REDIRECT_URI: 'http://localhost:3000/oauth-callback.html'
  }
};
