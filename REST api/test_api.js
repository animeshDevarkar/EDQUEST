/**
 * REST API Integration Automated Test Suite
 * Tests HTTP GET requests, status code handling, and JSON response parsing
 * for the Open-Meteo Geocoding and Weather APIs.
 */

const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      const statusCode = res.statusCode;

      if (statusCode < 200 || statusCode >= 300) {
        reject(new Error(`HTTP GET Request Failed with Status Code: ${statusCode}`));
        res.resume();
        return;
      }

      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ statusCode, data: json, headers: res.headers });
        } catch (e) {
          reject(new Error(`Failed to parse JSON response: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Network request error: ${err.message}`));
    });
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('  REST API Integration Test Suite - Starting Tests  ');
  console.log('====================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: Geocoding REST API GET Request
  totalTests++;
  try {
    console.log('[TEST 1] Sending HTTP GET request to Geocoding REST API...');
    const city = 'London';
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    console.log(`         URL: ${geoUrl}`);

    const res = await fetchJson(geoUrl);
    
    if (res.statusCode === 200) {
      console.log('  ✔ HTTP Status Code: 200 OK');
    } else {
      throw new Error(`Unexpected status code: ${res.statusCode}`);
    }

    if (res.data && res.data.results && res.data.results.length > 0) {
      const location = res.data.results[0];
      console.log(`  ✔ JSON Payload Parsed Successfully: Found ${location.name}, ${location.country} (Lat: ${location.latitude}, Lon: ${location.longitude})`);
      passedTests++;
    } else {
      throw new Error('JSON response structure missing expected "results" array');
    }
  } catch (err) {
    console.error(`  ✖ TEST 1 FAILED: ${err.message}`);
  }

  console.log('\n----------------------------------------------------\n');

  // Test 2: Weather Forecast REST API GET Request
  totalTests++;
  try {
    console.log('[TEST 2] Sending HTTP GET request to Weather Forecast REST API...');
    const lat = 51.5074;
    const lon = -0.1278;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
    console.log(`         URL: ${weatherUrl}`);

    const res = await fetchJson(weatherUrl);

    if (res.statusCode === 200) {
      console.log('  ✔ HTTP Status Code: 200 OK');
    } else {
      throw new Error(`Unexpected status code: ${res.statusCode}`);
    }

    if (res.data && res.data.current_weather) {
      const current = res.data.current_weather;
      console.log(`  ✔ JSON Payload Parsed Successfully: Temperature=${current.temperature}°C, WindSpeed=${current.windspeed} km/h`);
      passedTests++;
    } else {
      throw new Error('JSON response structure missing expected "current_weather" object');
    }
  } catch (err) {
    console.error(`  ✖ TEST 2 FAILED: ${err.message}`);
  }

  console.log('\n----------------------------------------------------\n');

  // Test 3: Handling Error Response (400 Bad Request)
  totalTests++;
  try {
    console.log('[TEST 3] Testing API Error Handling (Invalid Latitude)...');
    const invalidUrl = `https://api.open-meteo.com/v1/forecast?latitude=999&longitude=999`;
    console.log(`         URL: ${invalidUrl}`);

    await fetchJson(invalidUrl);
    console.error('  ✖ TEST 3 FAILED: Request should have thrown an HTTP error but succeeded');
  } catch (err) {
    console.log(`  ✔ Gracefully caught API error as expected: "${err.message}"`);
    passedTests++;
  }

  console.log('\n====================================================');
  console.log(`  TEST RESULTS: ${passedTests}/${totalTests} Tests Passed`);
  console.log('====================================================');

  if (passedTests === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
