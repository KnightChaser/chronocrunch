import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  color: string;
  textColor: string;
}

/**
 * A reusable card component for displaying metrics with dynamic font sizing.
 * Adjusts text size based on value length for better readability.
 */
export const MetricCard: React.FC<MetricCardProps> = ({ label, value, color, textColor }) => {
  // Simple heuristic: if value is very long, use smaller text
  const isLongText = value.length > 12;
  const isVeryLongText = value.length > 20;

  return (
    <div className={`bg-zinc-950 border-2 ${color} p-4 shadow-[4px_4px_0px_0px_#222] hover:translate-y-[-2px] transition-transform`}>
      <div className="text-zinc-500 font-mono text-xs uppercase mb-1 tracking-widest border-b border-zinc-800 pb-1">{label}</div>
      <div className={`font-bold ${textColor} font-mono leading-tight ${isVeryLongText ? 'text-lg' : isLongText ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
        {value}
      </div>
    </div>
  );
};