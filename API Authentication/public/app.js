let currentAccessToken = '';
let currentRefreshToken = '';

document.addEventListener('DOMContentLoaded', () => {
  console.log('API Authentication Inspector initialized.');
});

// Helper to render JSON response
function displayResponse(boxId, status, data) {
  const box = document.getElementById(boxId);
  const isOk = status >= 200 && status < 300;
  const statusHtml = `<span class="status-indicator ${isOk ? 'status-success' : 'status-error'}"></span>HTTP ${status}`;
  box.innerHTML = `<div><strong>${statusHtml}</strong></div><pre>${JSON.stringify(data, null, 2)}</pre>`;
}

// 1. User Registration
async function registerUser() {
  const username = document.getElementById('regUsername').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, role })
    });
    const data = await res.json();
    displayResponse('authResponse', res.status, data);
  } catch (err) {
    displayResponse('authResponse', 500, { error: err.message });
  }
}

// 2. User Login
async function loginUser() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    displayResponse('authResponse', res.status, data);

    if (res.ok && data.auth) {
      currentAccessToken = data.auth.accessToken;
      currentRefreshToken = data.auth.refreshToken;
      document.getElementById('tokenInput').value = currentAccessToken;
      inspectToken();
    }
  } catch (err) {
    displayResponse('authResponse', 500, { error: err.message });
  }
}

// 3. Quick fill preset users
function fillPreset(role) {
  if (role === 'admin') {
    document.getElementById('loginEmail').value = 'admin@edquest.com';
    document.getElementById('loginPassword').value = 'AdminPass123!';
  } else {
    document.getElementById('loginEmail').value = 'student@edquest.com';
    document.getElementById('loginPassword').value = 'UserPass123!';
  }
}

// 4. Test Protected Endpoint
async function testProtected(endpoint) {
  const token = document.getElementById('tokenInput').value || currentAccessToken;

  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    displayResponse('protectedResponse', res.status, data);
  } catch (err) {
    displayResponse('protectedResponse', 500, { error: err.message });
  }
}

// 5. Test API Key Endpoint
async function testApiKey() {
  const apiKey = document.getElementById('apiKeyInput').value;

  try {
    const res = await fetch('/api/protected/apikey-data', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    });
    const data = await res.json();
    displayResponse('apiKeyResponse', res.status, data);
  } catch (err) {
    displayResponse('apiKeyResponse', 500, { error: err.message });
  }
}

// 6. JWT Token Inspector & Visualizer
async function inspectToken() {
  const token = document.getElementById('tokenInput').value;
  if (!token) return;

  try {
    const res = await fetch('/api/auth/inspect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    const data = await res.json();

    if (res.ok && data.decoded) {
      document.getElementById('jwtHeaderContent').textContent = JSON.stringify(data.decoded.header, null, 2);
      document.getElementById('jwtPayloadContent').textContent = JSON.stringify(data.decoded.payload, null, 2);
      document.getElementById('jwtSigContent').textContent = data.decoded.signatureSnippet;
    } else {
      document.getElementById('jwtHeaderContent').textContent = 'Invalid JWT';
      document.getElementById('jwtPayloadContent').textContent = 'Invalid JWT';
      document.getElementById('jwtSigContent').textContent = 'Invalid JWT';
    }
  } catch (err) {
    console.error('JWT Inspect Error:', err);
  }
}

// 7. OAuth 2.0 Simulation Steps
let oauthCode = '';
async function runOAuthStep1() {
  try {
    const res = await fetch('/api/oauth/authorize?client_id=edquest_demo_client_id&response_type=code&scope=read:profile&state=xyz987');
    const data = await res.json();
    displayResponse('oauthResponse', res.status, data);
    if (data.authorizationCode) {
      oauthCode = data.authorizationCode;
    }
  } catch (err) {
    displayResponse('oauthResponse', 500, { error: err.message });
  }
}

async function runOAuthStep2() {
  try {
    const res = await fetch('/api/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: 'edquest_demo_client_id',
        client_secret: 'edquest_demo_client_secret_99',
        code: oauthCode
      })
    });
    const data = await res.json();
    displayResponse('oauthResponse', res.status, data);
    if (data.access_token) {
      window.lastOAuthToken = data.access_token;
    }
  } catch (err) {
    displayResponse('oauthResponse', 500, { error: err.message });
  }
}

async function runOAuthStep3() {
  const token = window.lastOAuthToken || '';
  try {
    const res = await fetch('/api/oauth/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    displayResponse('oauthResponse', res.status, data);
  } catch (err) {
    displayResponse('oauthResponse', 500, { error: err.message });
  }
}
