import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, Bookmark, PlusCircle, Sun, Moon, RefreshCw } from 'lucide-react';

export const Header = ({
  title = 'EDquest EduFlow',
  subtitle = 'React Component Architecture & Unidirectional Data Flow Workspace',
  bookmarkedCount = 0,
  onOpenBookmarks,
  onOpenAddModal,
  onResetAll
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-section">
          <div className="brand-icon">
            <BookOpen size={28} />
          </div>
          <div>
            <h1 className="brand-title">{title}</h1>
            <p className="brand-subtitle">{subtitle}</p>
          </div>
        </div>

        <div className="header-actions">
          <button 
            className="action-btn secondary-btn"
            onClick={onOpenBookmarks}
            aria-label="View Saved Bookmarks"
            title="View Saved Bookmarks"
          >
            <Bookmark size={18} />
            <span>Saved</span>
            {bookmarkedCount > 0 && (
              <span className="badge-pill">{bookmarkedCount}</span>
            )}
          </button>

          <button 
            className="action-btn primary-btn"
            onClick={onOpenAddModal}
            aria-label="Add New Course"
          >
            <PlusCircle size={18} />
            <span>New Course</span>
          </button>

          <button
            className="action-btn icon-only-btn"
            onClick={onResetAll}
            title="Reset to Initial Data"
            aria-label="Reset Data"
          >
            <RefreshCw size={18} />
          </button>

          <button 
            className="action-btn icon-only-btn theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle Theme Mode"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};
