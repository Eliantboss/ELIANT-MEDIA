
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-rose-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
          <i className="fa-solid fa-film text-white"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            VIVID MOMENTS
          </h1>
          <p className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">Cinematic AI Studio</p>
        </div>
      </div>
      
      <div className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
        <span className="hover:text-white cursor-pointer transition-colors">Portraits</span>
        <span className="hover:text-white cursor-pointer transition-colors">Backgrounds</span>
        <span className="hover:text-white cursor-pointer transition-colors">Retouching</span>
      </div>
    </header>
  );
};
