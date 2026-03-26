import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            Q
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Quantum Budget Optimizer</h1>
            <p className="text-xs text-slate-500">AI-Powered Shopping Assistant</p>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          <p>v1.0.0</p>
        </div>
      </div>
    </header>
  );
};
