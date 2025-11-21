import React, { useState, useEffect, useRef } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { ProgressBar } from './components/ProgressBar';
import { Ticker } from './components/Ticker';
import { INITIAL_CONFIG } from './constants';
import { TimeConfig } from './types';
import { AlertTriangle, Zap } from 'lucide-react';

// Helper to calculate progress
const calculateProgress = (start: number, end: number) => {
  const now = Date.now();
  if (now < start) return { percent: 0, status: 'PENDING' };
  if (now > end) return { percent: 100, status: 'COMPLETE' };
  const total = end - start;
  const elapsed = now - start;
  return { percent: (elapsed / total) * 100, status: 'ACTIVE' };
};

// Helper format time remaining
const formatDuration = (ms: number) => {
  if (ms <= 0) return "00:00:00";
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};

export default function App() {
  const [config, setConfig] = useState<TimeConfig>(INITIAL_CONFIG);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('PENDING');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const requestRef = useRef<number | null>(null);
  const [now, setNow] = useState(Date.now());

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

  // Derived state for times
  const startTimeMs = new Date(config.startTime).getTime();
  const endTimeMs = new Date(config.endTime).getTime();
  const totalDuration = endTimeMs - startTimeMs;
  const remainingMs = endTimeMs - now;
  const elapsedMs = now - startTimeMs;

  // Dynamic sizing logic
  // Base chars = 3 (e.g. "100") + 1 (.) + precision
  const estimatedCharCount = 4 + config.precision;
  // Scale vw inversely to character count to ensure containment within viewport width
  // 70vw is a safe usable width, divided by char count gives vw per char
  const dynamicFontSizeVw = Math.min(12, 75 / estimatedCharCount); 

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
        <div className="w-full mx-auto">
          
          {/* Title Block */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4 max-w-5xl mx-auto">
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
            <div className="bg-black border-2 border-zinc-800 p-4 flex gap-6 font-mono text-sm text-zinc-400 shadow-hard-rev">
                <div>
                    <span className="block text-[10px] text-zinc-600 uppercase">Start Sequence</span>
                    <span className="text-white">{new Date(config.startTime).toLocaleString()}</span>
                </div>
                <div className="w-[1px] bg-zinc-800"></div>
                <div>
                    <span className="block text-[10px] text-zinc-600 uppercase">Target Sequence</span>
                    <span className="text-white">{new Date(config.endTime).toLocaleString()}</span>
                </div>
            </div>
          </div>

          {/* Main Display Box - Responsive Width Container */}
          {/* 
             Updated to w-fit mx-auto to hug content.
             Added min-w to ensure it doesn't look too thin on short numbers.
          */}
          <div className="bg-black border-4 border-white p-6 md:p-12 relative shadow-[12px_12px_0px_0px_#ccff00] w-fit min-w-[320px] max-w-full mx-auto transition-all duration-300">
            
            {/* Corner Decorations */}
            <div className="absolute top-0 left-0 w-8 h-8 border-r-4 border-b-4 border-white bg-acid"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-l-4 border-b-4 border-white"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-r-4 border-t-4 border-white"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-l-4 border-t-4 border-white bg-neon-pink"></div>

            {/* Big Percent */}
            <div className="flex flex-col items-center justify-center py-8">
               <div className="text-acid font-mono text-lg md:text-xl mb-2 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Zap className="w-5 h-5 animate-bounce" /> 
                 Percent_Complete
               </div>
               
               <div className="relative">
                  {/* 
                    Dynamic font size applied here. 
                    Using style prop to directly manipulate based on precision calculations 
                  */}
                  <h2 
                    className="leading-none font-black tracking-tighter text-white select-all transition-all duration-300"
                    style={{ fontSize: `${dynamicFontSizeVw}vw` }}
                  >
                    <Ticker value={progress} precision={config.precision} />
                    <span className="text-[0.4em] text-zinc-600 ml-2 align-top">%</span>
                  </h2>
                  
                  {/* Glitch Copy underneath */}
                  <h2 
                    className="leading-none font-black tracking-tighter text-neon-pink absolute top-0 left-0 opacity-30 mix-blend-screen blur-[2px] animate-pulse select-none pointer-events-none translate-x-[2px] transition-all duration-300"
                    style={{ fontSize: `${dynamicFontSizeVw}vw` }}
                  >
                     <Ticker value={progress} precision={config.precision} />
                     <span className="text-[0.4em] text-zinc-600 ml-2 align-top">%</span>
                  </h2>
               </div>
            </div>

            <ProgressBar percent={progress} />

          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
             
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
      
      <footer className="fixed bottom-0 left-0 w-full bg-black border-t border-zinc-800 p-2 z-30">
        <div className="container mx-auto flex justify-between items-center font-mono text-[10px] text-zinc-600 uppercase">
             <span>CHRONO_CRUNCH_V1.0.5</span>
             <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Reality is loading...</span>
        </div>
      </footer>
    </div>
  );
}

// Helper Component for small cards
const MetricCard = ({ label, value, color, textColor }: { label: string, value: string, color: string, textColor: string }) => (
  <div className={`bg-zinc-950 border-2 ${color} p-4 shadow-[4px_4px_0px_0px_#222] hover:translate-y-[-2px] transition-transform`}>
    <div className="text-zinc-500 font-mono text-xs uppercase mb-1 tracking-widest border-b border-zinc-800 pb-1">{label}</div>
    <div className={`text-2xl md:text-3xl font-bold ${textColor} truncate font-mono`}>{value}</div>
  </div>
);