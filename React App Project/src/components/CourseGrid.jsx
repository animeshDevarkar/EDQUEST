import React from 'react';
import { CourseCard } from './CourseCard';
import { SearchX } from 'lucide-react';

export const CourseGrid = ({
  courses = [],
  onToggleBookmark,
  onUpdateStatus,
  onViewDetails,
  onDeleteCourse,
  onResetFilters
}) => {
  if (courses.length === 0) {
    return (
      <div className="empty-grid-state">
        <div className="empty-icon-wrapper">
          <SearchX size={48} />
        </div>
        <h3 className="empty-title">No matching courses found</h3>
        <p className="empty-description">
          Try adjusting your search query, difficulty filters, or category tabs to find what you're looking for.
        </p>
        <button className="action-btn secondary-btn" onClick={onResetFilters}>
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <section className="courses-grid" aria-label="Course catalog list">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onToggleBookmark={onToggleBookmark}
          onUpdateStatus={onUpdateStatus}
          onViewDetails={onViewDetails}
          onDeleteCourse={onDeleteCourse}
        />
      ))}
    </section>
  );
};
