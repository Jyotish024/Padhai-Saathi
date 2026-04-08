import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArcadeView } from './ArcadeView';
import { GlobalChatView } from './GlobalChatView';
import { 
  BookOpen, 
  Dna, 
  Calculator, 
  Globe2, 
  Languages, 
  Music, 
  Gamepad2, 
  Trophy,
  Sparkles,
  ArrowRight,
  Flame,
  Star as StarIcon,
  BookType,
  Monitor,
  Bot,
  Terminal,
  Coins,
  ShoppingCart,
  Home
} from 'lucide-react';

const subjects = [
  { 
    id: 'Science', 
    name: 'Science', 
    icon: Dna, 
    color: 'bg-cyan-400', 
    textColor: 'text-cyan-600',
    xp: '15 Minutes',
    reward: '50 Stars'
  },
  { 
    id: 'Maths', 
    name: 'Maths', 
    icon: Calculator, 
    color: 'bg-amber-400', 
    textColor: 'text-amber-600',
    xp: '20 Minutes',
    reward: '80 Stars'
  },
  { 
    id: 'English', 
    name: 'English', 
    icon: Languages, 
    color: 'bg-rose-400', 
    textColor: 'text-rose-600',
    xp: '10 Minutes',
    reward: '30 Stars'
  },
  { 
    id: 'Social Science', 
    name: 'Social Science', 
    icon: Globe2, 
    color: 'bg-emerald-400', 
    textColor: 'text-emerald-600',
    xp: '15 Minutes',
    reward: '60 Stars'
  },
  {
    id: 'Hindi Part 1',
    name: 'Hindi Part 1',
    icon: BookType,
    color: 'bg-pink-400',
    textColor: 'text-pink-600',
    xp: '15 Minutes',
    reward: '50 Stars'
  },
  {
    id: 'Hindi Part 2',
    name: 'Hindi Part 2',
    icon: BookType,
    color: 'bg-pink-500',
    textColor: 'text-pink-700',
    xp: '15 Minutes',
    reward: '55 Stars'
  },
  {
    id: 'Information Technology',
    name: 'Information Technology',
    icon: Monitor,
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    xp: '20 Minutes',
    reward: '70 Stars'
  },
  {
    id: 'Artificial Intelligence',
    name: 'Artificial Intelligence',
    icon: Bot,
    color: 'bg-violet-500',
    textColor: 'text-violet-700',
    xp: '25 Minutes',
    reward: '90 Stars'
  },
  {
    id: 'Computer Applications',
    name: 'Computer Applications',
    icon: Terminal,
    color: 'bg-slate-700',
    textColor: 'text-slate-900',
    xp: '20 Minutes',
    reward: '70 Stars'
  },
  {
    id: 'Financial Literacy',
    name: 'Financial Literacy',
    icon: Coins,
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    xp: '15 Minutes',
    reward: '60 Stars'
  },
  {
    id: 'Retail',
    name: 'Retail',
    icon: ShoppingCart,
    color: 'bg-orange-400',
    textColor: 'text-orange-600',
    xp: '15 Minutes',
    reward: '50 Stars'
  },
  {
    id: 'Home Science',
    name: 'Home Science',
    icon: Home,
    color: 'bg-teal-400',
    textColor: 'text-teal-600',
    xp: '20 Minutes',
    reward: '65 Stars'
  }

];

export function HomeView() {
  const { setSubject, lvl, lastSeenSubject, lastSeenChapterId, lastSeenNumPages, completedPages, currentUserName } = useAppStore();
  const [activeTab, setActiveTab] = useState('Home');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString(undefined, {
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString(undefined, {
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      }));
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  // Calculate progress
  const donePages = completedPages[lastSeenSubject]?.[lastSeenChapterId]?.size || 0;
  const remaining = Math.max(0, lastSeenNumPages - donePages);
  const progressPercent = lastSeenNumPages > 0 ? (donePages / lastSeenNumPages) : 0;
  const userName = (currentUserName || '').trim() || 'Explorer';

  return (
    <div className="flex-1 overflow-hidden flex flex-col relative bg-white">
      <AnimatePresence mode="wait">
        
        {/* HOMEPAGE TAB */}
        {activeTab === 'Home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto w-full p-8 custom-scrollbar pb-32"
          >
            {/* Header section */}
            <div className="max-w-5xl mx-auto mb-12 flex justify-between items-start">
              <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tight text-slate-800">
                  Good morning, <br />
                  <span className="text-cyan-500">{userName}!</span>
                </h1>
                <p className="text-lg font-bold text-slate-400 max-w-lg mb-2">
                  You've reached level {lvl}! Today's mission is waiting in the enchanted forest.
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                   {currentTime}
                </div>
              </div>
              
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-[30px] overflow-hidden bg-slate-100 ring-4 ring-white shadow-xl hover:scale-105 transition-transform duration-300">
                   <img
                     src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}&backgroundColor=dcfce7`}
                     alt="Profile"
                     className="w-full h-full object-cover"
                   />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full border-4 border-white flex items-center justify-center text-white">
                  <Trophy className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Hero Card: Path to Treasure */}
            <div className="max-w-5xl mx-auto mb-12 relative overflow-hidden rounded-[40px] bg-emerald-50/50 p-10 border border-emerald-100 group">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest inline-block mb-2">
                      Last Seen Adventure
                    </div>
                    <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                      {lastSeenSubject} Exploration
                    </h2>
                    <p className="text-slate-500 font-bold max-w-sm leading-relaxed">
                      {lastSeenNumPages > 0 
                        ? remaining === 0 
                          ? "Journey Completed! You've successfully passed all the quizzes for this adventure! 🏆"
                          : `You are only ${remaining} page quizzes away from completing this adventure!` 
                        : "Start your first mission to begin the path to treasure!"}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSubject(lastSeenSubject)}
                    className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 group-hover:translate-x-2 duration-300"
                  >
                    Continue Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                {/* Animated Path Graphic */}
                <div className="w-full md:w-[350px] shrink-0 h-32 relative bg-white/40 backdrop-blur-sm rounded-[30px] border border-emerald-100/50 p-4 flex items-center justify-center overflow-hidden">
                  <svg viewBox="0 0 300 100" className="w-full h-full drop-shadow-sm">
                    {/* Background Path (Dashed) */}
                    <path 
                      d="M30,50 Q105,20 150,50 T270,50" 
                      fill="none" 
                      stroke="#d1fae5" 
                      strokeWidth="10" 
                      strokeLinecap="round"
                      strokeDasharray="1 16"
                    />
                    
                    {/* Progress Path (Solid, animated) */}
                    <motion.path 
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: progressPercent }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      d="M30,50 Q105,20 150,50 T270,50" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="10" 
                      strokeLinecap="round"
                    />

                    {/* Start Circle */}
                    <circle cx="30" cy="50" r="10" fill="#10b981" />
                    <text x="30" y="54" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">▶</text>
                    
                    {/* Finish Treasure Circle */}
                    <circle cx="270" cy="50" r="12" fill="white" stroke="#10b981" strokeWidth="4" />
                    <text x="270" y="55" textAnchor="middle" fill="#10b981" fontSize="14">★</text>
                    
                    {/* Explorer Pin */}
                    <motion.circle
                      initial={{ cx: 30 }}
                      animate={{ cx: 30 + (240 * progressPercent) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cy="50"
                      r="8" 
                      fill="#ec4899" 
                      stroke="white" 
                      strokeWidth="3"
                    />
                  </svg>
                  
                  {/* Percentage Badge */}
                  <div className="absolute bottom-2 right-4 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-white/80 px-2 py-1 rounded-lg border border-emerald-100">
                    {Math.round(progressPercent * 100)}% Done
                  </div>
                </div>
              </div>
              
              {/* Background blobs */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            </div>

            {/* Daily Stats Grid */}
            <div className="max-w-5xl mx-auto flex gap-6">
              <div className="flex-1 bg-amber-50 rounded-[32px] p-6 border border-amber-100 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-amber-400 mb-1">Daily Streak</h4>
                  <p className="text-2xl font-black text-amber-600">0 Days</p>
                </div>
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-200">
                  <Flame className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1 bg-cyan-50 rounded-[32px] p-6 border border-cyan-100 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-cyan-400 mb-1">Total Stars</h4>
                  <p className="text-2xl font-black text-cyan-600">0</p>
                </div>
                <div className="w-12 h-12 bg-cyan-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-200">
                  <StarIcon className="w-6 h-6 text-white fill-current" />
                </div>
              </div>
              
              <div className="flex-1 bg-indigo-50 rounded-[32px] p-6 border border-indigo-100 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-1">XP Earned Today</h4>
                  <p className="text-2xl font-black text-indigo-600">0</p>
                </div>
                <div className="w-12 h-12 bg-indigo-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Trophy className="w-6 h-6" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* LIBRARY TAB */}
        {activeTab === 'Library' && (
          <motion.div 
            key="library"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 overflow-y-auto w-full p-8 custom-scrollbar pb-32"
          >
            <div className="max-w-5xl mx-auto mb-10">
              <h1 className="text-5xl font-black tracking-tight text-slate-800 mb-2">
                Knowledge Library
              </h1>
              <p className="text-lg font-bold text-slate-400">
                Choose a subject module below to begin a new adventure.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {subjects.map((sub) => (
                  <motion.button
                    key={sub.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setSubject(sub.id)}
                    className="flex flex-col text-left overflow-hidden rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group"
                  >
                    <div className={`h-48 ${sub.color} relative overflow-hidden p-8 flex flex-col justify-end`}>
                      <sub.icon className="absolute top-8 right-8 w-24 h-24 text-white/20 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                      <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full self-start mb-4 text-[10px] font-black text-white uppercase tracking-wider">
                        Featured Lesson
                      </div>
                      <h4 className="text-3xl font-black text-white leading-tight">
                        {sub.name}
                      </h4>
                    </div>
                    
                    <div className="p-8 flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="px-6 py-3 bg-slate-50 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                          <p className="font-bold text-slate-700">{sub.xp}</p>
                        </div>
                        <div className="px-6 py-3 bg-slate-50 rounded-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reward</p>
                          <p className="font-bold text-slate-700">{sub.reward}</p>
                        </div>
                      </div>
                      
                      <div className={`w-12 h-12 rounded-2xl ${sub.color} flex items-center justify-center text-white shadow-lg`}>
                        <ArrowRight className="w-6 h-6" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ARCADE TAB */}
        {activeTab === 'Arcade' && (
          <motion.div 
            key="arcade"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex-1 w-full flex flex-col pb-24"
          >
            <ArcadeView />
          </motion.div>
        )}

        {/* GLOBAL TAB */}
        {activeTab === 'Global' && (
          <motion.div 
            key="global"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex-1 w-full flex flex-col pb-24 h-full"
          >
            <GlobalChatView />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Bottom Nav Mock (Floating) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-slate-200/50 p-2 rounded-full shadow-2xl z-50 flex gap-1">
        {[
          { icon: Sparkles, label: 'Home' },
          { icon: BookOpen, label: 'Library' },
          { icon: Gamepad2, label: 'Arcade' },
          { icon: Globe2, label: 'Global' }
        ].map((item, idx) => {
          const isActive = activeTab === item.label;
          return (
            <button 
              key={idx} 
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-black transition-all group ${isActive ? 'bg-cyan-50 text-cyan-500' : 'hover:bg-slate-50 text-slate-400 hover:text-slate-600'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[13px] tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
