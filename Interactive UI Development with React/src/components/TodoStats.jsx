import React from 'react';
import { ListTodo, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

/**
 * TodoStats Component
 * Props:
 *  - todos (array): Array of todo objects
 * Demonstrates calculating statistics dynamically from props state.
 */
export default function TodoStats({ todos }) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  const highPriorityCount = todos.filter(t => !t.completed && t.priority === 'High').length;

  return (
    <section className="stats-section" aria-label="Task statistics">
      <div className="stat-card">
        <div className="stat-icon total">
          <ListTodo size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon completed">
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completed}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon pending">
          <Clock size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{pending}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon urgent">
          <AlertTriangle size={22} />
        </div>
        <div className="stat-content">
          <span className="stat-label">High Priority</span>
          <span className="stat-value">{highPriorityCount}</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-header">
          <span>Overall Completion</span>
          <span>{percentage}%</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>
      </div>
    </section>
  );
}
