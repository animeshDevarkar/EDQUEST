/**
 * Weather API Service using Open-Meteo (Free public API, no API key required)
 */

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Maps WMO Weather Interpretation Codes to human-readable text and icon categories
 */
export const WMO_WEATHER_CODES = {
  0: { label: 'Clear Sky', icon: 'sun', bg: 'sunny' },
  1: { label: 'Mainly Clear', icon: 'sun-cloud', bg: 'sunny' },
  2: { label: 'Partly Cloudy', icon: 'cloud-sun', bg: 'cloudy' },
  3: { label: 'Overcast', icon: 'cloud', bg: 'cloudy' },
  45: { label: 'Foggy', icon: 'fog', bg: 'foggy' },
  48: { label: 'Depositing Rime Fog', icon: 'fog', bg: 'foggy' },
  51: { label: 'Light Drizzle', icon: 'drizzle', bg: 'rainy' },
  53: { label: 'Moderate Drizzle', icon: 'drizzle', bg: 'rainy' },
  55: { label: 'Dense Drizzle', icon: 'drizzle', bg: 'rainy' },
  61: { label: 'Slight Rain', icon: 'rain', bg: 'rainy' },
  63: { label: 'Moderate Rain', icon: 'rain', bg: 'rainy' },
  65: { label: 'Heavy Rain', icon: 'heavy-rain', bg: 'rainy' },
  71: { label: 'Slight Snow', icon: 'snow', bg: 'snowy' },
  73: { label: 'Moderate Snow', icon: 'snow', bg: 'snowy' },
  75: { label: 'Heavy Snow', icon: 'snow', bg: 'snowy' },
  77: { label: 'Snow Grains', icon: 'snow', bg: 'snowy' },
  80: { label: 'Slight Rain Showers', icon: 'rain', bg: 'rainy' },
  81: { label: 'Moderate Rain Showers', icon: 'rain', bg: 'rainy' },
  82: { label: 'Violent Rain Showers', icon: 'heavy-rain', bg: 'rainy' },
  85: { label: 'Slight Snow Showers', icon: 'snow', bg: 'snowy' },
  86: { label: 'Heavy Snow Showers', icon: 'snow', bg: 'snowy' },
  95: { label: 'Thunderstorm', icon: 'thunderstorm', bg: 'stormy' },
  96: { label: 'Thunderstorm with Hail', icon: 'thunderstorm', bg: 'stormy' },
  99: { label: 'Heavy Thunderstorm with Hail', icon: 'thunderstorm', bg: 'stormy' },
};

export const getWeatherDetails = (code) => {
  return WMO_WEATHER_CODES[code] || { label: 'Unknown Weather', icon: 'cloud', bg: 'cloudy' };
};

/**
 * Searches for cities matching the search query
 * @param {string} query 
 * @returns {Promise<Array>} List of city matches
 */
export async function searchCities(query) {
  if (!query || query.trim().length < 2) return [];

  const response = await fetch(`${GEOCODING_API_URL}?name=${encodeURIComponent(query.trim())}&count=5&language=en&format=json`);
  
  if (!response.ok) {
    throw new Error(`Geocoding API HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data.results || [];
}

/**
 * Fetches comprehensive weather data for given coordinates
 * @param {number} latitude 
 * @param {number} longitude 
 * @returns {Promise<Object>} Weather payload
 */
export async function fetchWeatherData(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'relative_humidity_2m'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum'
    ].join(','),
    timezone: 'auto'
  });

  const url = `${WEATHER_API_URL}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather API HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Converts Celsius to Fahrenheit
 */
export function celsiusToFahrenheit(celsius) {
  return Math.round((celsius * 9) / 5 + 32);
}

/**
 * Formats temperature based on unit ('C' or 'F')
 */
export function formatTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined) return '--';
  const val = unit === 'F' ? celsiusToFahrenheit(celsius) : Math.round(celsius);
  return `${val}°${unit}`;
}
