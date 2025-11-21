import React from 'react';
import { TimeConfig } from '../types';
import { Button } from './Button';
import { Settings, Crosshair, Activity, Type } from 'lucide-react';

interface ConfigPanelProps {
  config: TimeConfig;
  onChange: (newConfig: TimeConfig) => void;
  isOpen: boolean;
  toggleOpen: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange, isOpen, toggleOpen }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...config,
      [name]: name === 'precision' ? parseInt(value, 10) : value,
    });
  };

  const setPreset = (type: 'minute' | 'hour' | 'day' | 'year') => {
    const now = new Date();
    const end = new Date();
    
    switch(type) {
      case 'minute': end.setMinutes(now.getMinutes() + 1); break;
      case 'hour': end.setHours(now.getHours() + 1); break;
      case 'day': end.setDate(now.getDate() + 1); break;
      case 'year': end.setFullYear(now.getFullYear() + 1); break;
    }

    // Format for datetime-local: YYYY-MM-DDTHH:mm
    const toLocalISO = (d: Date) => {
      const offset = d.getTimezoneOffset() * 60000;
      return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };

    onChange({
      ...config,
      startTime: toLocalISO(now),
      endTime: toLocalISO(end)
    });
  };

  if (!isOpen) {
    return (
      <button 
        onClick={toggleOpen}
        className="fixed top-4 right-4 z-40 bg-black border-2 border-acid text-acid p-2 hover:bg-acid hover:text-black shadow-hard-acid transition-all"
      >
        <Settings className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-zinc-900 border-4 border-acid shadow-[8px_8px_0px_0px_#ccff00] relative my-8">
        
        {/* Header */}
        <div className="bg-acid text-black p-4 flex justify-between items-center border-b-4 border-black sticky top-0 z-10">
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-2">
            <Crosshair className="w-6 h-6" /> SYSTEM_CONFIG
          </h2>
          <button onClick={toggleOpen} className="font-bold text-xl hover:underline">[CLOSE]</button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Inputs */}
          <div className="space-y-6">

            <div className="group">
              <label className="block text-white font-mono text-sm mb-2 uppercase tracking-widest flex items-center gap-2">
                <Type className="w-4 h-4" /> Operation Title
              </label>
              <textarea
                name="title"
                value={config.title}
                onChange={handleChange}
                rows={2}
                className="w-full bg-black border-2 border-zinc-700 text-white p-4 font-mono text-lg focus:outline-none focus:border-acid focus:shadow-[4px_4px_0px_0px_#ccff00] transition-all resize-y"
                placeholder="ENTER TITLE..."
              />
            </div>

            <div className="group">
              <label className="block text-acid font-mono text-sm mb-2 uppercase tracking-widest">Initiation Sequence [Start]</label>
              <input 
                type="datetime-local" 
                name="startTime"
                value={config.startTime}
                onChange={handleChange}
                className="w-full bg-black border-2 border-zinc-700 text-white p-4 font-mono text-lg focus:outline-none focus:border-acid focus:shadow-[4px_4px_0px_0px_#ccff00] transition-all"
              />
            </div>

            <div className="group">
              <label className="block text-neon-pink font-mono text-sm mb-2 uppercase tracking-widest">Terminus Sequence [End]</label>
              <input 
                type="datetime-local" 
                name="endTime"
                value={config.endTime}
                onChange={handleChange}
                className="w-full bg-black border-2 border-zinc-700 text-white p-4 font-mono text-lg focus:outline-none focus:border-neon-pink focus:shadow-[4px_4px_0px_0px_#ff00ff] transition-all"
              />
            </div>

            <div className="group">
              <label className="block text-white font-mono text-sm mb-2 uppercase tracking-widest flex justify-between">
                <span>Precision Index</span>
                <span className="text-acid font-bold">{config.precision} DECIMALS</span>
              </label>
              <input 
                type="range" 
                name="precision"
                min="0"
                max="14"
                value={config.precision}
                onChange={handleChange}
                className="w-full h-4 bg-zinc-800 rounded-none appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-acid [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="border-t-2 border-dashed border-zinc-700 pt-6">
            <p className="text-zinc-500 font-mono text-xs mb-4 uppercase">Quick Override Protocols</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Button onClick={() => setPreset('minute')} variant="outline" className="text-sm py-2">1 MIN</Button>
              <Button onClick={() => setPreset('hour')} variant="outline" className="text-sm py-2">1 HR</Button>
              <Button onClick={() => setPreset('day')} variant="outline" className="text-sm py-2">1 DAY</Button>
              <Button onClick={() => setPreset('year')} variant="outline" className="text-sm py-2">1 YR</Button>
            </div>
          </div>

          <Button onClick={toggleOpen} className="w-full flex justify-center items-center gap-2">
            <Activity className="w-5 h-5" /> 
            ENGAGE TRACKING
          </Button>
        </div>
        
        {/* Decorative corner */}
        <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-black border-l-2 border-t-2 border-acid"></div>
      </div>
    </div>
  );
};