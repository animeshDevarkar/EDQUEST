import React, { useState } from 'react';
import { X, Save, Calendar, Tag } from 'lucide-react';

/**
 * TodoEditModal Component
 * Props:
 *  - todo (object): Todo item being edited
 *  - onSave (function): Callback handler to save changes
 *  - onClose (function): Callback handler to close modal
 */
export default function TodoEditModal({ todo, onSave, onClose }) {
  const [title, setTitle] = useState(todo.title);
  const [category, setCategory] = useState(todo.category || 'Work');
  const [priority, setPriority] = useState(todo.priority || 'Medium');
  const [dueDate, setDueDate] = useState(todo.dueDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(todo.id, {
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || null
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Task</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="edit-title">Task Title</label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="edit-category">
                <Tag size={16} /> Category
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Urgent">Urgent</option>
                <option value="Learning">Learning</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-priority">Priority</label>
              <select
                id="edit-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-duedate">
              <Calendar size={16} /> Due Date
            </label>
            <input
              id="edit-duedate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
