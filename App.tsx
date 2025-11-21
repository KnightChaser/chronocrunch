import React, { useState, useEffect } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { ProgressBar } from './components/ProgressBar';
import { Ticker } from './components/Ticker';
import { MetricCard } from './components/MetricCard';
import { useProgress } from './hooks/useProgress';
import { INITIAL_CONFIG } from './constants';
import { TimeConfig } from './types';
import { formatDuration } from './utils/progressUtils';
import { AlertTriangle, Zap } from 'lucide-react';

const getInitialConfig = (): { config: TimeConfig, isOpen: boolean } => {
  if (typeof window === 'undefined') return { config: INITIAL_CONFIG, isOpen: false };

  const params = new URLSearchParams(window.location.search);
  
  // If no params, return default
  if (!window.location.search) {
    return { config: INITIAL_CONFIG, isOpen: false };
  }

  const title = params.get('title');
  const start = params.get('start');
  const end = params.get('end');
  const precision = params.get('precision');

  if (title && start && end && precision) {
     const startDate = new Date(start);
     const endDate = new Date(end);
     const prec = parseInt(precision, 10);

     // Basic validation
     if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && !isNaN(prec)) {
         return {
             config: {
                 title,
                 startTime: start,
                 endTime: end,
                 precision: prec
             },
             isOpen: false
         };
     }
  }

  // If we have params but they are invalid/incomplete
  return { config: INITIAL_CONFIG, isOpen: true };
};

export default function App() {
  const initial = getInitialConfig();
  const [config, setConfig] = useState<TimeConfig>(initial.config);
  const [isConfigOpen, setIsConfigOpen] = useState(initial.isOpen);
  const { progress, status, now } = useProgress(config);

  // Update URL when config changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('title', config.title);
    params.set('start', config.startTime);
    params.set('end', config.endTime);
    params.set('precision', config.precision.toString());
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [config]);

  // Derived state for times
  const startTimeMs = new Date(config.startTime).getTime();
  const endTimeMs = new Date(config.endTime).getTime();
  const remainingMs = endTimeMs - now;
  const elapsedMs = now - startTimeMs;

  // Dynamic sizing logic for the main number
  // We estimate characters: 3 digits + 1 dot + precision
  const estimatedCharCount = 3 + (config.precision > 0 ? 1 + config.precision : 0);
  
  // Calculate a clamped VW/REM size. 
  // The constant (e.g., 85) is a heuristic for "how much width one char takes" relative to container
  // We use `cqw` (container query width) conceptually by limiting max width, but here we just use clamp with viewport units
  // adjusted for the fixed container max-width (1024px approx).
  const fontSizeBase = 15; // Base size in rem
  
  // Determine font size: larger precision = smaller font.
  // We clamp it so it doesn't get microscopic or infinitely huge.
  // Logic: Start big, subtract size for every extra decimal.
  const calculatedSize = Math.max(2, fontSizeBase - (estimatedCharCount * 0.55));

  return (
    <div className="min-h-screen w-full relative text-white font-sans selection:bg-acid selection:text-black overflow-x-hidden">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-[-1]" 
           style={{ 
             backgroundImage: `
                linear-gradient(to right, #18181b 1px, transparent 1px),
                linear-gradient(to bottom, #18181b 1px, transparent 1px)
             `,
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Scanline Effect */}
      <div className="scanline"></div>

      {/* Config Modal */}
      <ConfigPanel 
        config={config} 
        onChange={setConfig} 
        isOpen={isConfigOpen} 
        toggleOpen={() => setIsConfigOpen(!isConfigOpen)} 
      />

      {/* Main Layout */}
      <main className="container mx-auto px-4 min-h-screen flex flex-col justify-center py-12">
        
        {/* Header Marquee (Simulated) */}
        <div className="border-b-2 border-zinc-800 mb-12 pb-2 overflow-hidden">
            <div className="whitespace-nowrap text-zinc-600 font-mono text-xs animate-pulse">
                SYSTEM_READY // TRACKING_TEMPORAL_FLOW // PRECISION_MODE: {config.precision} // STATUS: {status} //
            </div>
        </div>

        {/* Centerpiece */}
        <div className="w-full mx-auto flex flex-col items-center">
          
          {/* Title & Info Header - Fixed Max Width */}
          <div className="w-full max-w-5xl mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-[0.8] tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 drop-shadow-[0_5px_0_rgba(0,0,0,1)] break-words">
                    {config.title.split('\n').map((line, i) => (
                       <React.Fragment key={i}>
                          {line}
                          {i < config.title.split('\n').length - 1 && <br />}
                       </React.Fragment>
                    ))}
                </h1>
            </div>
            <div className="bg-black border-2 border-zinc-800 p-4 flex gap-6 font-mono text-sm text-zinc-400 shadow-hard-rev shrink-0">
                <div>
                    <span className="block text-[10px] text-zinc-600 uppercase">Start Sequence</span>
                    <span className="text-white">{new Date(config.startTime).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                <div className="w-[1px] bg-zinc-800"></div>
                <div>
                    <span className="block text-[10px] text-zinc-600 uppercase">Target Sequence</span>
                    <span className="text-white">{new Date(config.endTime).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
            </div>
          </div>

          {/* Main Display Box - Fixed Width matching Header */}
          <div className="w-full max-w-5xl bg-black border-4 border-white p-6 md:p-12 relative shadow-[12px_12px_0px_0px_#ccff00] transition-all duration-300">
            
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-r-4 border-b-4 border-white bg-acid"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-l-4 border-b-4 border-white"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-r-4 border-t-4 border-white"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-l-4 border-t-4 border-white bg-neon-pink"></div>

            {/* Big Percent Display */}
            <div className="flex flex-col items-center justify-center py-8 w-full overflow-hidden">
               <div className="text-acid font-mono text-lg md:text-xl mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Zap className="w-5 h-5 animate-bounce" /> 
                 Percent_Complete
               </div>
               
               <div className="relative w-full text-center flex justify-center items-baseline">
                  
                  {/* Container for Number + Shadow ensuring they move together */}
                  <div className="relative group">
                      {/* Main Text (White) */}
                      <h2 
                        className="leading-none font-black tracking-tighter text-white select-all transition-all duration-300 whitespace-nowrap relative z-10"
                        style={{ fontSize: `min(18vw, ${calculatedSize}rem)` }}
                      >
                        <Ticker value={progress} precision={config.precision} />
                      </h2>

                      {/* Glitch/Shadow Text (Pink) - Locked to parent container with slight offset */}
                      <h2 
                        className="leading-none font-black tracking-tighter text-neon-pink absolute top-0 left-0 opacity-50 mix-blend-screen blur-[1px] select-none pointer-events-none whitespace-nowrap z-0"
                        style={{ 
                           fontSize: `min(18vw, ${calculatedSize}rem)`,
                           transform: 'translate(0.04em, 0.03em)' 
                        }}
                      >
                         <Ticker value={progress} precision={config.precision} />
                      </h2>
                  </div>

                  {/* Percent symbol aligned to baseline/bottom */}
                  <span className="text-[3vw] md:text-[2rem] text-zinc-600 ml-1 md:ml-4 font-bold self-end mb-2 md:mb-4">%</span>
                  
               </div>
            </div>

            <ProgressBar percent={progress} />

          </div>

          {/* Secondary Metrics - Matching Width */}
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
             
             <MetricCard 
                label="Time Remaining"
                value={remainingMs > 0 ? formatDuration(remainingMs) : "00:00:00"}
                color="border-neon-pink"
                textColor="text-neon-pink"
             />

             <MetricCard 
                label="Elapsed Time"
                value={elapsedMs > 0 ? formatDuration(elapsedMs) : "00:00:00"}
                color="border-acid"
                textColor="text-acid"
             />
             
             <MetricCard 
                label="System Status"
                value={status}
                color="border-white"
                textColor={status === 'COMPLETE' ? 'text-acid' : status === 'ACTIVE' ? 'text-white' : 'text-zinc-500'}
             />

          </div>
          
        </div>
      </main>
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-black border-t border-zinc-800 p-2 z-30">
        <div className="container mx-auto flex justify-between items-center font-mono text-[10px] text-zinc-600 uppercase">
             <span>CHRONO_CRUNCH_V1.0.6</span>
             <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Reality is loading...</span>
        </div>
      </footer>
    </div>
  );
}