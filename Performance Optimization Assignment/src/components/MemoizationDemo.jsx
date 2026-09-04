import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePerformance } from '../context/PerformanceContext';
import { useRenderCount } from '../hooks/useRenderCount';
import { Zap, RefreshCw, Layers } from 'lucide-react';

// Unoptimized Child Item (Re-renders on every parent tick because it is NOT wrapped in React.memo)
const UnoptimizedItem = ({ item, onClick }) => {
  const renders = useRenderCount();
  return (
    <div className="item-card" onClick={() => onClick(item.id)}>
      <div className="item-info">
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
      <span className="render-badge highlight">Renders: {renders}</span>
    </div>
  );
};

// Optimized Child Item (Wrapped in React.memo to skip re-renders if props don't change)
const OptimizedItem = React.memo(({ item, onClick }) => {
  const renders = useRenderCount();
  return (
    <div className="item-card" onClick={() => onClick(item.id)}>
      <div className="item-info">
        <h4>{item.title}</h4>
        <p>{item.description}</p>
      </div>
      <span className="render-badge">Renders: {renders}</span>
    </div>
  );
});

export const MemoizationDemo = () => {
  const { isOptimized } = usePerformance();
  const [ticker, setTicker] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const parentRenders = useRenderCount();

  // Simulated rapid parent state update (timer running every 300ms)
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTicker((t) => t + 1);
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Sample list items (50 items)
  const items = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        title: `Memoized Dashboard Component #${i + 1}`,
        description: `Sub-component state tracking render cycles.`
      })),
    []
  );

  // Callback handler:
  // In unoptimized mode: inline/re-created function on every parent render.
  // In optimized mode: wrapped in useCallback.
  const handleItemClickUnoptimized = (id) => {
    setActiveId(id);
  };

  const handleItemClickOptimized = useCallback((id) => {
    setActiveId(id);
  }, []);

  const handleClick = isOptimized ? handleItemClickOptimized : handleItemClickUnoptimized;

  // Expensive calculation memoization demo:
  const expensiveCalculation = (tickCount) => {
    // Artificial CPU load
    let sum = 0;
    for (let i = 0; i < 500000; i++) {
      sum += Math.sqrt(i + tickCount);
    }
    return sum.toFixed(2);
  };

  const calculatedValueOptimized = useMemo(
    () => expensiveCalculation(Math.floor(ticker / 10)),
    [Math.floor(ticker / 10)]
  );

  const calculatedValue = isOptimized
    ? calculatedValueOptimized
    : expensiveCalculation(ticker);

  return (
    <div className="module-card">
      <div className="module-header">
        <div className="module-title">
          <h2>Module 1: Memoization & Re-render Prevention</h2>
          <p>
            Demonstrates how <code>React.memo</code>, <code>useMemo</code>, and <code>useCallback</code> prevent expensive cascading component re-renders.
          </p>
        </div>
        <div className="tech-badge">
          <Layers size={14} /> React.memo + useMemo + useCallback
        </div>
      </div>

      {!isOptimized && (
        <div className="banner-notice warning">
          ⚠️ <strong>Unoptimized Mode Active:</strong> Every ticker update forces all 50 child components to re-render and re-evaluates CPU intensive math on every tick!
        </div>
      )}

      {isOptimized && (
        <div className="banner-notice success">
          ⚡ <strong>Optimized Mode Active:</strong> Child items are wrapped in <code>React.memo</code> and callbacks in <code>useCallback</code>. Ticker ticks do NOT trigger child re-renders!
        </div>
      )}

      <div className="control-row">
        <button
          className="btn-primary"
          onClick={() => setIsTimerRunning(!isTimerRunning)}
        >
          <RefreshCw className={isTimerRunning ? 'spin' : ''} size={16} />
          {isTimerRunning ? 'Stop Parent Ticker' : 'Start Rapid Parent Ticker (300ms)'}
        </button>

        <button className="btn-secondary" onClick={() => setTicker((t) => t + 1)}>
          Single Parent Render Tick
        </button>

        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
          Parent Renders: <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>{parentRenders}</span> | Ticker: {ticker}
        </div>
      </div>

      <div className="control-row" style={{ background: 'var(--bg-card)', padding: '12px 16px', borderRadius: '8px' }}>
        <div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Heavy Math Value:</span>{' '}
          <strong style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>{calculatedValue}</strong>
        </div>
        {activeId && (
          <div style={{ marginLeft: 'auto', fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>
            Selected Item ID: #{activeId}
          </div>
        )}
      </div>

      <div className="list-viewport" style={{ maxHeight: '320px' }}>
        {items.map((item) =>
          isOptimized ? (
            <OptimizedItem key={item.id} item={item} onClick={handleClick} />
          ) : (
            <UnoptimizedItem key={item.id} item={item} onClick={handleClick} />
          )
        )}
      </div>
    </div>
  );
};
