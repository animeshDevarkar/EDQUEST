/**
 * API Integration Fundamentals - CLI Demonstration Script
 * Demonstrating REST API consumption, error handling, status code processing,
 * and exponential backoff retry mechanisms.
 */

// Native fetch available in Node.js 18+
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Robust API Fetcher with Exponential Backoff
 */
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`\n[REQUEST] Attempt ${attempt}/${retries}: GET ${url}`);
      const startTime = Date.now();
      const response = await fetch(url, options);
      const duration = Date.now() - startTime;

      console.log(`[RESPONSE] Status: ${response.status} ${response.statusText} (${duration}ms)`);

      if (!response.ok) {
        // HTTP 4xx or 5xx
        if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
          throw new Error(`Transient Server Error (HTTP ${response.status})`);
        } else {
          // Non-retryable error (e.g. 404, 401)
          const errorData = await response.json().catch(() => ({}));
          return {
            success: false,
            status: response.status,
            error: `Client Error (${response.status}): ${response.statusText}`,
            data: errorData
          };
        }
      }

      const data = await response.json();
      return {
        success: true,
        status: response.status,
        duration: `${duration}ms`,
        data
      };
    } catch (err) {
      console.warn(`⚠️ [WARNING] Attempt ${attempt} failed: ${err.message}`);
      if (attempt < retries) {
        console.log(`⏳ Waiting ${delay}ms before retrying...`);
        await sleep(delay);
        delay *= 2; // Exponential backoff multiplier
      } else {
        return {
          success: false,
          error: `Max retries reached. Last error: ${err.message}`
        };
      }
    }
  }
}

/**
 * Main Execution Workflow
 */
async function runDemo() {
  console.log("=================================================");
  console.log("🚀 API INTEGRATION FUNDAMENTALS - LOCAL DEMO");
  console.log("=================================================");

  // Demo 1: Fetching User Data from Public REST API (JSONPlaceholder)
  console.log("\n--- DEMO 1: Standard REST API Fetch (GET User Details) ---");
  const userResult = await fetchWithRetry('https://jsonplaceholder.typicode.com/users/1');
  if (userResult.success) {
    console.log("✅ Success! User Profile Retrieved:");
    console.log(`   - Name: ${userResult.data.name}`);
    console.log(`   - Username: ${userResult.data.username}`);
    console.log(`   - Email: ${userResult.data.email}`);
    console.log(`   - Company: ${userResult.data.company.name}`);
  } else {
    console.error("❌ Failed:", userResult.error);
  }

  // Demo 2: Handling 404 Not Found (Non-retryable Client Error)
  console.log("\n--- DEMO 2: Error Handling (404 Not Found Resource) ---");
  const notFoundResult = await fetchWithRetry('https://jsonplaceholder.typicode.com/users/9999');
  console.log(`Result: Success=${notFoundResult.success}, Status=${notFoundResult.status}`);
  console.log(`Error Message: ${notFoundResult.error}`);

  // Demo 3: Fetching Weather Data (Open-Meteo Public REST API)
  console.log("\n--- DEMO 3: Real-World Public API Integration (Open-Meteo Weather) ---");
  const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current_weather=true';
  const weatherResult = await fetchWithRetry(weatherUrl);
  if (weatherResult.success) {
    const current = weatherResult.data.current_weather;
    console.log("✅ Success! Current Weather in Pune, India:");
    console.log(`   - Temperature: ${current.temperature}°C`);
    console.log(`   - Windspeed: ${current.windspeed} km/h`);
    console.log(`   - Weather Code: ${current.weathercode}`);
    console.log(`   - Time: ${current.time}`);
  } else {
    console.error("❌ Failed:", weatherResult.error);
  }

  // Demo 4: Creating a Resource via POST Request
  console.log("\n--- DEMO 4: Creating Resource via HTTP POST (JSON Payload) ---");
  const postPayload = {
    title: "API Integration Assignment Submission",
    body: "Exploring REST, SOAP, GraphQL, HTTP Methods, and Resilience",
    userId: 1
  };
  
  const postResult = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    body: JSON.stringify(postPayload)
  });

  if (postResult.success) {
    console.log("✅ Success! New Resource Created (HTTP 201):");
    console.log(`   - Created ID: ${postResult.data.id}`);
    console.log(`   - Title: ${postResult.data.title}`);
  } else {
    console.error("❌ Failed:", postResult.error);
  }

  console.log("\n=================================================");
  console.log("🎉 ALL API DEMOS COMPLETED SUCCESSFULLY!");
  console.log("=================================================\n");
}

runDemo();
