import React, { useState, Suspense, lazy } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { FileCode, Eye, Loader2 } from 'lucide-react';
import DirectWidget from './DirectWidget'; // Eager import reference

// Lazy import reference
const LazyWidget = lazy(() => import('./LazyWidget'));

export const CodeSplittingDemo = () => {
  const { isOptimized } = usePerformance();
  const [showWidget, setShowWidget] = useState(false);

  return (
    <div className="module-card">
      <div className="module-header">
        <div className="module-title">
          <h2>Module 3: Code Splitting & Dynamic Imports</h2>
          <p>
            Demonstrates how <code>React.lazy()</code> and <code>Suspense</code> reduce initial bundle size by deferring secondary component loads until requested.
          </p>
        </div>
        <div className="tech-badge">
          <FileCode size={14} /> React.lazy + Suspense
        </div>
      </div>

      {!isOptimized ? (
        <div className="banner-notice warning">
          ⚠️ <strong>Unoptimized Mode Active (Eager Loading):</strong> Heavy analytical components are bundled into the primary JavaScript entry chunk, increasing Initial Page Load (FCP/TTI).
        </div>
      ) : (
        <div className="banner-notice success">
          ⚡ <strong>Optimized Mode Active (Lazy Loading):</strong> Heavy analytical components are extracted into separate dynamic chunks, loaded asynchronously via <code>Suspense</code> when visible.
        </div>
      )}

      <div className="control-row">
        <button
          className="btn-primary"
          onClick={() => setShowWidget(!showWidget)}
        >
          <Eye size={16} />
          {showWidget ? 'Hide Analytical Widget' : 'Load Heavy Analytical Widget'}
        </button>

        <div style={{ marginLeft: 'auto', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
          Mode: <strong style={{ color: isOptimized ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{isOptimized ? 'Lazy Chunked' : 'Eager Bundled'}</strong>
        </div>
      </div>

      {showWidget && (
        <>
          {isOptimized ? (
            <Suspense
              fallback={
                <div className="skeleton-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <Loader2 className="spin" size={24} style={{ marginRight: '8px' }} /> Loading Lazy Chunk via Suspense...
                </div>
              }
            >
              <LazyWidget />
            </Suspense>
          ) : (
            <DirectWidget />
          )}
        </>
      )}

      <div style={{ marginTop: '24px', background: 'var(--bg-card)', padding: '16px 20px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '8px' }}>
          Bundle Architecture Comparison
        </h4>
        <div className="grid-2col" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            <strong style={{ color: 'var(--accent-rose)' }}>Eager Bundling (Unoptimized):</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
              <li>Single monolithic <code>main.js</code> bundle (e.g. 1.2 MB).</li>
              <li>High Initial Parsing & Execution time.</li>
              <li>Slower Time to Interactive (TTI) on mobile devices.</li>
            </ul>
          </div>
          <div>
            <strong style={{ color: 'var(--accent-emerald)' }}>Lazy Bundling (Optimized):</strong>
            <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
              <li>Primary entry chunk reduced (e.g. 340 KB).</li>
              <li>Secondary routes & heavy modal widgets isolated.</li>
              <li>Instant initial render with smooth Suspense fallback.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
