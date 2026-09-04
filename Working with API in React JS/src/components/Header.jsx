import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Sun, CloudRain, Star, Compass } from 'lucide-react';
import { searchCities } from '../services/weatherApi';

export default function Header({
  onSelectCity,
  onUseLocation,
  unit,
  onToggleUnit,
  currentCity,
  isFavorite,
  onToggleFavorite,
  loading
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Debounced live city search API call
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error('Failed to search city API:', err);
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (cityObj) => {
    onSelectCity({
      name: cityObj.name,
      country: cityObj.country,
      admin1: cityObj.admin1,
      latitude: cityObj.latitude,
      longitude: cityObj.longitude
    });
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      handleSelect(suggestions[0]);
    }
  };

  return (
    <header className="header-container">
      <div className="brand-section">
        <div className="brand-icon">
          <Sun className="animated-sun" size={28} />
          <CloudRain className="animated-rain" size={24} />
        </div>
        <div className="brand-text">
          <h1 className="brand-title">SkyPulse Weather</h1>
          <span className="brand-tag">React API Integration App</span>
        </div>
      </div>

      <div className="search-and-actions" ref={dropdownRef}>
        <form onSubmit={handleFormSubmit} className="search-form">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search any city worldwide..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.length >= 2 && setShowDropdown(true)}
              className="search-input"
            />
            {searching && <span className="spinner-sm"></span>}
          </div>

          {showDropdown && suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((city) => (
                <li
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  onClick={() => handleSelect(city)}
                  className="suggestion-item"
                >
                  <MapPin size={14} className="pin-icon" />
                  <span className="city-name">{city.name}</span>
                  <span className="city-region">
                    {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </form>

        <div className="action-buttons">
          <button
            onClick={onUseLocation}
            className="action-btn loc-btn"
            title="Use current GPS location"
            disabled={loading}
          >
            <Compass size={18} />
            <span className="btn-label">My Location</span>
          </button>

          {currentCity && (
            <button
              onClick={onToggleFavorite}
              className={`action-btn fav-btn ${isFavorite ? 'is-fav' : ''}`}
              title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Star size={18} fill={isFavorite ? '#fbbf24' : 'none'} color={isFavorite ? '#fbbf24' : 'currentColor'} />
            </button>
          )}

          <div className="unit-toggle-group">
            <button
              className={`unit-btn ${unit === 'C' ? 'active' : ''}`}
              onClick={() => onToggleUnit('C')}
            >
              °C
            </button>
            <button
              className={`unit-btn ${unit === 'F' ? 'active' : ''}`}
              onClick={() => onToggleUnit('F')}
            >
              °F
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
