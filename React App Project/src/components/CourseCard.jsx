import React from 'react';
import { Star, Bookmark, Clock, User, ExternalLink, Trash2, CheckCircle, PlayCircle, Circle } from 'lucide-react';

export const CourseCard = ({
  course,
  onToggleBookmark,
  onUpdateStatus,
  onViewDetails,
  onDeleteCourse
}) => {
  const {
    id,
    title,
    category,
    instructor,
    difficulty,
    durationHours,
    rating,
    progress,
    status,
    isBookmarked,
    tags = [],
    description
  } = course;

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Completed':
        return <span className="status-tag status-completed"><CheckCircle size={12} /> Completed</span>;
      case 'In Progress':
        return <span className="status-tag status-in-progress"><PlayCircle size={12} /> In Progress</span>;
      default:
        return <span className="status-tag status-not-started"><Circle size={12} /> Not Started</span>;
    }
  };

  const getDifficultyBadge = (diff) => {
    const cls = diff.toLowerCase();
    return <span className={`diff-tag diff-${cls}`}>{diff}</span>;
  };

  return (
    <article className={`course-card ${isBookmarked ? 'bookmarked-card' : ''}`}>
      <div className="card-header">
        <div className="card-meta-top">
          <span className="category-badge">{category}</span>
          {getDifficultyBadge(difficulty)}
        </div>
        <button
          className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
          onClick={() => onToggleBookmark(id)}
          aria-label={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
          title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
        >
          <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <h3 className="card-title" onClick={() => onViewDetails(course)}>
        {title}
      </h3>

      <p className="card-description">{description}</p>

      <div className="card-instructor">
        <User size={14} />
        <span>{instructor}</span>
      </div>

      {/* Progress Bar & Details */}
      <div className="card-progress-wrapper">
        <div className="progress-label-row">
          <span className="progress-title">Completion</span>
          <span className="progress-percent">{progress}%</span>
        </div>
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="card-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag-chip">#{tag}</span>
          ))}
        </div>
      )}

      <div className="card-footer">
        <div className="footer-left">
          <div className="meta-item">
            <Clock size={14} />
            <span>{durationHours}h</span>
          </div>
          <div className="meta-item rating">
            <Star size={14} fill="currentColor" />
            <span>{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="footer-right">
          {getStatusBadge(status)}
        </div>
      </div>

      {/* Action Row */}
      <div className="card-actions">
        <button
          className="card-action-btn view-btn"
          onClick={() => onViewDetails(course)}
        >
          <ExternalLink size={14} /> Details
        </button>

        <select
          className="card-status-select"
          value={status}
          onChange={(e) => onUpdateStatus(id, e.target.value)}
          aria-label={`Update status for ${title}`}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button
          className="card-action-btn delete-btn"
          onClick={() => onDeleteCourse(id)}
          aria-label={`Delete ${title}`}
          title="Delete Course"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </article>
  );
};
