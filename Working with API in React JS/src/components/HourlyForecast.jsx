import React from 'react';
import { Sun, Cloud, CloudSun, CloudRain, CloudDrizzle, CloudSnow, CloudLightning, Clock } from 'lucide-react';
import { getWeatherDetails, formatTemp } from '../services/weatherApi';

export default function HourlyForecast({ hourlyData, unit }) {
  if (!hourlyData || !hourlyData.time) return null;

  // Filter next 24 hours starting from current hour
  const now = new Date();
  const currentHourISO = now.toISOString().slice(0, 13); // "YYYY-MM-DDTHH"

  let startIndex = hourlyData.time.findIndex(t => t.startsWith(currentHourISO));
  if (startIndex === -1) startIndex = 0;

  const next24Hours = hourlyData.time.slice(startIndex, startIndex + 24).map((timeStr, idx) => {
    const actualIdx = startIndex + idx;
    return {
      time: timeStr,
      temp: hourlyData.temperature_2m[actualIdx],
      weatherCode: hourlyData.weather_code[actualIdx],
      humidity: hourlyData.relative_humidity_2m[actualIdx]
    };
  });

  const renderSmallIcon = (code) => {
    const meta = getWeatherDetails(code);
    switch (meta.icon) {
      case 'sun':
        return <Sun size={20} className="text-sun" />;
      case 'sun-cloud':
      case 'cloud-sun':
        return <CloudSun size={20} className="text-cloud-sun" />;
      case 'cloud':
      case 'fog':
        return <Cloud size={20} className="text-cloud" />;
      case 'drizzle':
        return <CloudDrizzle size={20} className="text-rain" />;
      case 'rain':
      case 'heavy-rain':
        return <CloudRain size={20} className="text-rain" />;
      case 'snow':
        return <CloudSnow size={20} className="text-snow" />;
      case 'thunderstorm':
        return <CloudLightning size={20} className="text-thunder" />;
      default:
        return <Sun size={20} />;
    }
  };

  const formatHourLabel = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: 'numeric' });
  };

  return (
    <div className="forecast-card">
      <div className="forecast-card-header">
        <Clock size={18} className="header-icon" />
        <h3>Hourly Forecast (Next 24 Hours)</h3>
      </div>
      <div className="hourly-timeline">
        {next24Hours.map((item, i) => (
          <div key={item.time} className={`hourly-item ${i === 0 ? 'is-now' : ''}`}>
            <span className="hourly-time">
              {i === 0 ? 'Now' : formatHourLabel(item.time)}
            </span>
            <div className="hourly-icon-wrapper">
              {renderSmallIcon(item.weatherCode)}
            </div>
            <span className="hourly-temp">{formatTemp(item.temp, unit)}</span>
            <span className="hourly-humidity">{item.humidity}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
