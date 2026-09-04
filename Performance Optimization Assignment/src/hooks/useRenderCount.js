import { useRef, useEffect } from 'react';

/**
 * Custom hook to track component re-render count
 * @returns {number} Current render count
 */
export const useRenderCount = () => {
  const count = useRef(1);

  useEffect(() => {
    count.current += 1;
  });

  return count.current;
};
