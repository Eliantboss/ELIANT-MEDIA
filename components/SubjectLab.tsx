
import React from 'react';
import { SubjectConfig, SubjectAngle } from '../types';

interface SubjectLabProps {
  config: SubjectConfig;
  onChange: (config: SubjectConfig) => void;
}

export const SubjectLab: React.FC<SubjectLabProps> = ({ config, onChange }) => {
  const angles: { label: string; value: SubjectAngle; desc: string }[] = [
    { label: "Classic", value: "Default", desc: "Natural pose" },
    { label: "Portrait", value: "Portrait", desc: "Tight headshot" },
    { label: "Heroic", value: "Low Angle", desc: "Powerful perspective" },
    { label: "Dramatic", value: "Side Profile", desc: "Moody silhouette" },
    { label: "Flattering", value: "Three-Quarter", desc: "Studio style" },
  ];

  const toggleSetting = (key: keyof Omit<SubjectConfig, 'angle'>) => {
    onChange({ ...config, [key]: !config[key] });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Perspective & Angle</label>
        <div className="grid grid-cols-2 gap-2">
          {angles.map((a) => (
            <button
              key={a.value}
              onClick={() => onChange({ ...config, angle: a.value })}
              className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                config.angle === a.value
                  ? "bg-rose-600/20 border-rose-500 text-rose-400"
                  : "bg-black/40 border-white/5 text-gray-500 hover:border-white/20"
              }`}
            >
              <span className="text-xs font-bold">{a.label}</span>
              <span className="text-[9px] opacity-60 leading-tight">{a.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Subject Refinement</label>
          <div className="space-y-2">
            {[
              { id: 'faceRefinement', label: 'Pro Face Alignment', icon: 'fa-face-smile' },
              { id: 'skinDetail', label: 'Hyper-Realistic Skin', icon: 'fa-microscope' },
              { id: 'lightingMatch', label: 'Dynamic Light Sync', icon: 'fa-sun' },
            ].map((setting) => (
              <button
                key={setting.id}
                // Fixed casting to ensure only boolean properties of SubjectConfig are used with toggleSetting
                onClick={() => toggleSetting(setting.id as keyof Omit<SubjectConfig, 'angle'>)}
                className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${
                  config[setting.id as keyof Omit<SubjectConfig, 'angle'>] ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-300" : "bg-black/20 border-white/5 text-gray-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i className={`fa-solid ${setting.icon} text-xs`}></i>
                  <span className="text-xs font-medium">{setting.label}</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${config[setting.id as keyof Omit<SubjectConfig, 'angle'>] ? 'bg-indigo-600' : 'bg-gray-800'}`}>
                  <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${config[setting.id as keyof Omit<SubjectConfig, 'angle'>] ? 'left-5' : 'left-1'}`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Environment & Integrity</label>
          <div className="space-y-2">
            <button
              onClick={() => toggleSetting('backgroundFidelity')}
              className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${
                config.backgroundFidelity ? "bg-amber-600/10 border-amber-500/50 text-amber-300" : "bg-black/20 border-white/5 text-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-mountain-sun text-xs"></i>
                <span className="text-xs font-medium">Master Background Quality</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${config.backgroundFidelity ? 'bg-amber-600' : 'bg-gray-800'}`}>
                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${config.backgroundFidelity ? 'left-5' : 'left-1'}`}></div>
              </div>
            </button>

            <button
              onClick={() => toggleSetting('sessionIntegrity')}
              className={`w-full flex justify-between items-center p-3 rounded-xl border transition-all ${
                config.sessionIntegrity ? "bg-emerald-600/10 border-emerald-500/50 text-emerald-300" : "bg-black/20 border-white/5 text-gray-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-shield-halved text-xs"></i>
                <span className="text-xs font-medium">Anti-Morph Layering</span>
              </div>
              <div className={`w-8 h-4 rounded-full relative transition-colors ${config.sessionIntegrity ? 'bg-emerald-600' : 'bg-gray-800'}`}>
                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${config.sessionIntegrity ? 'left-5' : 'left-1'}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
