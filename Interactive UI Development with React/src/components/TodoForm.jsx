import React, { useState } from 'react';
import { PlusCircle, Calendar, Tag, AlertCircle } from 'lucide-react';

/**
 * TodoForm Component
 * Props:
 *  - onAddTodo (function): Callback handler to add a new todo item
 * Demonstrates controlled component state & prop handler callback.
 */
export default function TodoForm({ onAddTodo }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }

    onAddTodo({
      title: title.trim(),
      category,
      priority,
      dueDate: dueDate || null
    });

    // Reset form state
    setTitle('');
    setCategory('Work');
    setPriority('Medium');
    setDueDate('');
    setError('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <h2 className="form-title">Add New Task</h2>
      
      {error && (
        <div className="form-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-main-row">
        <input
          type="text"
          className="todo-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          aria-label="Task title"
        />
        
        <button type="submit" className="add-btn">
          <PlusCircle size={20} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="form-options-row">
        <div className="option-group">
          <label htmlFor="category-select">
            <Tag size={16} /> Category:
          </label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
            <option value="Learning">Learning</option>
          </select>
        </div>

        <div className="option-group">
          <label htmlFor="priority-select">Priority:</label>
          <select
            id="priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="option-group">
          <label htmlFor="due-date">
            <Calendar size={16} /> Due Date:
          </label>
          <input
            id="due-date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}
