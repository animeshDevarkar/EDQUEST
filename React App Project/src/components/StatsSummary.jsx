import React from 'react';
import { Layers, CheckCircle2, Clock, Award, TrendingUp } from 'lucide-react';

export const StatsSummary = ({
  totalCourses = 0,
  completedCourses = 0,
  inProgressCourses = 0,
  totalHours = 0,
  completionRate = 0
}) => {
  return (
    <section className="stats-section" aria-label="Course Learning Metrics">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-bg primary">
            <Layers size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Courses</span>
            <span className="stat-value">{totalCourses}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-bg success">
            <CheckCircle2 size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{completedCourses}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-bg warning">
            <Clock size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{inProgressCourses}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-bg info">
            <Award size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Hours</span>
            <span className="stat-value">{totalHours}h</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-bg accent">
            <TrendingUp size={22} />
          </div>
          <div className="stat-details">
            <span className="stat-label">Completion Rate</span>
            <span className="stat-value">{completionRate}%</span>
          </div>
        </div>
      </div>
    </section>
  );
};
