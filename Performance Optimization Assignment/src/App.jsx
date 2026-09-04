import React, { useState } from 'react';
import { PerformanceProvider, usePerformance } from './context/PerformanceContext';
import { ProfilerWrapper } from './components/ProfilerWrapper';
import { MemoizationDemo } from './components/MemoizationDemo';
import { LargeListDemo } from './components/LargeListDemo';
import { CodeSplittingDemo } from './components/CodeSplittingDemo';
import { ProfilerDashboard } from './components/ProfilerDashboard';
import { BenchmarkRunner } from './components/BenchmarkRunner';
import { Zap, Layers, Database, FileCode, Activity, Gauge, Cpu, ShieldCheck } from 'lucide-react';

const MainContent = () => {
  const { isOptimized, toggleOptimization, totalReRenders, lastRenderDuration } = usePerformance();
  const [activeTab, setActiveTab] = useState('memoization');

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-title-group">
          <h1>
            <Zap size={28} style={{ color: 'var(--accent-cyan)' }} />
            React Performance Optimization Masterclass
          </h1>
          <p>EDquest Advanced React Performance Profiling, Memoization & Virtualization Suite</p>
        </div>

        <div className="mode-toggle-card">
          <div
            className={`toggle-switch ${isOptimized ? 'optimized' : ''}`}
            onClick={toggleOptimization}
            title="Toggle between Unoptimized and Optimized React execution"
          >
            <div className="toggle-knob" />
          </div>
          <div className="mode-label">
            <span className={`mode-title ${isOptimized ? 'optimized' : 'unoptimized'}`}>
              {isOptimized ? 'Optimized Mode' : 'Unoptimized Mode'}
            </span>
            <span className="mode-subtext">
              {isOptimized ? 'Memoized + Virtualized + Lazy' : 'Raw React Renders & Monolithic Chunks'}
            </span>
          </div>
        </div>
      </header>

      {/* Global Telemetry Bar */}
      <div className="telemetry-bar">
        <div className="metric-card">
          <div className="metric-icon blue">
            <Cpu size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Execution Mode</span>
            <span className="metric-value" style={{ color: isOptimized ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
              {isOptimized ? 'Optimized' : 'Unoptimized'}
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon purple">
            <Activity size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Total Re-render Cycles</span>
            <span className="metric-value">{totalReRenders}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon amber">
            <Zap size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Last Render Duration</span>
            <span className="metric-value">{lastRenderDuration} ms</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon emerald">
            <ShieldCheck size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-label">Target Frame Rate</span>
            <span className="metric-value" style={{ color: isOptimized ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
              {isOptimized ? '60.0 FPS' : '30-45 FPS'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'memoization' ? 'active' : ''}`}
          onClick={() => setActiveTab('memoization')}
        >
          <Layers size={16} /> Module 1: Memoization
        </button>

        <button
          className={`tab-btn ${activeTab === 'virtualization' ? 'active' : ''}`}
          onClick={() => setActiveTab('virtualization')}
        >
          <Database size={16} /> Module 2: Virtualization
        </button>

        <button
          className={`tab-btn ${activeTab === 'codesplitting' ? 'active' : ''}`}
          onClick={() => setActiveTab('codesplitting')}
        >
          <FileCode size={16} /> Module 3: Code Splitting
        </button>

        <button
          className={`tab-btn ${activeTab === 'profiler' ? 'active' : ''}`}
          onClick={() => setActiveTab('profiler')}
        >
          <Activity size={16} /> Module 4: Profiler Telemetry
        </button>

        <button
          className={`tab-btn ${activeTab === 'benchmark' ? 'active' : ''}`}
          onClick={() => setActiveTab('benchmark')}
        >
          <Gauge size={16} /> Module 5: Stress Benchmark
        </button>
      </div>

      {/* Module Views wrapped in Profiler */}
      {activeTab === 'memoization' && (
        <ProfilerWrapper id="MemoizationModule">
          <MemoizationDemo />
        </ProfilerWrapper>
      )}

      {activeTab === 'virtualization' && (
        <ProfilerWrapper id="VirtualizationModule">
          <LargeListDemo />
        </ProfilerWrapper>
      )}

      {activeTab === 'codesplitting' && (
        <ProfilerWrapper id="CodeSplittingModule">
          <CodeSplittingDemo />
        </ProfilerWrapper>
      )}

      {activeTab === 'profiler' && (
        <ProfilerWrapper id="ProfilerDashboardModule">
          <ProfilerDashboard />
        </ProfilerWrapper>
      )}

      {activeTab === 'benchmark' && (
        <ProfilerWrapper id="BenchmarkModule">
          <BenchmarkRunner />
        </ProfilerWrapper>
      )}

      <footer className="app-footer">
        <p>
          React Performance Optimization Masterclass • EDquest Full-Stack Engineering • Built by <strong>Animesh Devarkar</strong>
        </p>
      </footer>
    </div>
  );
};

export const App = () => {
  return (
    <PerformanceProvider>
      <MainContent />
    </PerformanceProvider>
  );
};

export default App;
