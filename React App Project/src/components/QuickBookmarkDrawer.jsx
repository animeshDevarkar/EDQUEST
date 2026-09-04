import React from 'react';
import { X, Bookmark, Trash2, ExternalLink, BookmarkX } from 'lucide-react';

export const QuickBookmarkDrawer = ({
  isOpen,
  bookmarkedCourses = [],
  onClose,
  onViewDetails,
  onRemoveBookmark
}) => {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside 
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="drawer-header">
          <h2 id="drawer-title" className="drawer-title">
            <Bookmark size={20} className="active-icon" /> Saved Courses ({bookmarkedCourses.length})
          </h2>
          <button className="icon-close-btn" onClick={onClose} aria-label="Close drawer">
            <X size={20} />
          </button>
        </div>

        {bookmarkedCourses.length === 0 ? (
          <div className="drawer-empty-state">
            <BookmarkX size={44} />
            <p className="empty-msg">No courses saved yet.</p>
            <p className="sub-msg">Click the bookmark icon on any course card to save it for quick access.</p>
          </div>
        ) : (
          <div className="drawer-item-list">
            {bookmarkedCourses.map((c) => (
              <div key={c.id} className="drawer-item-card">
                <div className="drawer-item-info">
                  <span className="category-badge compact">{c.category}</span>
                  <h4 className="drawer-item-title">{c.title}</h4>
                  <span className="drawer-item-meta">{c.instructor} • {c.durationHours}h</span>
                </div>
                <div className="drawer-item-actions">
                  <button 
                    className="action-btn icon-only-btn compact"
                    onClick={() => {
                      onViewDetails(c);
                      onClose();
                    }}
                    title="View Details"
                    aria-label={`View details for ${c.title}`}
                  >
                    <ExternalLink size={16} />
                  </button>
                  <button 
                    className="action-btn icon-only-btn compact danger"
                    onClick={() => onRemoveBookmark(c.id)}
                    title="Remove Bookmark"
                    aria-label={`Remove ${c.title} from bookmarks`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
};
