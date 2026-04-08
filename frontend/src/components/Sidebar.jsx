import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { FlaskConical, Rocket, Compass, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { CHAPTER_TITLES } from '../lib/constants';

export function Sidebar() {
  const { chapters, currentChapterId, currentPageNum, setChapter, initChapters, fetchQuiz, xp, lvl, xpToNextLevel } = useAppStore();

  useEffect(() => {
    initChapters();
  }, [initChapters]);

  const progress = Math.min((xp / xpToNextLevel) * 100, 100);

  const icons = [Wand2, Rocket, Compass, Sparkles];

  // Format chapter ID for display (e.g., "Chapter 1" -> "Chapter 01")
  const formatChapterDisplay = (id) => {
    if (!id) return "Chapter 00";
    const num = id.match(/\d+/);
    return num ? `Chapter ${num[0].padStart(2, '0')}` : id;
  };

  const currentTitle = CHAPTER_TITLES[currentChapterId] || "Learning Module";
  const isMajorTestAvailable = useAppStore(state => state.acceptedPrompts.has(currentChapterId));
  const setShowMajorTestModal = useAppStore(state => state.setShowMajorTestModal);

  return (
    <div className="w-[280px] h-full bg-white border-r border-slate-100 flex flex-col shrink-0 relative z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-6 pb-2">
        
        {/* Chapter Header Card */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-400 shrink-0">
            <FlaskConical className="w-6 h-6 fill-cyan-400/20" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest leading-none mb-1">
              {formatChapterDisplay(currentChapterId)}
            </p>
            <p className="text-sm font-bold text-slate-800 leading-tight">
              {currentTitle}
            </p>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mb-10">
          <div className="h-2.5 w-full bg-green-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-green-400 rounded-full shadow-sm transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold">
            <span className="text-slate-500">{xp.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP</span>
            <span className="text-green-400 uppercase tracking-wider">LEVEL {lvl}</span>
          </div>
        </div>

        {/* Missions (Chapters) */}
        <div className="space-y-1 mb-8">
          <p className="text-[10px] font-bold text-slate-400 px-2 mb-4 uppercase tracking-widest">
            Today's Missions
          </p>
          <div className="space-y-3 overflow-y-auto max-h-[35vh] custom-scrollbar pr-2 pb-4 pt-1">
            {Object.keys(chapters).map((chapterName, idx) => {
              const Icon = icons[idx % icons.length];
              const isActive = currentChapterId === chapterName;
              return (
                <button
                  key={chapterName}
                  onClick={() => setChapter(chapterName)}
                  className={cn(
                    "w-full text-left px-4 py-3.5 rounded-[20px] text-[13px] font-bold transition-all flex items-center gap-4 group",
                    isActive
                      ? "bg-white text-cyan-500 shadow-[0_4px_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-cyan-400" : "text-slate-500")} />
                  <span className="truncate tracking-wide">{chapterName}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      <div className="mt-auto p-6 relative">
        <button 
          onClick={() => isMajorTestAvailable ? setShowMajorTestModal(true) : fetchQuiz(currentChapterId, currentPageNum)}
          className={cn(
            "w-full relative group cursor-pointer rounded-[24px] p-4 flex items-center gap-3 transition-all active:scale-[0.98]",
            isMajorTestAvailable 
              ? "bg-gradient-to-br from-amber-400 to-orange-500 border-none shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(245,158,11,0.5)] scale-[1.05]" 
              : "bg-cyan-50 border border-cyan-100/50 hover:scale-[1.02]"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg",
            isMajorTestAvailable ? "bg-white" : "bg-slate-900"
          )}>
             {isMajorTestAvailable ? (
               <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
             ) : (
               <div className="w-6 h-6 border-2 border-white rounded opacity-80" />
             )}
          </div>
          <div className="flex flex-col items-start justify-center">
            <span className={cn(
              "text-xs font-black uppercase tracking-tight",
              isMajorTestAvailable ? "text-white" : "text-cyan-500"
            )}>
              {isMajorTestAvailable ? "Sparky Major Test" : "Sparky generate quiz"}
            </span>
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-wider",
              isMajorTestAvailable ? "text-white/80" : "text-slate-400"
            )}>
              {isMajorTestAvailable ? "Chapter Final Exam" : "Click to test yourself!"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
