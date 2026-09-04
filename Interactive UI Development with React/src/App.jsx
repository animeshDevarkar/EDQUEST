import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import TodoStats from './components/TodoStats';
import TodoForm from './components/TodoForm';
import TodoFilter from './components/TodoFilter';
import TodoList from './components/TodoList';
import TodoEditModal from './components/TodoEditModal';
import './App.css';

// Initial sample items for demonstration
const INITIAL_TODOS = [
  {
    id: '1',
    title: 'Explore React component structure & props',
    completed: true,
    category: 'Learning',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Implement state management with hooks (useState, useEffect)',
    completed: false,
    category: 'Work',
    priority: 'High',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Write automated unit tests using Vitest',
    completed: false,
    category: 'Work',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  }
];

export default function App() {
  // State 1: Todos list state (loaded from LocalStorage or initialized)
  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('react_todo_app_data');
      return saved ? JSON.parse(saved) : INITIAL_TODOS;
    } catch {
      return INITIAL_TODOS;
    }
  });

  // State 2: Theme state (Dark/Light mode)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem('react_todo_theme') === 'dark';
    } catch {
      return false;
    }
  });

  // State 3: Filter & Search state
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // State 4: Modal state for editing
  const [editingTodo, setEditingTodo] = useState(null);

  // Sync todos state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('react_todo_app_data', JSON.stringify(todos));
    } catch (e) {
      console.error('Failed to save todos to localStorage:', e);
    }
  }, [todos]);

  // Sync theme state to document element & LocalStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('react_todo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('react_todo_theme', 'light');
    }
  }, [darkMode]);

  // State Handlers for Props Passing:

  // Handler: Add new todo item
  const handleAddTodo = (newTodoData) => {
    const newTodo = {
      id: Date.now().toString(),
      ...newTodoData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  // Handler: Toggle todo completed status
  const handleToggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Handler: Delete todo item
  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  // Handler: Save updated todo item
  const handleSaveEdit = (id, updatedFields) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, ...updatedFields } : todo
      )
    );
  };

  // Handler: Clear all completed tasks
  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // Handler: Mark all active tasks complete
  const handleMarkAllComplete = () => {
    setTodos((prev) => prev.map((todo) => ({ ...todo, completed: true })));
  };

  // Filtered todos derived with useMemo
  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      // Filter by status
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;

      // Filter by priority
      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;

      // Filter by search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTitle = todo.title.toLowerCase().includes(query);
        const matchCategory = todo.category.toLowerCase().includes(query);
        return matchTitle || matchCategory;
      }

      return true;
    });
  }, [todos, filter, priorityFilter, searchQuery]);

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="app-card">
        {/* Header Component */}
        <Header
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode((prev) => !prev)}
          activeCount={activeCount}
        />

        {/* Dashboard Statistics Component */}
        <TodoStats todos={todos} />

        {/* Form Component for Adding Todos */}
        <TodoForm onAddTodo={handleAddTodo} />

        {/* Filter and Search Bar Component */}
        <TodoFilter
          filter={filter}
          priorityFilter={priorityFilter}
          searchQuery={searchQuery}
          onFilterChange={setFilter}
          onPriorityFilterChange={setPriorityFilter}
          onSearchChange={setSearchQuery}
          onClearCompleted={handleClearCompleted}
          onMarkAllComplete={handleMarkAllComplete}
          completedCount={completedCount}
          activeCount={activeCount}
        />

        {/* Task List Component */}
        <TodoList
          todos={filteredTodos}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
          onEdit={(todo) => setEditingTodo(todo)}
          totalCount={todos.length}
        />
      </div>

      {/* Edit Modal Component */}
      {editingTodo && (
        <TodoEditModal
          todo={editingTodo}
          onSave={handleSaveEdit}
          onClose={() => setEditingTodo(null)}
        />
      )}
    </div>
  );
}
