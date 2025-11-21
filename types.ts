export interface TimeConfig {
    title: string;
    startTime: string; // ISO string for datetime-local input
    endTime: string;   // ISO string for datetime-local input
    precision: number; // 0 to 15
  }
  
  export interface ProgressStats {
    percent: number; // 0-100 raw
    elapsedMs: number;
    totalMs: number;
    remainingMs: number;
    isComplete: boolean;
    hasStarted: boolean;
  }