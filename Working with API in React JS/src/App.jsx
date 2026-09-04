import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import FavoriteCities from './components/FavoriteCities';
import ApiConceptsExplanation from './components/ApiConceptsExplanation';
import { fetchWeatherData } from './services/weatherApi';
import { CloudOff, RefreshCw, Sparkles, MapPin } from 'lucide-react';

const DEFAULT_CITY = {
  name: 'London',
  country: 'United Kingdom',
  admin1: 'England',
  latitude: 51.5074,
  longitude: -0.1278
};

const FAVORITES_STORAGE_KEY = 'skypulse_favorite_cities_v1';

export default function App() {
  const [selectedCity, setSelectedCity] = useState(() => {
    const saved = localStorage.getItem('skypulse_last_city');
    return saved ? JSON.parse(saved) : DEFAULT_CITY;
  });

  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('C');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [
      DEFAULT_CITY,
      { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
      { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.0060 },
      { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777 }
    ];
  });

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Fetch weather data when selectedCity changes
  const loadWeather = useCallback(async (cityObj) => {
    if (!cityObj || cityObj.latitude === undefined || cityObj.longitude === undefined) return;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(cityObj.latitude, cityObj.longitude);
      setWeatherData(data);
      localStorage.setItem('skypulse_last_city', JSON.stringify(cityObj));
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError(err.message || 'Unable to fetch weather data. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(selectedCity);
  }, [selectedCity, loadWeather]);

  // Handle Geolocation API
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locCity = {
          name: 'Current Location',
          country: 'GPS Location',
          admin1: '',
          latitude,
          longitude
        };
        setSelectedCity(locCity);
      },
      (geoErr) => {
        console.error('Geolocation error:', geoErr);
        setLoading(false);
        setError('Location permission denied or unavailable. Please search for a city manually.');
      },
      { timeout: 10000 }
    );
  };

  const isFavorite = favorites.some(
    (fav) => fav.name.toLowerCase() === selectedCity.name.toLowerCase() &&
             Math.abs(fav.latitude - selectedCity.latitude) < 0.1
  );

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter(
        (fav) => !(fav.name.toLowerCase() === selectedCity.name.toLowerCase() &&
                   Math.abs(fav.latitude - selectedCity.latitude) < 0.1)
      ));
    } else {
      setFavorites([...favorites, selectedCity]);
    }
  };

  const removeFavorite = (cityToRemove) => {
    setFavorites(favorites.filter(
      (fav) => !(fav.name.toLowerCase() === cityToRemove.name.toLowerCase() &&
                 Math.abs(fav.latitude - cityToRemove.latitude) < 0.1)
    ));
  };

  return (
    <div className="app-layout">
      <div className="app-container">
        <Header
          onSelectCity={setSelectedCity}
          onUseLocation={handleUseLocation}
          unit={unit}
          onToggleUnit={setUnit}
          currentCity={selectedCity}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          loading={loading}
        />

        <FavoriteCities
          favorites={favorites}
          onSelectCity={setSelectedCity}
          onRemoveFavorite={removeFavorite}
        />

        <main className="main-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-large"></div>
              <p className="loading-text">Fetching weather data from Open-Meteo API...</p>
              <div className="skeleton-grid">
                <div className="skeleton-card skeleton-hero"></div>
                <div className="skeleton-card skeleton-forecast"></div>
              </div>
            </div>
          ) : error ? (
            <div className="error-card">
              <CloudOff size={48} className="error-icon" />
              <h3>Weather Data Unavailable</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={() => loadWeather(selectedCity)}>
                <RefreshCw size={16} /> Try Again
              </button>
            </div>
          ) : (
            <>
              <CurrentWeather
                weatherData={weatherData}
                city={selectedCity}
                unit={unit}
              />

              <div className="forecast-grid">
                <HourlyForecast
                  hourlyData={weatherData?.hourly}
                  unit={unit}
                />
                <DailyForecast
                  dailyData={weatherData?.daily}
                  unit={unit}
                />
              </div>

              <ApiConceptsExplanation />
            </>
          )}
        </main>

        <footer className="app-footer">
          <p>
            Built with React JS & Open-Meteo Public API • <Sparkles size={14} className="inline-icon" /> Assignment Submission
          </p>
        </footer>
      </div>
    </div>
  );
}
