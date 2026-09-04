/**
 * REST Weather API Explorer - Client Application
 * Integrates with Open-Meteo REST APIs for geocoding and weather data.
 */

class WeatherAPI {
  constructor() {
    this.geoBaseUrl = 'https://geocoding-api.open-meteo.com/v1/search';
    this.weatherBaseUrl = 'https://api.open-meteo.com/v1/forecast';
  }

  /**
   * Search location coordinates using Geocoding REST API (GET)
   * @param {string} query City name
   */
  async searchLocation(query) {
    const url = `${this.geoBaseUrl}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    const startTime = performance.now();
    const response = await fetch(url);
    const endTime = performance.now();

    if (!response.ok) {
      throw new Error(`Geocoding REST API Failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      data,
      url,
      status: response.status,
      latency: Math.round(endTime - startTime)
    };
  }

  /**
   * Fetch full forecast data using Weather Forecast REST API (GET)
   * @param {number} lat Latitude
   * @param {number} lon Longitude
   */
  async getForecast(lat, lon) {
    const url = `${this.weatherBaseUrl}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,surface_pressure,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const startTime = performance.now();
    const response = await fetch(url);
    const endTime = performance.now();

    if (!response.ok) {
      throw new Error(`Weather REST API Request Failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      data,
      url,
      status: response.status,
      latency: Math.round(endTime - startTime)
    };
  }
}

// Weather Code Translator (WMO Standard)
const weatherCodeMap = {
  0: { desc: 'Clear Sky', icon: 'fa-sun', color: '#f59e0b' },
  1: { desc: 'Mainly Clear', icon: 'fa-cloud-sun', color: '#f59e0b' },
  2: { desc: 'Partly Cloudy', icon: 'fa-cloud-sun', color: '#38bdf8' },
  3: { desc: 'Overcast', icon: 'fa-cloud', color: '#94a3b8' },
  45: { desc: 'Foggy', icon: 'fa-smog', color: '#94a3b8' },
  48: { desc: 'Depositing Rime Fog', icon: 'fa-smog', color: '#94a3b8' },
  51: { desc: 'Light Drizzle', icon: 'fa-cloud-rain', color: '#38bdf8' },
  53: { desc: 'Moderate Drizzle', icon: 'fa-cloud-rain', color: '#38bdf8' },
  55: { desc: 'Dense Drizzle', icon: 'fa-cloud-showers-heavy', color: '#38bdf8' },
  61: { desc: 'Slight Rain', icon: 'fa-cloud-rain', color: '#38bdf8' },
  63: { desc: 'Moderate Rain', icon: 'fa-cloud-showers-heavy', color: '#38bdf8' },
  65: { desc: 'Heavy Rain', icon: 'fa-cloud-showers-heavy', color: '#38bdf8' },
  71: { desc: 'Slight Snow Fall', icon: 'fa-snowflake', color: '#e2e8f0' },
  73: { desc: 'Moderate Snow Fall', icon: 'fa-snowflake', color: '#e2e8f0' },
  75: { desc: 'Heavy Snow Fall', icon: 'fa-snowflake', color: '#e2e8f0' },
  80: { desc: 'Slight Rain Showers', icon: 'fa-cloud-showers-water', color: '#38bdf8' },
  81: { desc: 'Moderate Rain Showers', icon: 'fa-cloud-showers-water', color: '#38bdf8' },
  82: { desc: 'Violent Rain Showers', icon: 'fa-cloud-showers-water', color: '#38bdf8' },
  95: { desc: 'Thunderstorm', icon: 'fa-cloud-bolt', color: '#a855f7' },
  96: { desc: 'Thunderstorm with Hail', icon: 'fa-cloud-bolt', color: '#a855f7' }
};

function getWeatherMeta(code) {
  return weatherCodeMap[code] || { desc: 'Unknown Weather Condition', icon: 'fa-cloud', color: '#94a3b8' };
}

// App Controller State
const api = new WeatherAPI();
let currentLocation = { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 };
let lastApiResponse = null;
let currentLanguageSnippet = 'js';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const geoBtn = document.getElementById('geo-btn');
const autocompleteBox = document.getElementById('autocomplete-results');
const loader = document.getElementById('loader');
const errorBanner = document.getElementById('error-banner');
const errorMessage = document.getElementById('error-message');

// Navigation Tabs
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    
    btn.classList.add('active');
    const targetTab = btn.getAttribute('data-tab');
    document.getElementById(targetTab).classList.add('active');
  });
});

// Preset Buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const city = btn.getAttribute('data-city');
    cityInput.value = city;
    handleCitySearch(city);
  });
});

// Search Handlers
searchBtn.addEventListener('click', () => {
  const query = cityInput.value.trim();
  if (query) handleCitySearch(query);
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const query = cityInput.value.trim();
    if (query) {
      autocompleteBox.classList.add('hidden');
      handleCitySearch(query);
    }
  }
});

// Autocomplete Input Handler
let debounceTimer = null;
cityInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const query = cityInput.value.trim();
  if (query.length < 2) {
    autocompleteBox.classList.add('hidden');
    return;
  }

  debounceTimer = setTimeout(async () => {
    try {
      const res = await api.searchLocation(query);
      if (res.data && res.data.results && res.data.results.length > 0) {
        renderAutocomplete(res.data.results);
      } else {
        autocompleteBox.classList.add('hidden');
      }
    } catch (e) {
      console.warn('Autocomplete fetch failed:', e.message);
    }
  }, 300);
});

function renderAutocomplete(results) {
  autocompleteBox.innerHTML = '';
  results.forEach(loc => {
    const div = document.createElement('div');
    div.className = 'autocomplete-item';
    div.innerHTML = `<span><strong>${loc.name}</strong>, ${loc.country || ''}</span> <small style="color:#94a3b8">Lat: ${loc.latitude.toFixed(2)}, Lon: ${loc.longitude.toFixed(2)}</small>`;
    div.addEventListener('click', () => {
      currentLocation = { name: loc.name, country: loc.country || '', lat: loc.latitude, lon: loc.longitude };
      cityInput.value = `${loc.name}, ${loc.country || ''}`;
      autocompleteBox.classList.add('hidden');
      fetchAndRenderWeather();
    });
    autocompleteBox.appendChild(div);
  });
  autocompleteBox.classList.remove('hidden');
}

// Close Autocomplete when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-container')) {
    autocompleteBox.classList.add('hidden');
  }
});

// Geolocation Button Handler
geoBtn.addEventListener('click', () => {
  if ('geolocation' in navigator) {
    showLoader(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        currentLocation = {
          name: 'Current Location',
          country: 'Local',
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        cityInput.value = `My Location (${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)})`;
        fetchAndRenderWeather();
      },
      (err) => {
        showError(`Geolocation error: ${err.message}`);
        showLoader(false);
      }
    );
  } else {
    showError('Geolocation is not supported by your browser.');
  }
});

// Handle City Search Execution
async function handleCitySearch(query) {
  try {
    showLoader(true);
    hideError();
    const res = await api.searchLocation(query);

    if (!res.data.results || res.data.results.length === 0) {
      throw new Error(`Location "${query}" not found in Geocoding REST API.`);
    }

    const loc = res.data.results[0];
    currentLocation = { name: loc.name, country: loc.country || '', lat: loc.latitude, lon: loc.longitude };
    await fetchAndRenderWeather();
  } catch (err) {
    showError(err.message);
    showLoader(false);
  }
}

// Core Weather Fetch & UI Update Routine
async function fetchAndRenderWeather() {
  try {
    showLoader(true);
    hideError();

    const res = await api.getForecast(currentLocation.lat, currentLocation.lon);
    lastApiResponse = res;

    renderDashboard(res.data);
    renderInspector(res);

    showLoader(false);
  } catch (err) {
    showError(err.message);
    showLoader(false);
  }
}

// Render Dashboard Data
function renderDashboard(data) {
  const current = data.current_weather;
  const daily = data.daily;
  const hourly = data.hourly;

  // Header Coords & Location
  document.getElementById('city-name').textContent = `${currentLocation.name}${currentLocation.country ? ', ' + currentLocation.country : ''}`;
  document.getElementById('location-coords').textContent = `Lat: ${currentLocation.lat.toFixed(4)} | Lon: ${currentLocation.lon.toFixed(4)}`;
  
  const now = new Date();
  document.getElementById('weather-date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

  // Current Weather Info
  const weatherMeta = getWeatherMeta(current.weathercode);
  document.getElementById('weather-description').textContent = weatherMeta.desc;
  document.getElementById('current-temp').textContent = Math.round(current.temperature);
  
  const iconElem = document.getElementById('weather-icon');
  iconElem.innerHTML = `<i class="fa-solid ${weatherMeta.icon}"></i>`;
  iconElem.style.color = weatherMeta.color;

  // High & Low
  document.getElementById('high-temp').textContent = `${Math.round(daily.temperature_2m_max[0])}°C`;
  document.getElementById('low-temp').textContent = `${Math.round(daily.temperature_2m_min[0])}°C`;
  document.getElementById('wind-speed').textContent = `${current.windspeed} km/h`;

  // Secondary Metrics
  if (hourly && hourly.relative_humidity_2m) {
    document.getElementById('humidity-val').textContent = `${hourly.relative_humidity_2m[0]}%`;
  }
  if (hourly && hourly.surface_pressure) {
    document.getElementById('pressure-val').textContent = `${Math.round(hourly.surface_pressure[0])} hPa`;
  }
  document.getElementById('wind-dir-val').textContent = `${current.winddirection}°`;
  document.getElementById('wind-dir-text').textContent = getCompassDirection(current.winddirection);
  
  if (daily && daily.precipitation_sum) {
    document.getElementById('precip-val').textContent = `${daily.precipitation_sum[0]} mm`;
  }

  // Hourly Forecast
  renderHourlyForecast(hourly);

  // Daily Forecast
  renderDailyForecast(daily);
}

function getCompassDirection(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
}

// Render Hourly Forecast Items
function renderHourlyForecast(hourly) {
  const container = document.getElementById('hourly-forecast-container');
  container.innerHTML = '';

  if (!hourly || !hourly.time) return;

  // Show first 24 hours
  for (let i = 0; i < 24; i++) {
    const timeStr = hourly.time[i];
    const timeObj = new Date(timeStr);
    const hourFormatted = timeObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    const temp = Math.round(hourly.temperature_2m[i]);

    const item = document.createElement('div');
    item.className = 'hourly-item';
    item.innerHTML = `
      <span class="hourly-time">${hourFormatted}</span>
      <div class="hourly-icon"><i class="fa-solid fa-cloud-sun"></i></div>
      <span class="hourly-temp">${temp}°C</span>
    `;
    container.appendChild(item);
  }
}

// Render Daily 7-Day Forecast
function renderDailyForecast(daily) {
  const container = document.getElementById('daily-forecast-container');
  container.innerHTML = '';

  if (!daily || !daily.time) return;

  for (let i = 0; i < daily.time.length; i++) {
    const dateObj = new Date(daily.time[i]);
    const dayName = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const maxT = Math.round(daily.temperature_2m_max[i]);
    const minT = Math.round(daily.temperature_2m_min[i]);
    const code = daily.weather_code[i];
    const meta = getWeatherMeta(code);

    const item = document.createElement('div');
    item.className = 'daily-item';
    item.innerHTML = `
      <span class="daily-day">${dayName}</span>
      <span class="daily-date">${dateFormatted}</span>
      <div class="daily-icon" style="color: ${meta.color}"><i class="fa-solid ${meta.icon}"></i></div>
      <div class="daily-range">
        <span class="max-t">${maxT}°</span>
        <span class="min-t">${minT}°</span>
      </div>
    `;
    container.appendChild(item);
  }
}

// REST API Inspector Renderer
function renderInspector(res) {
  document.getElementById('inspector-url').textContent = res.url;
  document.getElementById('inspector-status').textContent = `${res.status} OK`;
  document.getElementById('inspector-latency').textContent = `${res.latency} ms`;

  // Syntax highlight JSON
  const jsonViewer = document.getElementById('json-viewer');
  jsonViewer.innerHTML = highlightJson(res.data);

  // Update Code Snippets
  updateCodeSnippets(res.url);
}

// JSON Syntax Highlighting Helper
function highlightJson(jsonObj) {
  const jsonString = JSON.stringify(jsonObj, null, 2);
  return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'json-number';
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'json-key';
      } else {
        cls = 'json-string';
      }
    } else if (/true|false/.test(match)) {
      cls = 'json-boolean';
    } else if (/null/.test(match)) {
      cls = 'json-null';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

// Snippet Generator
function updateCodeSnippets(url) {
  const snippetBox = document.getElementById('code-snippet-box');
  
  if (currentLanguageSnippet === 'js') {
    snippetBox.textContent = `// JavaScript (Fetch API async/await)
async function fetchWeather() {
  const response = await fetch("${url}");
  if (!response.ok) {
    throw new Error("REST API HTTP Error " + response.status);
  }
  const data = await response.json();
  console.log("Current Temperature:", data.current_weather.temperature);
  return data;
}

fetchWeather();`;
  } else if (currentLanguageSnippet === 'python') {
    snippetBox.textContent = `# Python (requests library)
import requests

url = "${url}"
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    print(f"Current Temperature: {data['current_weather']['temperature']}°C")
else:
    print(f"HTTP GET Error: {response.status_code}")`;
  } else if (currentLanguageSnippet === 'curl') {
    snippetBox.textContent = `# cURL (Command Line REST API Request)
curl -X GET "${url}" \\
     -H "Accept: application/json"`;
  }
}

// Snippet Language Tab Switcher
document.querySelectorAll('.snippet-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.snippet-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentLanguageSnippet = tab.getAttribute('data-lang');
    if (lastApiResponse) updateCodeSnippets(lastApiResponse.url);
  });
});

// Copy Buttons
document.getElementById('copy-url-btn').addEventListener('click', () => {
  const url = document.getElementById('inspector-url').textContent;
  navigator.clipboard.writeText(url);
  alert('Endpoint URL copied to clipboard!');
});

document.getElementById('copy-json-btn').addEventListener('click', () => {
  if (lastApiResponse) {
    navigator.clipboard.writeText(JSON.stringify(lastApiResponse.data, null, 2));
    alert('JSON response copied to clipboard!');
  }
});

// Loader & Error Helpers
function showLoader(show) {
  if (show) {
    loader.classList.remove('hidden');
    document.getElementById('weather-content').style.opacity = '0.4';
  } else {
    loader.classList.add('hidden');
    document.getElementById('weather-content').style.opacity = '1';
  }
}

function showError(msg) {
  errorMessage.textContent = msg;
  errorBanner.classList.remove('hidden');
}

function hideError() {
  errorBanner.classList.add('hidden');
}

// Initial App Launch
document.addEventListener('DOMContentLoaded', () => {
  fetchAndRenderWeather();
});
