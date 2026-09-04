import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle } from 'lucide-react';

export const AddCourseForm = ({
  isOpen,
  onClose,
  onAddCourse,
  categories = ['Frontend', 'Backend', 'Design', 'Data', 'Testing'],
  difficulties = ['Beginner', 'Intermediate', 'Advanced']
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Frontend');
  const [instructor, setInstructor] = useState('');
  const [difficulty, setDifficulty] = useState(difficulties[0] || 'Beginner');
  const [durationHours, setDurationHours] = useState('10');
  const [rating, setRating] = useState('4.8');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Course title is required.');
      return;
    }
    if (!instructor.trim()) {
      setError('Instructor name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Course description is required.');
      return;
    }

    const tagArray = tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newCourse = {
      id: `course-${Date.now()}`,
      title: title.trim(),
      category,
      instructor: instructor.trim(),
      difficulty,
      durationHours: parseFloat(durationHours) || 1,
      rating: parseFloat(rating) || 5.0,
      progress: 0,
      status: 'Not Started',
      isBookmarked: false,
      tags: tagArray.length > 0 ? tagArray : [category],
      description: description.trim(),
      notes: ''
    };

    onAddCourse(newCourse);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setCategory(categories[0] || 'Frontend');
    setInstructor('');
    setDifficulty(difficulties[0] || 'Beginner');
    setDurationHours('10');
    setRating('4.8');
    setTags('');
    setDescription('');
    setError('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content add-modal" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-modal-title"
      >
        <div className="modal-header">
          <h2 id="add-modal-title" className="modal-title">
            <PlusCircle size={20} /> Add New Course
          </h2>
          <button className="icon-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-error-alert" role="alert">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="course-title">Course Title *</label>
            <input
              id="course-title"
              type="text"
              className="form-input"
              placeholder="e.g. Master React 19 State & Context"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="course-category">Category *</label>
              <select
                id="course-category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="course-difficulty">Difficulty *</label>
              <select
                id="course-difficulty"
                className="form-input"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="course-instructor">Instructor *</label>
              <input
                id="course-instructor"
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Jane Doe"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="course-duration">Duration (Hours)</label>
              <input
                id="course-duration"
                type="number"
                min="1"
                max="200"
                className="form-input"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="course-tags">Tags (comma separated)</label>
            <input
              id="course-tags"
              type="text"
              className="form-input"
              placeholder="e.g. React, Hooks, Redux, State"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="course-description">Description *</label>
            <textarea
              id="course-description"
              className="form-textarea"
              rows="3"
              placeholder="Brief summary of what this course covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="action-btn secondary-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="action-btn primary-btn">
              Create Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
