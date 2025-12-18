
import React from 'react';

interface PromptInputProps {
  value: string;
  onChange: (val: string) => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-48 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all placeholder:text-gray-600"
        placeholder="Describe the cinematic scene in detail..."
      />
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">A.I. Guidance System</span>
        <button 
          onClick={() => onChange("")}
          className="text-[10px] text-rose-500 hover:text-rose-400 uppercase font-bold transition-colors"
        >
          Clear Prompt
        </button>
      </div>
    </div>
  );
};
