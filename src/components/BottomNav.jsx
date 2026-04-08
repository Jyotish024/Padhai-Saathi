import React from 'react';
import { ArrowLeft, Pause, Bot, Archive, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export function BottomNav() {
  const toggleExplanation = useAppStore(state => state.toggleExplanation);
  return (
    <div className="h-20 w-full bg-[#0A0F1A] border-t border-[#1E293B]/60 flex items-center justify-between px-16 relative shrink-0 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.3)]">
      
      {/* Left items */}
      <div className="flex items-center gap-12">
        <button className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Back</span>
        </button>

      </div>

      {/* Center AI Tutor Button - Integrated Inside */}
      <div className="px-2">
        <button 
          onClick={toggleExplanation}
          className="flex flex-col items-center group transition-all"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)] group-hover:scale-105 group-hover:shadow-[0_8px_24px_rgba(59,130,246,0.5)] transition-all">
            <Bot className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400 mt-1 group-hover:text-blue-300 transition-colors">AI Tutor</span>
        </button>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-12">
        <button className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-colors">
          <Archive className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Resources</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-colors group">
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold tracking-widest uppercase">Next</span>
        </button>
      </div>

    </div>
  );
}
