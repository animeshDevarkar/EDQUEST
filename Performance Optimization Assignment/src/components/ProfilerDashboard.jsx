import React from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { Activity, Trash2, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export const ProfilerDashboard = () => {
  const { profilerLogs, totalReRenders, lastRenderDuration, clearLogs, isOptimized } = usePerformance();

  const avgDuration = profilerLogs.length > 0
    ? (profilerLogs.reduce((acc, curr) => acc + curr.actualDuration, 0) / profilerLogs.length).toFixed(2)
    : '0.00';

  return (
    <div className="module-card">
      <div className="module-header">
        <div className="module-title">
          <h2>Module 4: React Profiler & Render Telemetry</h2>
          <p>
            Real-time telemetry output captured by native <code>&lt;Profiler onRender="..."&gt;</code> component wrapper tracking exact render costs.
          </p>
        </div>
        <div className="tech-badge">
          <Activity size={14} /> React.Profiler API
        </div>
      </div>

      <div className="grid-2col" style={{ marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Clock size={32} style={{ color: 'var(--accent-cyan)' }} />
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Render Duration</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{avgDuration} ms</div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Activity size={32} style={{ color: 'var(--accent-purple)' }} />
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Tracked Re-renders</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>{totalReRenders}</div>
          </div>
        </div>
      </div>

      <div className="control-row" style={{ justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '1rem', color: 'var(--text-main)' }}>Live Profiler Commit Log ({profilerLogs.length} entries)</h3>
        <button className="btn-secondary" onClick={clearLogs} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
          <Trash2 size={14} /> Clear Telemetry Log
        </button>
      </div>

      <div className="log-table-container">
        <table className="log-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Component ID</th>
              <th>Phase</th>
              <th>Actual Duration (ms)</th>
              <th>Base Duration (ms)</th>
              <th>Optimization Mode</th>
            </tr>
          </thead>
          <tbody>
            {profilerLogs.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No profiler commits recorded yet. Interact with the application modules to capture metrics!
                </td>
              </tr>
            ) : (
              profilerLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.timestamp}</td>
                  <td style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>{log.componentId}</td>
                  <td>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      background: log.phase === 'mount' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                      color: log.phase === 'mount' ? 'var(--accent-blue)' : 'var(--accent-purple)'
                    }}>
                      {log.phase}
                    </span>
                  </td>
                  <td style={{
                    color: log.actualDuration > 15 ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                    fontWeight: 'bold'
                  }}>
                    {log.actualDuration} ms
                  </td>
                  <td>{log.baseDuration} ms</td>
                  <td>
                    <span style={{
                      color: log.mode === 'Optimized' ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                    }}>
                      {log.mode}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
