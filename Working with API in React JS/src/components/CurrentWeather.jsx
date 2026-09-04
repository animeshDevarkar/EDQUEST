import React from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Gauge,
  SunMedium,
  Sunrise,
  Sunset,
  Thermometer
} from 'lucide-react';
import { getWeatherDetails, formatTemp } from '../services/weatherApi';

export default function CurrentWeather({ weatherData, city, unit }) {
  if (!weatherData || !weatherData.current) return null;

  const { current, daily } = weatherData;
  const weatherMeta = getWeatherDetails(current.weather_code);

  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  };

  const renderWeatherIcon = (iconCode, size = 64) => {
    switch (iconCode) {
      case 'sun':
        return <Sun size={size} className="weather-icon text-sun" />;
      case 'sun-cloud':
      case 'cloud-sun':
        return <CloudSun size={size} className="weather-icon text-cloud-sun" />;
      case 'cloud':
      case 'fog':
        return <Cloud size={size} className="weather-icon text-cloud" />;
      case 'drizzle':
        return <CloudDrizzle size={size} className="weather-icon text-rain" />;
      case 'rain':
      case 'heavy-rain':
        return <CloudRain size={size} className="weather-icon text-rain" />;
      case 'snow':
        return <CloudSnow size={size} className="weather-icon text-snow" />;
      case 'thunderstorm':
        return <CloudLightning size={size} className="weather-icon text-thunder" />;
      default:
        return <Sun size={size} className="weather-icon" />;
    }
  };

  const todaySunrise = daily?.sunrise?.[0] ? formatTime(daily.sunrise[0]) : '--:--';
  const todaySunset = daily?.sunset?.[0] ? formatTime(daily.sunset[0]) : '--:--';
  const maxUv = daily?.uv_index_max?.[0] !== undefined ? daily.uv_index_max[0].toFixed(1) : '--';
  const highTemp = daily?.temperature_2m_max?.[0];
  const lowTemp = daily?.temperature_2m_min?.[0];

  return (
    <div className={`current-weather-card weather-bg-${weatherMeta.bg}`}>
      <div className="card-top">
        <div className="location-info">
          <h2 className="location-title">
            {city.name}
            {city.country && <span className="country-badge">{city.country}</span>}
          </h2>
          {city.admin1 && <p className="location-region">{city.admin1}</p>}
          <p className="current-date">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="weather-badge">
          {renderWeatherIcon(weatherMeta.icon, 52)}
          <span className="weather-condition-label">{weatherMeta.label}</span>
        </div>
      </div>

      <div className="temp-hero-section">
        <div className="temp-display">
          <span className="main-temp-val">{formatTemp(current.temperature_2m, unit)}</span>
          <div className="sub-temp-info">
            <span className="feels-like">
              Feels like {formatTemp(current.apparent_temperature, unit)}
            </span>
            {highTemp !== undefined && lowTemp !== undefined && (
              <span className="high-low">
                H: {formatTemp(highTemp, unit)} • L: {formatTemp(lowTemp, unit)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid of Weather Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <Droplets size={18} className="metric-icon text-blue" />
            <span>Humidity</span>
          </div>
          <p className="metric-value">{current.relative_humidity_2m}%</p>
          <p className="metric-subtext">
            {current.relative_humidity_2m > 70 ? 'High Humidity' : current.relative_humidity_2m < 30 ? 'Low Humidity' : 'Comfortable'}
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Wind size={18} className="metric-icon text-teal" />
            <span>Wind</span>
          </div>
          <p className="metric-value">{Math.round(current.wind_speed_10m)} km/h</p>
          <p className="metric-subtext">Direction: {getWindDirection(current.wind_direction_10m)} ({current.wind_direction_10m}°)</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <SunMedium size={18} className="metric-icon text-yellow" />
            <span>UV Index</span>
          </div>
          <p className="metric-value">{maxUv}</p>
          <p className="metric-subtext">
            {maxUv > 6 ? 'High (Wear Sunscreen)' : maxUv > 3 ? 'Moderate' : 'Low Hazard'}
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Gauge size={18} className="metric-icon text-purple" />
            <span>Pressure</span>
          </div>
          <p className="metric-value">{Math.round(current.surface_pressure)} hPa</p>
          <p className="metric-subtext">Atmospheric Pressure</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Sunrise size={18} className="metric-icon text-orange" />
            <span>Sunrise</span>
          </div>
          <p className="metric-value">{todaySunrise}</p>
          <p className="metric-subtext">Morning dawn</p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <Sunset size={18} className="metric-icon text-amber" />
            <span>Sunset</span>
          </div>
          <p className="metric-value">{todaySunset}</p>
          <p className="metric-subtext">Evening twilight</p>
        </div>
      </div>
    </div>
  );
}
