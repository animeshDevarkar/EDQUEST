import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { initialCourses, CATEGORIES, STATUSES, DIFFICULTIES } from './data/initialCourses';
import { Header } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { ControlPanel } from './components/ControlPanel';
import { CourseGrid } from './components/CourseGrid';
import { AddCourseForm } from './components/AddCourseForm';
import { CourseDetailModal } from './components/CourseDetailModal';
import { QuickBookmarkDrawer } from './components/QuickBookmarkDrawer';
import { Toast } from './components/Toast';

export function App() {
  // Course State with LocalStorage Persistence
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('edquest_courses');
      return saved ? JSON.parse(saved) : initialCourses;
    } catch {
      return initialCourses;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('edquest_courses', JSON.stringify(courses));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [courses]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('title');

  // Modal & Overlay State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDetailCourse, setSelectedDetailCourse] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast({ message: '', type: 'info' });
  }, []);

  // Filtered and Sorted Courses Computation
  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        // Search Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = c.title.toLowerCase().includes(q);
          const matchInstructor = c.instructor.toLowerCase().includes(q);
          const matchDesc = c.description.toLowerCase().includes(q);
          const matchTags = c.tags && c.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchInstructor && !matchDesc && !matchTags) return false;
        }

        // Category Filter
        if (selectedCategory !== 'All' && c.category !== selectedCategory) {
          return false;
        }

        // Status Filter
        if (selectedStatus !== 'All' && c.status !== selectedStatus) {
          return false;
        }

        // Difficulty Filter
        if (selectedDifficulty !== 'All' && c.difficulty !== selectedDifficulty) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'progress') return b.progress - a.progress;
        if (sortBy === 'duration') return b.durationHours - a.durationHours;
        return a.title.localeCompare(b.title);
      });
  }, [courses, searchQuery, selectedCategory, selectedStatus, selectedDifficulty, sortBy]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = courses.length;
    const completed = courses.filter((c) => c.status === 'Completed').length;
    const inProgress = courses.filter((c) => c.status === 'In Progress').length;
    const bookmarked = courses.filter((c) => c.isBookmarked).length;
    const totalHours = courses.reduce((acc, c) => acc + (c.durationHours || 0), 0);
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, bookmarked, totalHours, completionRate };
  }, [courses]);

  // Bookmarked Courses List
  const bookmarkedCourses = useMemo(() => {
    return courses.filter((c) => c.isBookmarked);
  }, [courses]);

  // Action Handlers (Unidirectional Data Flow)
  const handleToggleBookmark = useCallback((id) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextVal = !c.isBookmarked;
          showToast(
            nextVal ? `Saved "${c.title}" to bookmarks` : `Removed "${c.title}" from bookmarks`,
            nextVal ? 'success' : 'info'
          );
          return { ...c, isBookmarked: nextVal };
        }
        return c;
      })
    );

    // Keep detail modal updated if open
    setSelectedDetailCourse((prev) => {
      if (prev && prev.id === id) {
        return { ...prev, isBookmarked: !prev.isBookmarked };
      }
      return prev;
    });
  }, [showToast]);

  const handleUpdateStatus = useCallback((id, newStatus) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          let newProgress = c.progress;
          if (newStatus === 'Completed') newProgress = 100;
          if (newStatus === 'Not Started') newProgress = 0;
          if (newStatus === 'In Progress' && (c.progress === 0 || c.progress === 100)) {
            newProgress = 50;
          }

          showToast(`Updated "${c.title}" status to ${newStatus}`, 'success');
          return { ...c, status: newStatus, progress: newProgress };
        }
        return c;
      })
    );

    // Sync open modal
    setSelectedDetailCourse((prev) => {
      if (prev && prev.id === id) {
        let newProgress = prev.progress;
        if (newStatus === 'Completed') newProgress = 100;
        if (newStatus === 'Not Started') newProgress = 0;
        if (newStatus === 'In Progress' && (prev.progress === 0 || prev.progress === 100)) {
          newProgress = 50;
        }
        return { ...prev, status: newStatus, progress: newProgress };
      }
      return prev;
    });
  }, [showToast]);

  const handleUpdateProgress = useCallback((id, newProgress) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          let newStatus = c.status;
          if (newProgress === 100) newStatus = 'Completed';
          else if (newProgress === 0) newStatus = 'Not Started';
          else newStatus = 'In Progress';
          return { ...c, progress: newProgress, status: newStatus };
        }
        return c;
      })
    );
  }, []);

  const handleUpdateNotes = useCallback((id, notes) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, notes };
        }
        return c;
      })
    );
  }, []);

  const handleAddCourse = useCallback((newCourse) => {
    setCourses((prev) => [newCourse, ...prev]);
    showToast(`Successfully created "${newCourse.title}"`, 'success');
  }, [showToast]);

  const handleDeleteCourse = useCallback((id) => {
    const target = courses.find((c) => c.id === id);
    if (!target) return;
    if (window.confirm(`Are you sure you want to delete "${target.title}"?`)) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showToast(`Deleted "${target.title}"`, 'danger');
      if (selectedDetailCourse && selectedDetailCourse.id === id) {
        setSelectedDetailCourse(null);
      }
    }
  }, [courses, selectedDetailCourse, showToast]);

  const handleResetAll = useCallback(() => {
    if (window.confirm('Reset all course data back to initial defaults?')) {
      setCourses(initialCourses);
      localStorage.removeItem('edquest_courses');
      setSearchQuery('');
      setSelectedCategory('All');
      setSelectedStatus('All');
      setSelectedDifficulty('All');
      setSortBy('title');
      showToast('Reset data to default courses catalog', 'info');
    }
  }, [showToast]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedDifficulty('All');
    setSortBy('title');
    showToast('Cleared search and filter parameters', 'info');
  }, [showToast]);

  return (
    <div className="app-shell">
      <Header
        title="EDquest EduFlow"
        subtitle="React Component Architecture & Unidirectional Data Flow Workspace"
        bookmarkedCount={stats.bookmarked}
        onOpenBookmarks={() => setIsDrawerOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onResetAll={handleResetAll}
      />

      <main className="main-content-container">
        <StatsSummary
          totalCourses={stats.total}
          completedCourses={stats.completed}
          inProgressCourses={stats.inProgress}
          totalHours={stats.totalHours}
          completionRate={stats.completionRate}
        />

        <ControlPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          sortBy={sortBy}
          onSortChange={setSortBy}
          categories={CATEGORIES}
          statuses={STATUSES}
          difficulties={DIFFICULTIES}
          onClearFilters={handleClearFilters}
        />

        <CourseGrid
          courses={filteredCourses}
          onToggleBookmark={handleToggleBookmark}
          onUpdateStatus={handleUpdateStatus}
          onViewDetails={(c) => setSelectedDetailCourse(c)}
          onDeleteCourse={handleDeleteCourse}
          onResetFilters={handleClearFilters}
        />
      </main>

      {/* Modals and Drawers */}
      <AddCourseForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCourse={handleAddCourse}
        categories={CATEGORIES.filter((c) => c !== 'All')}
        difficulties={DIFFICULTIES.filter((d) => d !== 'All')}
      />

      <CourseDetailModal
        isOpen={!!selectedDetailCourse}
        course={selectedDetailCourse}
        onClose={() => setSelectedDetailCourse(null)}
        onUpdateProgress={handleUpdateProgress}
        onUpdateNotes={handleUpdateNotes}
        onToggleBookmark={handleToggleBookmark}
        onUpdateStatus={handleUpdateStatus}
      />

      <QuickBookmarkDrawer
        isOpen={isDrawerOpen}
        bookmarkedCourses={bookmarkedCourses}
        onClose={() => setIsDrawerOpen(false)}
        onViewDetails={(c) => setSelectedDetailCourse(c)}
        onRemoveBookmark={handleToggleBookmark}
      />

      <Toast
        toastMessage={toast.message}
        toastType={toast.type}
        onClose={closeToast}
      />
    </div>
  );
}
