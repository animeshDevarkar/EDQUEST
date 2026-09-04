import React, { useState, useEffect } from 'react';
import { X, Bookmark, Star, Clock, User, FileText, CheckCircle2, Save } from 'lucide-react';

export const CourseDetailModal = ({
  isOpen,
  course,
  onClose,
  onUpdateProgress,
  onUpdateNotes,
  onToggleBookmark,
  onUpdateStatus
}) => {
  const [localProgress, setLocalProgress] = useState(0);
  const [localNotes, setLocalNotes] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    if (course) {
      setLocalProgress(course.progress || 0);
      setLocalNotes(course.notes || '');
      setSavedMessage('');
    }
  }, [course]);

  if (!isOpen || !course) return null;

  const handleProgressChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setLocalProgress(val);
    onUpdateProgress(course.id, val);

    // Auto update status based on progress percentage
    if (val === 100 && course.status !== 'Completed') {
      onUpdateStatus(course.id, 'Completed');
    } else if (val > 0 && val < 100 && course.status === 'Not Started') {
      onUpdateStatus(course.id, 'In Progress');
    }
  };

  const handleSaveNotes = () => {
    onUpdateNotes(course.id, localNotes);
    setSavedMessage('Notes saved successfully!');
    setTimeout(() => setSavedMessage(''), 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content detail-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
      >
        <div className="modal-header">
          <div className="modal-header-badges">
            <span className="category-badge">{course.category}</span>
            <span className={`diff-tag diff-${course.difficulty.toLowerCase()}`}>
              {course.difficulty}
            </span>
          </div>
          <button className="icon-close-btn" onClick={onClose} aria-label="Close detail modal">
            <X size={20} />
          </button>
        </div>

        <h2 id="detail-modal-title" className="detail-modal-title">
          {course.title}
        </h2>

        <div className="detail-meta-row">
          <div className="meta-item">
            <User size={16} /> <span>Instructor: <strong>{course.instructor}</strong></span>
          </div>
          <div className="meta-item">
            <Clock size={16} /> <span>Duration: <strong>{course.durationHours} Hours</strong></span>
          </div>
          <div className="meta-item rating">
            <Star size={16} fill="currentColor" /> <span>Rating: <strong>{course.rating.toFixed(1)} / 5.0</strong></span>
          </div>
        </div>

        <p className="detail-description">{course.description}</p>

        {/* Progress Slider */}
        <div className="detail-section progress-section">
          <div className="section-header-row">
            <label htmlFor="progress-slider" className="section-title">
              Learning Progress Tracker
            </label>
            <span className="progress-value-badge">{localProgress}%</span>
          </div>
          <input
            id="progress-slider"
            type="range"
            min="0"
            max="100"
            value={localProgress}
            onChange={handleProgressChange}
            className="progress-slider-input"
          />
          <div className="slider-labels">
            <span>0% (Not Started)</span>
            <span>50% (In Progress)</span>
            <span>100% (Completed)</span>
          </div>
        </div>

        {/* Notes Editor */}
        <div className="detail-section notes-section">
          <div className="section-header-row">
            <label htmlFor="notes-editor" className="section-title">
              <FileText size={16} /> Personal Study Notes
            </label>
            {savedMessage && (
              <span className="save-toast-inline"><CheckCircle2 size={14} /> {savedMessage}</span>
            )}
          </div>
          <textarea
            id="notes-editor"
            className="form-textarea notes-area"
            rows="4"
            placeholder="Jot down key takeaways, code snippets, or questions..."
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
          ></textarea>
          <div className="notes-action-row">
            <button className="action-btn secondary-btn compact" onClick={handleSaveNotes}>
              <Save size={14} /> Save Notes
            </button>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="modal-footer detail-footer">
          <button
            className={`action-btn ${course.isBookmarked ? 'active-bookmark-btn' : 'secondary-btn'}`}
            onClick={() => onToggleBookmark(course.id)}
          >
            <Bookmark size={16} fill={course.isBookmarked ? 'currentColor' : 'none'} />
            {course.isBookmarked ? 'Bookmarked' : 'Add to Saved'}
          </button>

          <button className="action-btn primary-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
