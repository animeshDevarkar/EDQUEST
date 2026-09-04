import React from 'react';
import { Search, Trash2, CheckCheck } from 'lucide-react';

/**
 * TodoFilter Component
 * Props:
 *  - filter: 'all' | 'active' | 'completed'
 *  - priorityFilter: 'all' | 'Low' | 'Medium' | 'High'
 *  - searchQuery: string
 *  - onFilterChange: function(filter)
 *  - onPriorityFilterChange: function(priority)
 *  - onSearchChange: function(query)
 *  - onClearCompleted: function()
 *  - onMarkAllComplete: function()
 *  - completedCount: number
 *  - activeCount: number
 */
export default function TodoFilter({
  filter,
  priorityFilter,
  searchQuery,
  onFilterChange,
  onPriorityFilterChange,
  onSearchChange,
  onClearCompleted,
  onMarkAllComplete,
  completedCount,
  activeCount
}) {
  return (
    <div className="todo-filter-bar">
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
          aria-label="Search tasks"
        />
      </div>

      <div className="filter-controls">
        <div className="status-filters">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => onFilterChange('active')}
          >
            Active
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => onFilterChange('completed')}
          >
            Completed
          </button>
        </div>

        <div className="priority-filter">
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>

        <div className="bulk-actions">
          {activeCount > 0 && (
            <button
              onClick={onMarkAllComplete}
              className="action-btn mark-all-btn"
              title="Mark all active tasks as complete"
            >
              <CheckCheck size={16} />
              <span>Mark All Done</span>
            </button>
          )}

          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="action-btn clear-completed-btn"
              title="Clear all completed tasks"
            >
              <Trash2 size={16} />
              <span>Clear Done ({completedCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
