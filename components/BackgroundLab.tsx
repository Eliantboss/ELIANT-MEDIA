
import React from 'react';
import { BackgroundConfig } from '../types';

interface BackgroundLabProps {
  config: BackgroundConfig;
  onChange: (config: BackgroundConfig) => void;
}

export const BackgroundLab: React.FC<BackgroundLabProps> = ({ config, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 block">Environment Extraction</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          onClick={() => onChange({ ...config, removeBackground: !config.removeBackground, neutralizeBackground: false })}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
            config.removeBackground 
              ? "bg-rose-600/20 border-rose-500 text-rose-300" 
              : "bg-black/40 border-white/5 text-gray-500 hover:border-white/10"
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.removeBackground ? 'bg-rose-500/20' : 'bg-white/5'}`}>
            <i className="fa-solid fa-scissors text-xs"></i>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold">Studio Cutout</div>
            <div className="text-[8px] opacity-60 uppercase">Full BG Removal</div>
          </div>
        </button>

        <button
          onClick={() => onChange({ ...config, neutralizeBackground: !config.neutralizeBackground, removeBackground: false })}
          className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
            config.neutralizeBackground 
              ? "bg-emerald-600/20 border-emerald-500 text-emerald-300" 
              : "bg-black/40 border-white/5 text-gray-500 hover:border-white/10"
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.neutralizeBackground ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
            <i className="fa-solid fa-ghost text-xs"></i>
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold">Neutralizer</div>
            <div className="text-[8px] opacity-60 uppercase">Simplified Backdrop</div>
          </div>
        </button>
      </div>
      {(config.removeBackground || config.neutralizeBackground) && (
        <p className="text-[9px] text-amber-500/70 italic px-1">
          <i className="fa-solid fa-circle-info mr-1"></i>
          Note: Extraction settings override custom scene narratives.
        </p>
      )}
    </div>
  );
};
