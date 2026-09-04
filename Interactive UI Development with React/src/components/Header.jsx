import React from 'react';
import { CheckSquare, Moon, Sun, Sparkles } from 'lucide-react';

/**
 * Header Component
 * Props:
 *  - darkMode (boolean): Current theme state
 *  - toggleDarkMode (function): Callback handler to toggle theme
 *  - activeCount (number): Count of pending tasks
 */
export default function Header({ darkMode, toggleDarkMode, activeCount }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-icon">
          <CheckSquare size={28} />
        </div>
        <div>
          <h1>React TaskFlow</h1>
          <p className="subtitle">Interactive UI & State Management Demo</p>
        </div>
      </div>

      <div className="header-actions">
        <div className="pending-badge">
          <Sparkles size={16} />
          <span>{activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining</span>
        </div>

        <button 
          onClick={toggleDarkMode} 
          className="theme-toggle-btn"
          aria-label="Toggle Theme"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
