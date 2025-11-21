import React from 'react';

interface ProgressBarProps {
  percent: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => {
  // Clamp percent for visual width
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full mt-8">
      
      {/* Marker Labels */}
      <div className="flex justify-between text-xs font-mono text-zinc-500 mb-2 px-1">
        <span>000%</span>
        <span>025%</span>
        <span>050%</span>
        <span>075%</span>
        <span>100%</span>
      </div>

      {/* Bar Container */}
      <div className="h-16 border-4 border-white bg-zinc-900 relative overflow-hidden shadow-hard">
        
        {/* Grid Background inside bar */}
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
             backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
             backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Fill */}
        <div 
          className="h-full bg-acid relative z-10 transition-all duration-75 ease-linear"
          style={{ width: `${clamped}%` }}
        >
            {/* Pattern on the fill */}
            <div 
                className="absolute inset-0 opacity-50" 
                style={{ 
                    backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 12px)' 
                }}
            ></div>
            
            {/* Leading Edge Highlight */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
        </div>

      </div>

      {/* Status Text underneath */}
      <div className="flex justify-between mt-2">
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${percent >= 100 ? 'bg-acid animate-ping' : 'bg-zinc-600'}`}></div>
            <span className="text-xs font-mono uppercase text-acid">
                {percent >= 100 ? 'COMPLETE' : percent > 0 ? 'IN_PROGRESS' : 'AWAITING'}
            </span>
        </div>
        <div className="text-xs font-mono text-zinc-500">
            SYS.MONITOR_V2
        </div>
      </div>
    </div>
  );
};
