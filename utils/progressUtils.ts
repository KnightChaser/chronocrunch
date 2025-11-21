/**
 * Utility functions for calculating and formatting progress and time durations.
 */

/**
 * Calculates the progress percentage and status based on start and end times.
 * @param start - Start time in milliseconds
 * @param end - End time in milliseconds
 * @returns Object with percent (0-100) and status ('PENDING' | 'ACTIVE' | 'COMPLETE')
 */
export const calculateProgress = (start: number, end: number) => {
  const now = Date.now();
  if (now < start) return { percent: 0, status: 'PENDING' };
  if (now > end) return { percent: 100, status: 'COMPLETE' };
  const total = end - start;
  const elapsed = now - start;
  return { percent: (elapsed / total) * 100, status: 'ACTIVE' };
};

/**
 * Formats a duration in milliseconds into a human-readable string.
 * Supports years, days, hours, minutes, and seconds.
 * @param ms - Duration in milliseconds
 * @returns Formatted string like "1y 2d 03h 04m 05s" or "2d 03h 04m 05s"
 */
export const formatDuration = (ms: number) => {
  if (ms <= 0) return "00:00:00";

  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const totalDays = Math.floor(ms / (1000 * 60 * 60 * 24));

  const years = Math.floor(totalDays / 365);
  const days = totalDays % 365;

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (years > 0) {
      return `${years}y ${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  }
  return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};