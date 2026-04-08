import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PartyPopper } from 'lucide-react';

export function MajorTestPrompt() {
  const { showMajorTestPrompt, acceptMajorTest, currentChapterId, setShowMajorTestPrompt } = useAppStore();

  if (!showMajorTestPrompt) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl relative overflow-hidden"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 p-8 opacity-5 select-none pointer-events-none">
            <Sparkles className="w-32 h-32 text-cyan-500" />
          </div>

          <div className="text-center relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center text-cyan-500 mx-auto mb-8 shadow-inner">
              <PartyPopper className="w-10 h-10" />
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Trip Completed!</h3>
            
            <p className="text-slate-500 font-medium leading-relaxed mb-10">
              Since you have completed your trip, let's go through a major test! Are you ready to show what you've learned?
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => acceptMajorTest(currentChapterId)}
                className="w-full py-5 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-200 transition-all uppercase tracking-widest text-sm"
              >
                Let's Do It!
              </button>
              <button 
                onClick={() => setShowMajorTestPrompt(false)}
                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
