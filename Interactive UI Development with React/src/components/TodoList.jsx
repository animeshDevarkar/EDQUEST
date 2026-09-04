import React from 'react';
import TodoItem from './TodoItem';
import { ClipboardList } from 'lucide-react';

/**
 * TodoList Component
 * Props:
 *  - todos (array): List of filtered todo objects to display
 *  - onToggle (function): Handler passed down to TodoItem
 *  - onDelete (function): Handler passed down to TodoItem
 *  - onEdit (function): Handler passed down to TodoItem
 *  - totalCount (number): Overall task count before filtering
 */
export default function TodoList({ todos, onToggle, onDelete, onEdit, totalCount }) {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={48} className="empty-icon" />
        <h3>{totalCount === 0 ? "No tasks yet!" : "No matching tasks found"}</h3>
        <p>
          {totalCount === 0
            ? "Add a task using the form above to get started."
            : "Try adjusting your search query or filter options."}
        </p>
      </div>
    );
  }

  return (
    <ul className="todo-list" aria-label="Task list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
