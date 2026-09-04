import React, { Profiler } from 'react';
import { usePerformance } from '../context/PerformanceContext';

/**
 * Higher-order component / Wrapper utilizing native React <Profiler>
 */
export const ProfilerWrapper = ({ id, children }) => {
  const { addProfilerLog } = usePerformance();

  const handleRender = (
    profilerId,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    addProfilerLog(profilerId, phase, actualDuration, baseDuration, startTime, commitTime);
  };

  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  );
};
