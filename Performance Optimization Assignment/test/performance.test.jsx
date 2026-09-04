import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import App from '../src/App';
import { renderHook } from '@testing-library/react';
import { useRenderCount } from '../src/hooks/useRenderCount';
import { useDebounce } from '../src/hooks/useDebounce';
import { useVirtualList } from '../src/hooks/useVirtualList';

describe('Performance Optimization Suite Tests', () => {
  it('useRenderCount tracks render iterations', () => {
    const { result, rerender } = renderHook(() => useRenderCount());
    expect(result.current).toBe(1);
    rerender();
    expect(result.current).toBe(2);
    rerender();
    expect(result.current).toBe(3);
  });

  it('useDebounce delays value updates', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' }
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial'); // Not updated immediately

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('updated');
    vi.useRealTimers();
  });

  it('useVirtualList correctly slices visible window items', () => {
    const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
    const { result } = renderHook(() => useVirtualList(items, 50, 500, 2));

    // Viewport height 500 / row height 50 = 10 visible items + overscan
    expect(result.current.virtualItems.length).toBeLessThan(20);
    expect(result.current.totalHeight).toBe(50000);
    expect(result.current.startIndex).toBe(0);
  });

  it('App renders successfully with header and toggle mode', () => {
    render(<App />);
    const headers = screen.getAllByText(/React Performance Optimization Masterclass/i);
    expect(headers.length).toBeGreaterThan(0);
    const optimizedBadges = screen.getAllByText(/Optimized Mode/i);
    expect(optimizedBadges.length).toBeGreaterThan(0);
  });

  it('Toggling optimization mode updates UI telemetry', () => {
    render(<App />);
    const toggleSwitch = screen.getByTitle(/Toggle between Unoptimized and Optimized React execution/i);
    expect(screen.getAllByText(/Optimized Mode/i).length).toBeGreaterThan(0);

    fireEvent.click(toggleSwitch);
    expect(screen.getAllByText(/Unoptimized Mode/i).length).toBeGreaterThan(0);
  });
});
