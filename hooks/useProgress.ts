import { useState, useEffect, useRef } from 'react';
import { TimeConfig } from '../types';
import { calculateProgress } from '../utils/progressUtils';

/**
 * Custom hook to manage progress calculation and animation loop.
 * Returns current progress, status, and current time.
 * @param config - The time configuration
 * @returns Object with progress, status, and now
 */
export const useProgress = (config: TimeConfig) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('PENDING');
  const [now, setNow] = useState(Date.now());
  const requestRef = useRef<number | null>(null);

  // Animation Loop
  const animate = () => {
    const start = new Date(config.startTime).getTime();
    const end = new Date(config.endTime).getTime();
    const result = calculateProgress(start, end);

    setProgress(result.percent);
    setStatus(result.status);
    setNow(Date.now());

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [config]);

  return { progress, status, now };
};