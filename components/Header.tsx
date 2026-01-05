
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 md:px-8 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-cube text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Figurine Studio AI
          </h1>
        </div>
        <div className="hidden md:block text-slate-400 text-sm font-medium">
          Professional Collectible Generator
        </div>
      </div>
    </header>
  );
};

export default Header;
