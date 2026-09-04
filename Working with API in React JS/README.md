# 🌤️ Working with APIs in React JS - SkyPulse Weather Application

An interactive, responsive React application built to explore and demonstrate techniques for integrating REST APIs in React JS applications. This application fetches real-time weather and forecast data from the public **Open-Meteo REST API** and **Geocoding API**.

![SkyPulse Weather App](https://img.shields.io/badge/React-19.0-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite) ![License](https://img.shields.io/badge/License-MIT-green)

---

## 📌 Assignment Objectives Addressed
- **API Fetching & Asynchronous Data Handling**: Demonstrating `async/await` and Native Browser `fetch()` API calls to retrieve real-time weather metrics.
- **State & Lifecycle Management**: Using React `useState` and `useEffect` hooks for dynamic data updates, debounced search inputs, unit conversion, and favorites persistence.
- **Loading & Error Boundaries**: Providing real-time loading spinners, skeleton UI placeholders, and user-friendly error recovery UI.
- **Advanced Features**: Live city autocompletion, browser Geolocation API auto-detection, hourly timeline, 7-day daily forecast breakdown, unit toggles (°C / °F), and localStorage caching.

---

## 🛠️ Key Features
- **🌐 Global City Search**: Instant debounced search with live suggestions powered by Open-Meteo Geocoding API.
- **📍 GPS Geolocation Support**: Fetch local weather automatically using the browser's `navigator.geolocation` API.
- **🌡️ Comprehensive Weather Metrics**: Displays temperature, feels-like, humidity, wind speed & direction, atmospheric pressure, UV index, sunrise/sunset.
- **⏱️ 24-Hour Hourly Timeline**: Interactive hourly forecast scrollable timeline.
- **📅 7-Day Forecast Breakdown**: Weekly forecast with temperature range bars and precipitation indicators.
- **⭐ Favorite Cities**: Save and manage favorite locations stored in browser `localStorage`.
- **🔄 Unit Switching**: One-click toggle between Celsius (°C) and Fahrenheit (°F).
- **💡 Educational Code Breakdown**: Built-in developer notes panel explaining the React API integration code step-by-step.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## 📂 Project Structure
```
Working with API in React JS/
├── public/
├── src/
│   ├── components/
│   │   ├── ApiConceptsExplanation.jsx  # Educational React API concept breakdown
│   │   ├── CurrentWeather.jsx          # Main weather hero display & metric grid
│   │   ├── DailyForecast.jsx           # 7-day forecast list with range bars
│   │   ├── FavoriteCities.jsx          # Saved location chips
│   │   ├── Header.jsx                  # Brand header, live city search & location
│   │   └── HourlyForecast.jsx          # 24-hour timeline carousel
│   ├── services/
│   │   └── weatherApi.js               # Open-Meteo REST & Geocoding API calls
│   ├── App.jsx                         # Main app component & state management
│   ├── index.css                       # Modern glassmorphism & responsive CSS
│   └── main.jsx                        # Entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 📡 APIs Used
- **Open-Meteo Weather Forecast API**: `https://api.open-meteo.com/v1/forecast`
- **Open-Meteo Geocoding API**: `https://geocoding-api.open-meteo.com/v1/search`

*(No API Key required - free public open-source API)*
