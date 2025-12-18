
import React from 'react';
import { EnhancementConfig } from '../types';

interface EnhancementPanelProps {
  config: EnhancementConfig;
  onChange: (config: EnhancementConfig) => void;
}

export const EnhancementPanel: React.FC<EnhancementPanelProps> = ({ config, onChange }) => {
  const settings = [
    { id: 'upscale', label: '4K Super Resolution', icon: 'fa-expand', desc: 'Upscale from low to high resolution' },
    { id: 'removeArtifacts', label: 'Artifact Eraser', icon: 'fa-broom', desc: 'Remove AI noise and glitches' },
    { id: 'hyperrealism', label: 'Hyper-Realism Pass', icon: 'fa-microchip', desc: 'Enhance micro-textures and clarity' },
  ];

  return (
    <div className="space-y-3">
      <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2 block">Post-Process Enhancement</label>
      <div className="grid grid-cols-1 gap-2">
        {settings.map((s) => (
          <button
            key={s.id}
            onClick={() => onChange({ ...config, [s.id]: !config[s.id as keyof EnhancementConfig] })}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
              config[s.id as keyof EnhancementConfig] 
                ? "bg-indigo-600/20 border-indigo-500 text-indigo-300" 
                : "bg-black/40 border-white/5 text-gray-500 hover:border-white/10"
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config[s.id as keyof EnhancementConfig] ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
              <i className={`fa-solid ${s.icon} text-sm`}></i>
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold">{s.label}</div>
              <div className="text-[9px] opacity-60 uppercase tracking-tighter">{s.desc}</div>
            </div>
            {config[s.id as keyof EnhancementConfig] && <i className="fa-solid fa-check text-xs text-indigo-400"></i>}
          </button>
        ))}
      </div>
    </div>
  );
};
