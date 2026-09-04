import React, { createContext, useContext, useState, useCallback } from 'react';

const PerformanceContext = createContext(null);

export const PerformanceProvider = ({ children }) => {
  const [isOptimized, setIsOptimized] = useState(true);
  const [profilerLogs, setProfilerLogs] = useState([]);
  const [totalReRenders, setTotalReRenders] = useState(0);
  const [lastRenderDuration, setLastRenderDuration] = useState(0);

  const toggleOptimization = useCallback(() => {
    setIsOptimized((prev) => !prev);
  }, []);

  const addProfilerLog = useCallback((id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    const duration = parseFloat(actualDuration.toFixed(2));
    
    // Defer state update out of synchronous commit phase to prevent infinite loop
    queueMicrotask(() => {
      setLastRenderDuration(duration);
      setTotalReRenders((prev) => prev + 1);

      setProfilerLogs((prevLogs) => {
        const newEntry = {
          id: `${id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          componentId: id,
          phase,
          actualDuration: duration,
          baseDuration: parseFloat(baseDuration.toFixed(2)),
          timestamp: new Date().toLocaleTimeString(),
          mode: isOptimized ? 'Optimized' : 'Unoptimized'
        };
        return [newEntry, ...prevLogs.slice(0, 49)];
      });
    });
  }, [isOptimized]);

  const clearLogs = useCallback(() => {
    setProfilerLogs([]);
    setTotalReRenders(0);
    setLastRenderDuration(0);
  }, []);

  return (
    <PerformanceContext.Provider
      value={{
        isOptimized,
        toggleOptimization,
        profilerLogs,
        addProfilerLog,
        totalReRenders,
        lastRenderDuration,
        clearLogs
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
