import React from 'react';
import { Star, MapPin, X } from 'lucide-react';

export default function FavoriteCities({ favorites, onSelectCity, onRemoveFavorite }) {
  if (!favorites || favorites.length === 0) return null;

  return (
    <div className="favorites-container">
      <div className="favorites-label">
        <Star size={16} fill="#fbbf24" color="#fbbf24" />
        <span>Saved Locations:</span>
      </div>
      <div className="favorites-chips">
        {favorites.map((fav) => (
          <div key={`${fav.name}-${fav.latitude}`} className="fav-chip">
            <button
              onClick={() => onSelectCity(fav)}
              className="fav-chip-btn"
              title={`Switch to ${fav.name}`}
            >
              <MapPin size={12} />
              <span>{fav.name}</span>
              {fav.country && <span className="fav-country">({fav.country})</span>}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFavorite(fav);
              }}
              className="fav-remove-btn"
              title="Remove location"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
