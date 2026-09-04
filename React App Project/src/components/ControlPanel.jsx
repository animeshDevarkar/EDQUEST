import React from 'react';
import { Search, Filter, ArrowUpDown, XCircle } from 'lucide-react';

export const ControlPanel = ({
  searchQuery = '',
  onSearchChange,
  selectedCategory = 'All',
  onCategoryChange,
  selectedStatus = 'All',
  onStatusChange,
  selectedDifficulty = 'All',
  onDifficultyChange,
  sortBy = 'title',
  onSortChange,
  categories = [],
  statuses = [],
  difficulties = [],
  onClearFilters
}) => {
  const isFiltered = searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All' || selectedDifficulty !== 'All';

  return (
    <div className="control-panel">
      <div className="control-row main-row">
        {/* Search Bar */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search courses by title, instructor, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search text"
            >
              <XCircle size={16} />
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div className="control-group sort-group">
          <label htmlFor="sort-select" className="control-label">
            <ArrowUpDown size={14} /> Sort By:
          </label>
          <select
            id="sort-select"
            className="select-input"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="title">Title (A-Z)</option>
            <option value="rating">Rating (High to Low)</option>
            <option value="progress">Progress (%)</option>
            <option value="duration">Duration (Hours)</option>
          </select>
        </div>
      </div>

      {/* Category Pills & Dropdown Filters */}
      <div className="control-row filter-row">
        <div className="category-pills" role="tablist" aria-label="Filter by Category">
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="dropdown-filters">
          <div className="filter-item">
            <label htmlFor="status-filter">Status:</label>
            <select
              id="status-filter"
              className="select-input compact"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
            >
              {statuses.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="difficulty-filter">Difficulty:</label>
            <select
              id="difficulty-filter"
              className="select-input compact"
              value={selectedDifficulty}
              onChange={(e) => onDifficultyChange(e.target.value)}
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          {isFiltered && (
            <button 
              className="clear-all-filters-btn"
              onClick={onClearFilters}
              title="Reset all search and filter conditions"
            >
              <XCircle size={14} /> Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
