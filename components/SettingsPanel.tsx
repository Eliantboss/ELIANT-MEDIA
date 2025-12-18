
import React from 'react';
import { AspectRatio, ImageSize } from '../types';

interface SettingsPanelProps {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onImageSizeChange: (size: ImageSize) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  aspectRatio,
  imageSize,
  onAspectRatioChange,
  onImageSizeChange,
}) => {
  const ratios: { label: string; value: AspectRatio; icon: string }[] = [
    { label: "1:1", value: "1:1", icon: "fa-square" },
    { label: "3:4", value: "3:4", icon: "fa-rectangle-portrait" },
    { label: "4:3", value: "4:3", icon: "fa-rectangle-landscape" },
    { label: "9:16", value: "9:16", icon: "fa-mobile-screen" },
    { label: "16:9", value: "16:9", icon: "fa-tv" },
  ];

  const qualities: { label: string; value: ImageSize; desc: string }[] = [
    { label: "1K", value: "1K", desc: "Standard" },
    { label: "2K", value: "2K", desc: "High Definition" },
    { label: "4K", value: "4K", desc: "Ultra HD" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Frame Aspect Ratio</label>
        <div className="grid grid-cols-5 gap-2">
          {ratios.map((r) => (
            <button
              key={r.value}
              onClick={() => onAspectRatioChange(r.value)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                aspectRatio === r.value
                  ? "bg-rose-600/20 border-rose-500 text-rose-400"
                  : "bg-black/40 border-white/5 text-gray-500 hover:border-white/20"
              }`}
            >
              <i className={`fa-solid ${r.icon} text-lg mb-1`}></i>
              <span className="text-[10px] font-bold">{r.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 block">Output Quality</label>
        <div className="grid grid-cols-3 gap-3">
          {qualities.map((q) => (
            <button
              key={q.value}
              onClick={() => onImageSizeChange(q.value)}
              className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                imageSize === q.value
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
                  : "bg-black/40 border-white/5 text-gray-500 hover:border-white/20"
              }`}
            >
              <span className="text-sm font-black">{q.value}</span>
              <span className="text-[8px] uppercase tracking-tighter opacity-60 font-medium">{q.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
