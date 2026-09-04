import { useState, useCallback } from 'react';

/**
 * Custom hook for computing virtual list rendering window
 * @param {Array} items Complete list array
 * @param {number} itemHeight Fixed height of each list row in px
 * @param {number} viewportHeight Total height of container viewport in px
 * @param {number} overscan Number of extra off-screen buffer items to render
 */
export const useVirtualList = (items, itemHeight = 64, viewportHeight = 420, overscan = 5) => {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + viewportHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    virtualItems: visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    handleScroll
  };
};
