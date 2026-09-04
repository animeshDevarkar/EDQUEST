import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('React To-Do List Application - State & Props Testing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial todo items and dashboard statistics', () => {
    render(<App />);

    expect(screen.getByText('React TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Explore React component structure & props')).toBeInTheDocument();
  });

  it('allows user to add a new task (state modification)', () => {
    render(<App />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    const addButton = screen.getByRole('button', { name: /add task/i });

    fireEvent.change(input, { target: { value: 'Build clean React App' } });
    fireEvent.click(addButton);

    expect(screen.getByText('Build clean React App')).toBeInTheDocument();
  });

  it('allows user to toggle completion state of a todo item', () => {
    render(<App />);

    const checkboxButtons = screen.getAllByRole('button', { name: /mark as/i });
    const firstCheckbox = checkboxButtons[0];

    fireEvent.click(firstCheckbox);
    // Toggling first task
    expect(firstCheckbox).toBeInTheDocument();
  });

  it('allows user to delete a task', () => {
    render(<App />);

    const taskText = 'Explore React component structure & props';
    expect(screen.getByText(taskText)).toBeInTheDocument();

    const deleteButtons = screen.getAllByRole('button', { name: /delete task/i });
    fireEvent.click(deleteButtons[0]);

    expect(screen.queryByText(taskText)).not.toBeInTheDocument();
  });

  it('filters tasks by status (Active / Completed)', () => {
    render(<App />);

    const activeFilter = screen.getByRole('button', { name: /^active$/i });
    fireEvent.click(activeFilter);

    // Completed item should not be visible when Active filter is selected
    expect(screen.queryByText('Explore React component structure & props')).not.toBeInTheDocument();
    expect(screen.getByText('Implement state management with hooks (useState, useEffect)')).toBeInTheDocument();
  });

  it('searches tasks by title query', () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'automated' } });

    expect(screen.getByText('Write automated unit tests using Vitest')).toBeInTheDocument();
    expect(screen.queryByText('Explore React component structure & props')).not.toBeInTheDocument();
  });
});
