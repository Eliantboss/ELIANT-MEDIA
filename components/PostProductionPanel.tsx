
import React from 'react';
import { RetouchConfig, ColorGrade } from '../types';

interface PostProductionPanelProps {
  config: RetouchConfig;
  onChange: (config: RetouchConfig) => void;
}

export const PostProductionPanel: React.FC<PostProductionPanelProps> = ({ config, onChange }) => {
  const grades: { label: string; value: ColorGrade; color: string }[] = [
    { label: "Natural", value: "Natural", color: "bg-gray-500" },
    { label: "Cinema", value: "Cinematic Teal & Orange", color: "bg-orange-500" },
    { label: "Vintage", value: "Vintage Film", color: "bg-sepia-500" },
    { label: "Noir", value: "Noir B&W", color: "bg-white" },
    { label: "Golden", value: "Warm Golden Hour", color: "bg-amber-400" },
    { label: "Cyber", value: "Cyberpunk", color: "bg-purple-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Cinematic Color Grade</label>
        <div className="grid grid-cols-3 gap-2">
          {grades.map((g) => (
            <button
              key={g.value}
              onClick={() => onChange({ ...config, grade: g.value })}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                config.grade === g.value
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
                  : "bg-black/40 border-white/5 text-gray-500 hover:border-white/20"
              }`}
            >
              <div className={`w-2 h-2 rounded-full mb-1 ${g.color} opacity-80 shadow-sm`}></div>
              <span className="text-[10px] font-bold">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Retouch Intensity</label>
          <select
            value={config.intensity}
            onChange={(e) => onChange({ ...config, intensity: e.target.value as any })}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          >
            <option value="Soft">Soft Retouch</option>
            <option value="Medium">Medium Retouch</option>
            <option value="High">High-Grade Edit</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Smart Controls</label>
          <div className="space-y-2">
            <button
              onClick={() => onChange({ ...config, backgroundHarmonization: !config.backgroundHarmonization })}
              className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-all text-[10px] font-bold ${
                config.backgroundHarmonization ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-400" : "bg-black/40 border-white/5 text-gray-500"
              }`}
            >
              <i className="fa-solid fa-wand-magic"></i>
              Auto-Blend to BG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
