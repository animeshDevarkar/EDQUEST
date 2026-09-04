import React from 'react';
import { Check, Edit, Trash2, Calendar, Tag } from 'lucide-react';

/**
 * TodoItem Component
 * Props:
 *  - todo (object): Todo item details (id, title, completed, priority, category, dueDate, createdAt)
 *  - onToggle (function): Callback to toggle completion state
 *  - onDelete (function): Callback to delete item
 *  - onEdit (function): Callback to open edit modal
 */
export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const isOverdue = todo.dueDate && !todo.completed && new Date(todo.dueDate) < new Date().setHours(0,0,0,0);

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority.toLowerCase()}`}>
      <div className="todo-item-checkbox">
        <button
          type="button"
          className={`checkbox-btn ${todo.completed ? 'checked' : ''}`}
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed && <Check size={16} />}
        </button>
      </div>

      <div className="todo-item-content">
        <div className="todo-header-line">
          <span className="todo-title">{todo.title}</span>
          
          <div className="badges">
            <span className={`badge category-badge category-${todo.category.toLowerCase()}`}>
              <Tag size={12} /> {todo.category}
            </span>
            <span className={`badge priority-badge priority-${todo.priority.toLowerCase()}`}>
              {todo.priority} Priority
            </span>
          </div>
        </div>

        {todo.dueDate && (
          <div className={`due-date-label ${isOverdue ? 'overdue' : ''}`}>
            <Calendar size={14} />
            <span>Due: {new Date(todo.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            {isOverdue && <span className="overdue-tag">Overdue</span>}
          </div>
        )}
      </div>

      <div className="todo-item-actions">
        <button
          onClick={() => onEdit(todo)}
          className="icon-btn edit-btn"
          aria-label="Edit task"
          title="Edit Task"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="icon-btn delete-btn"
          aria-label="Delete task"
          title="Delete Task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}
