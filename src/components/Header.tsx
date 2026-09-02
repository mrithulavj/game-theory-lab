import React from 'react';
import { RotateCcw, Sparkles, Bot } from 'lucide-react';

interface HeaderProps {
  onQuickPreset: (preset: 'tft-vs-random' | 'gemini-vs-tft' | 'tft-vs-tft' | 'angel-vs-devil') => void;
  onReset: () => void;
  isSimulating: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onQuickPreset, onReset, isSimulating }) => {
  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-serif text-neutral-900 tracking-tight font-normal">
              AI Game Theory Laboratory
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold text-orange-600 bg-orange-50 border border-orange-200 rounded uppercase tracking-wider">
              Gemini AI Enabled
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5 tracking-normal">
            Iterated Prisoner’s Dilemma dynamics & Gemini LLM agent simulation
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center flex-wrap gap-2">
          <span className="text-xs font-medium text-neutral-400 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-orange-600" /> Presets:
          </span>

          <button
            onClick={() => onQuickPreset('gemini-vs-tft')}
            disabled={isSimulating}
            className="px-3 py-1.5 text-xs font-semibold bg-orange-50 hover:bg-orange-100 text-orange-700 rounded border border-orange-300 transition disabled:opacity-50 flex items-center gap-1"
          >
            <Bot className="w-3.5 h-3.5" /> Gemini vs Tit-for-Tat
          </button>
          
          <button
            onClick={() => onQuickPreset('tft-vs-random')}
            disabled={isSimulating}
            className="px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded border border-neutral-200 transition disabled:opacity-50"
          >
            Tit-for-Tat vs Random
          </button>
          
          <button
            onClick={() => onQuickPreset('tft-vs-tft')}
            disabled={isSimulating}
            className="px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded border border-neutral-200 transition disabled:opacity-50"
          >
            TFT vs TFT
          </button>

          <button
            onClick={onReset}
            className="ml-2 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded border border-neutral-200 transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
    </header>
  );
};
