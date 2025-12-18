
import React from 'react';
import { AppStatus, GenerationResult } from '../types';

interface ResultViewProps {
  status: AppStatus;
  result: GenerationResult | null;
  onReset: () => void;
  onUseAsReference: () => void;
  onEnhance: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ status, result, onReset, onUseAsReference, onEnhance }) => {
  if (status === AppStatus.IDLE) {
    return (
      <div className="w-full aspect-[4/5] rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-8 bg-white/[0.01]">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <i className="fa-solid fa-palette text-gray-600 text-2xl"></i>
        </div>
        <h3 className="text-gray-400 font-semibold">Ready for Creation</h3>
        <p className="text-gray-600 text-sm mt-2 max-w-xs">Provide subject and optional background references to begin your cinematic journey.</p>
      </div>
    );
  }

  if (status === AppStatus.GENERATING || status === AppStatus.UPSCALING) {
    return (
      <div className="w-full aspect-[4/5] rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center p-8 bg-black/50 overflow-hidden relative">
        <div className="absolute inset-0 shimmer opacity-50"></div>
        <div className="relative z-10">
          <div className="relative mb-6 mx-auto w-20 h-20">
            <div className={`w-20 h-20 rounded-full border-2 ${status === AppStatus.UPSCALING ? 'border-amber-500/30 border-t-amber-500' : 'border-indigo-500/30 border-t-indigo-500'} animate-spin`}></div>
            <i className={`fa-solid ${status === AppStatus.UPSCALING ? 'fa-arrow-up-right-dots' : 'fa-wand-magic-sparkles'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${status === AppStatus.UPSCALING ? 'text-amber-400' : 'text-indigo-400'} text-2xl animate-pulse`}></i>
          </div>
          <h3 className="text-white text-xl font-bold mb-2 uppercase tracking-tight">
            {status === AppStatus.UPSCALING ? 'Enhancing Resolution...' : 'Developing Masterpiece...'}
          </h3>
          <div className="space-y-2 text-indigo-400 text-xs font-medium uppercase tracking-widest">
            {status === AppStatus.UPSCALING ? (
              <>
                <p className="animate-pulse">Cleaning AI Artifacts</p>
                <p className="animate-pulse text-amber-400" style={{animationDelay: '0.2s'}}>Interpolating Detail</p>
                <p className="animate-pulse text-amber-500" style={{animationDelay: '0.4s'}}>Hyper-Realistic Pass</p>
              </>
            ) : (
              <>
                <p className="animate-pulse">Matching Subject Geometry</p>
                <p className="animate-pulse" style={{animationDelay: '0.2s'}}>Injecting Environment Data</p>
                <p className="animate-pulse" style={{animationDelay: '0.4s'}}>Finalizing Cinematic Bloom</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (status === AppStatus.SUCCESS && result) {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="glass-panel p-2 rounded-2xl overflow-hidden shadow-2xl shadow-black relative group">
          <img 
            src={result.imageUrl} 
            alt="AI Generated Cinematic Scene" 
            className="w-full h-auto rounded-xl border border-white/10 transition-transform duration-700 group-hover:scale-[1.01]"
          />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button 
               onClick={() => {
                const link = document.createElement('a');
                link.href = result.imageUrl;
                link.download = `cinematic-vivid-${Date.now()}.png`;
                link.click();
              }}
              className="bg-black/60 backdrop-blur-md text-white px-3 py-2 rounded-lg text-[10px] font-bold flex items-center gap-2 border border-white/10 hover:bg-black/80 transition-all"
            >
              <i className="fa-solid fa-download"></i>
              DOWNLOAD
            </button>
            <button 
              onClick={onEnhance}
              className="bg-amber-600/80 backdrop-blur-md text-white px-3 py-2 rounded-lg text-[10px] font-bold flex items-center gap-2 border border-amber-500/30 hover:bg-amber-500 transition-all shadow-lg"
            >
              <i className="fa-solid fa-wand-sparkles"></i>
              ENHANCE 4K
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onUseAsReference}
            className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <i className="fa-solid fa-clone"></i>
            Use as Reference
          </button>
          <button 
            onClick={onReset}
            className="bg-rose-600/10 text-rose-400 border border-rose-500/30 hover:bg-rose-600/20 py-3 rounded-xl font-bold transition-all"
          >
            Reset Workspace
          </button>
        </div>

        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl flex items-center gap-4">
           <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center shrink-0">
             <i className="fa-solid fa-lightbulb text-indigo-400"></i>
           </div>
           <div>
             <h4 className="text-sm font-bold text-indigo-200">Creative Variation</h4>
             <p className="text-xs text-indigo-300/60 leading-relaxed">Click "Use as Reference" to generate a similar scene with new creative adjustments.</p>
           </div>
        </div>

        {result.textResponse && (
          <div className="glass-panel p-4 rounded-xl text-[10px] text-gray-500 italic border-l-2 border-amber-500/40">
            <p className="font-bold text-gray-400 uppercase mb-1 tracking-wider flex items-center gap-1">
              <i className="fa-solid fa-robot"></i>
              AI Composition Notes
            </p>
            {result.textResponse}
          </div>
        )}
      </div>
    );
  }

  if (status === AppStatus.ERROR) {
    return (
      <div className="w-full aspect-[4/5] rounded-2xl border border-rose-500/30 flex flex-col items-center justify-center text-center p-8 bg-rose-950/20">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-4">
          <i className="fa-solid fa-circle-exclamation text-rose-500 text-3xl"></i>
        </div>
        <h3 className="text-rose-200 font-bold text-lg">Process Interrupted</h3>
        <p className="text-rose-300/70 text-sm mt-2">The engine couldn't harmonize the references. Try using higher quality reference photos.</p>
        <button 
          onClick={onReset}
          className="mt-6 px-8 py-3 bg-rose-600 rounded-xl text-white font-bold text-sm shadow-lg shadow-rose-900/40 hover:bg-rose-500 transition-all"
        >
          Reset and Retry
        </button>
      </div>
    );
  }

  return null;
};
