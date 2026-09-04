import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../src/App';
import { ThemeProvider } from '../src/context/ThemeContext';

const renderApp = () => {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

describe('EDquest React App Project - Component & Data Flow Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the header title and stats summary panel', () => {
    renderApp();
    expect(screen.getByText('EDquest EduFlow')).toBeInTheDocument();
    expect(screen.getByText('Total Courses')).toBeInTheDocument();
    expect(screen.getAllByText('Completed')[0]).toBeInTheDocument();
    expect(screen.getAllByText('In Progress')[0]).toBeInTheDocument();
  });

  it('renders initial courses catalog correctly', () => {
    renderApp();
    expect(screen.getByText('Modern React Architecture & Component Patterns')).toBeInTheDocument();
    expect(screen.getByText('TypeScript for Production Web Applications')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Node.js & Express REST APIs')).toBeInTheDocument();
  });

  it('filters courses by search query input', async () => {
    renderApp();
    const searchInput = screen.getByPlaceholderText(/Search courses by title/i);

    fireEvent.change(searchInput, { target: { value: 'TypeScript' } });

    expect(screen.getByText('TypeScript for Production Web Applications')).toBeInTheDocument();
    expect(screen.queryByText('Modern React Architecture & Component Patterns')).not.toBeInTheDocument();
  });

  it('filters courses by category tab selection', async () => {
    renderApp();
    const backendTab = screen.getByRole('tab', { name: 'Backend' });

    fireEvent.click(backendTab);

    expect(screen.getByText('Full Stack Node.js & Express REST APIs')).toBeInTheDocument();
    expect(screen.queryByText('Modern React Architecture & Component Patterns')).not.toBeInTheDocument();
  });

  it('toggles course bookmark status via card callback props', async () => {
    renderApp();
    const bookmarkBtns = screen.getAllByRole('button', { name: /Bookmark/i });

    expect(bookmarkBtns.length).toBeGreaterThan(0);
    fireEvent.click(bookmarkBtns[0]);

    // Check saved count badge
    const savedBtn = screen.getByRole('button', { name: /View Saved Bookmarks/i });
    expect(savedBtn).toBeInTheDocument();
  });

  it('opens and submits Add New Course modal form to lift state', async () => {
    renderApp();

    // Open Modal
    const addBtn = screen.getByRole('button', { name: /New Course/i });
    fireEvent.click(addBtn);

    expect(screen.getByRole('heading', { name: /Add New Course/i })).toBeInTheDocument();

    // Fill form
    fireEvent.change(screen.getByLabelText(/Course Title \*/i), {
      target: { value: 'Next.js 15 Server Components Masterclass' }
    });
    fireEvent.change(screen.getByLabelText(/Instructor \*/i), {
      target: { value: 'Guillermo Rauch' }
    });
    fireEvent.change(screen.getByLabelText(/Description \*/i), {
      target: { value: 'Deep dive into App Router, React Server Components, and Streaming.' }
    });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Create Course/i });
    fireEvent.click(submitBtn);

    // Verify newly added course appears in UI
    await waitFor(() => {
      expect(screen.getByText('Next.js 15 Server Components Masterclass')).toBeInTheDocument();
    });
  });

  it('opens details modal when clicking course title or details button', async () => {
    renderApp();

    const titleElement = screen.getByText('Modern React Architecture & Component Patterns');
    fireEvent.click(titleElement);

    expect(screen.getByText('Learning Progress Tracker')).toBeInTheDocument();
    expect(screen.getByText('Personal Study Notes')).toBeInTheDocument();
  });

  it('updates course status from select dropdown in course card', async () => {
    renderApp();

    const statusSelects = screen.getAllByRole('combobox', { name: /Update status for/i });
    expect(statusSelects.length).toBeGreaterThan(0);

    fireEvent.change(statusSelects[0], { target: { value: 'Completed' } });

    expect(statusSelects[0].value).toBe('Completed');
  });
});
