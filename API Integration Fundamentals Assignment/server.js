const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Proxy endpoint to test API calls with latency and status visualization
app.post('/api/test-fetch', async (req, res) => {
  const { url, method = 'GET', headers = {}, body = null } = req.body;
  const startTime = Date.now();

  try {
    const options = {
      method,
      headers: {
        'Accept': 'application/json',
        ...headers
      }
    };

    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, options);
    const duration = Date.now() - startTime;
    const responseHeaders = {};
    response.headers.forEach((val, key) => { responseHeaders[key] = val; });

    let responseData;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    res.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      headers: responseHeaders,
      data: responseData
    });
  } catch (err) {
    const duration = Date.now() - startTime;
    res.status(500).json({
      success: false,
      status: 500,
      statusText: 'Internal Proxy Error',
      duration: `${duration}ms`,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🌐 API Integration Fundamentals Web Server running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop.\n`);
});
