# REST API Weather Explorer & Inspector Dashboard

> **EDQUEST Assignment Project**: Exploring and Implementing REST APIs

![REST Weather API](https://img.shields.io/badge/REST_API-Open--Meteo-blue?style=for-the-badge&logo=fastapi)
![License](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=for-the-badge&logo=javascript)

## 📌 Project Overview

This project is a comprehensive implementation for the **Exploring and Implementing REST APIs** assignment. It combines a production-grade, interactive Weather Dashboard with a real-time **REST API Response Inspector**, an automated Node.js test suite, and an in-depth theoretical report detailing REST architectural constraints, HTTP methods, status codes, JSON payload processing, and industry case studies.

---

## 🚀 Key Features

1. **Live Weather Dashboard**:
   - Integrated with **Open-Meteo REST APIs** (Geocoding & Forecast endpoints).
   - Real-time city search with debounced autocomplete.
   - Presets for popular world cities (London, New York, Tokyo, Paris, Mumbai, Sydney) and HTML5 Geolocation support.
   - Visual weather cards: Current temperature, high/low, humidity, pressure, wind direction, precipitation, 24-hour forecast carousel, and 7-day daily forecast.

2. **Live REST API Inspector**:
   - Inspect actual HTTP GET URLs sent over the wire.
   - Status code indicators (`200 OK`, `400 Bad Request`), network latency timer (ms), and content headers.
   - Formatted, collapsible JSON response viewer with color-coded key/value syntax highlighting.
   - Dynamic **Client Code Snippet Generator** supporting **JavaScript (`fetch`)**, **Python (`requests`)**, and **cURL**.

3. **Theoretical Documentation & Case Studies**:
   - Built-in documentation tab explaining Roy Fielding's REST constraints (Statelessness, Client-Server separation, Cacheability, Uniform Interface).
   - HTTP Verbs matrix (`GET`, `POST`, `PUT`, `DELETE`) & status codes.
   - Real-world industry case studies analyzing **Stripe API**, **Twilio API**, and **Google Maps Platform API**.

4. **Automated Integration Test Suite**:
   - `test_api.js`: Node.js test script verifying HTTP GET connection, status codes, JSON response parsing, and graceful error handling.

---

## 📁 Repository Directory Structure

```
.
├── index.html       # Main Web Application & REST API Inspector UI
├── styles.css       # Glassmorphism styling, layout, dark theme & syntax colors
├── app.js           # WeatherAPI class, DOM controller, JSON syntax highlighter & snippet generator
├── test_api.js      # Automated Node.js integration test script
├── REPORT.md        # Comprehensive assignment research report & code walkthrough
└── README.md        # Project documentation and running instructions
```

---

## 🛠️ How to Run Locally

### 1. View Web Application in Browser
Simply open `index.html` in any web browser:
- Double-click `index.html`, OR
- Use Live Server in VS Code / Antigravity IDE, OR
- Serve locally using Python:
  ```bash
  python -m http.server 8000
  ```
  Then navigate to `http://localhost:8000`.

### 2. Execute Automated Integration Tests
Run the Node.js test script in your terminal to verify REST API endpoints:
```bash
node test_api.js
```

---

## 🧪 Test Results Output

```text
====================================================
  REST API Integration Test Suite - Starting Tests  
====================================================

[TEST 1] Sending HTTP GET request to Geocoding REST API...
         URL: https://geocoding-api.open-meteo.com/v1/search?name=London&count=1&language=en&format=json
  ✔ HTTP Status Code: 200 OK
  ✔ JSON Payload Parsed Successfully: Found London, United Kingdom (Lat: 51.50853, Lon: -0.12574)

----------------------------------------------------

[TEST 2] Sending HTTP GET request to Weather Forecast REST API...
         URL: https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto
  ✔ HTTP Status Code: 200 OK
  ✔ JSON Payload Parsed Successfully: Temperature=19.2°C, WindSpeed=17.6 km/h

----------------------------------------------------

[TEST 3] Testing API Error Handling (Invalid Latitude)...
         URL: https://api.open-meteo.com/v1/forecast?latitude=999&longitude=999
  ✔ Gracefully caught API error as expected: "HTTP GET Request Failed with Status Code: 400"

====================================================
  TEST RESULTS: 3/3 Tests Passed
====================================================
```

---

## 📜 Report & Findings

Read the full research report in [REPORT.md](file:///d:/EDquest/REST%20api/REPORT.md).

---
*Developed for EDQUEST Assignment submission by animeshDevarkar.*
