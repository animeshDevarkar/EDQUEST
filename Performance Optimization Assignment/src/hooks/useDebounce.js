import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce high-frequency state changes (e.g. typing search input)
 * @param {any} value Value to debounce
 * @param {number} delay Delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
