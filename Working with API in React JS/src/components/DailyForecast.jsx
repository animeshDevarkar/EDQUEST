import React from 'react';
import { Calendar, Sun, Cloud, CloudSun, CloudRain, CloudDrizzle, CloudSnow, CloudLightning } from 'lucide-react';
import { getWeatherDetails, formatTemp } from '../services/weatherApi';

export default function DailyForecast({ dailyData, unit }) {
  if (!dailyData || !dailyData.time) return null;

  const days = dailyData.time.map((timeStr, idx) => ({
    date: timeStr,
    weatherCode: dailyData.weather_code[idx],
    maxTemp: dailyData.temperature_2m_max[idx],
    minTemp: dailyData.temperature_2m_min[idx],
    precip: dailyData.precipitation_sum[idx]
  }));

  // Find min and max for range bar
  const globalMin = Math.min(...dailyData.temperature_2m_min);
  const globalMax = Math.max(...dailyData.temperature_2m_max);

  const getDayName = (dateStr, index) => {
    if (index === 0) return 'Today';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
  };

  const renderSmallIcon = (code) => {
    const meta = getWeatherDetails(code);
    switch (meta.icon) {
      case 'sun':
        return <Sun size={22} className="text-sun" />;
      case 'sun-cloud':
      case 'cloud-sun':
        return <CloudSun size={22} className="text-cloud-sun" />;
      case 'cloud':
      case 'fog':
        return <Cloud size={22} className="text-cloud" />;
      case 'drizzle':
        return <CloudDrizzle size={22} className="text-rain" />;
      case 'rain':
      case 'heavy-rain':
        return <CloudRain size={22} className="text-rain" />;
      case 'snow':
        return <CloudSnow size={22} className="text-snow" />;
      case 'thunderstorm':
        return <CloudLightning size={22} className="text-thunder" />;
      default:
        return <Sun size={22} />;
    }
  };

  return (
    <div className="forecast-card">
      <div className="forecast-card-header">
        <Calendar size={18} className="header-icon" />
        <h3>7-Day Weather Forecast</h3>
      </div>
      <div className="daily-list">
        {days.map((day, idx) => {
          const meta = getWeatherDetails(day.weatherCode);
          
          // Calculate bar percentage
          const range = globalMax - globalMin || 1;
          const leftPercent = ((day.minTemp - globalMin) / range) * 100;
          const widthPercent = ((day.maxTemp - day.minTemp) / range) * 100;

          return (
            <div key={day.date} className="daily-row">
              <div className="daily-day-col">
                <span className="day-name">{getDayName(day.date, idx)}</span>
                <span className="day-condition-desc">{meta.label}</span>
              </div>

              <div className="daily-icon-col">
                {renderSmallIcon(day.weatherCode)}
                {day.precip > 0 && (
                  <span className="precip-badge">{day.precip}mm</span>
                )}
              </div>

              <div className="daily-temp-range-col">
                <span className="min-temp">{formatTemp(day.minTemp, unit)}</span>
                <div className="temp-bar-container">
                  <div
                    className="temp-bar-fill"
                    style={{
                      left: `${Math.max(0, leftPercent)}%`,
                      width: `${Math.min(100, Math.max(10, widthPercent))}%`
                    }}
                  ></div>
                </div>
                <span className="max-temp">{formatTemp(day.maxTemp, unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
