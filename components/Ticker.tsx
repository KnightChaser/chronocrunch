import React, { useRef, useEffect } from 'react';

interface TickerProps {
  value: number;
  precision: number;
  className?: string;
}

export const Ticker: React.FC<TickerProps> = ({ value, precision, className = '' }) => {
  const elementRef = useRef<HTMLSpanElement>(null);

  // We use a ref to update the DOM directly for performance with high refresh rates,
  // although React 18 is fast, direct manipulation ensures 0 lag with requestAnimationFrame loops up the chain.
  useEffect(() => {
    if (elementRef.current) {
      const formatted = value.toFixed(precision);
      // Split integer and decimal for potential styling hooks if we wanted (kept simple here for now)
      elementRef.current.textContent = formatted;
    }
  }, [value, precision]);

  return (
    <span 
      ref={elementRef} 
      className={`font-mono tabular-nums tracking-tighter ${className}`}
    >
      {/* Initial render fallback */}
      {value.toFixed(precision)}
    </span>
  );
};
