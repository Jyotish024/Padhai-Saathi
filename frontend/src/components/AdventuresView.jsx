import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { 
  Dna, 
  Calculator, 
  Globe2, 
  Languages, 
  Trophy,
  ArrowRight,
  Sparkles,
  BookType,
  Monitor,
  Bot,
  Terminal,
  Coins,
  ShoppingCart,
  Home
} from 'lucide-react';

const allSubjects = [
  { 
    id: 'Science', 
    name: 'Science', 
    icon: Dna, 
    color: 'bg-cyan-400', 
    xp: '15 Minutes',
    reward: '50 Stars'
  },
  { 
    id: 'Maths', 
    name: 'Maths', 
    icon: Calculator, 
    color: 'bg-amber-400', 
    xp: '20 Minutes',
    reward: '80 Stars'
  },
  { 
    id: 'English', 
    name: 'English', 
    icon: Languages, 
    color: 'bg-rose-400', 
    xp: '10 Minutes',
    reward: '30 Stars'
  },
  { 
    id: 'Social Science', 
    name: 'Social Science', 
    icon: Globe2, 
    color: 'bg-emerald-400', 
    xp: '15 Minutes',
    reward: '60 Stars'
  },
  {
    id: 'Hindi',
    name: 'Hindi',
    icon: BookType,
    color: 'bg-pink-400',
    xp: '15 Minutes',
    reward: '50 Stars'
  },
  {
    id: 'Information Technology',
    name: 'Information Technology',
    icon: Monitor,
    color: 'bg-blue-500',
    xp: '20 Minutes',
    reward: '70 Stars'
  },
  {
    id: 'Artificial Intelligence',
    name: 'Artificial Intelligence',
    icon: Bot,
    color: 'bg-violet-500',
    xp: '25 Minutes',
    reward: '90 Stars'
  },
  {
    id: 'Computer Applications',
    name: 'Computer Applications',
    icon: Terminal,
    color: 'bg-slate-700',
    xp: '20 Minutes',
    reward: '70 Stars'
  },
  {
    id: 'Financial Literacy',
    name: 'Financial Literacy',
    icon: Coins,
    color: 'bg-yellow-500',
    xp: '15 Minutes',
    reward: '60 Stars'
  },
  {
    id: 'Retail',
    name: 'Retail',
    icon: ShoppingCart,
    color: 'bg-orange-400',
    xp: '15 Minutes',
    reward: '50 Stars'
  },
  {
    id: 'Home Science',
    name: 'Home Science',
    icon: Home,
    color: 'bg-teal-400',
    xp: '20 Minutes',
    reward: '65 Stars'
  }
];

export function AdventuresView() {
  const { setSubject, setView, completedPages } = useAppStore();

  // Filter subjects based on whether they have ANY progress tracked in completedPages
  const ongoingSubjects = allSubjects.filter(sub => {
    const progress = completedPages[sub.id];
    return progress && Object.keys(progress).length > 0;
  });

  if (ongoingSubjects.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white p-8">
        <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center mb-8">
          <Sparkles className="w-32 h-32 text-slate-200" />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4 text-center">No Adventures Started Yet!</h2>
        <p className="text-slate-400 font-bold mb-8 text-center max-w-sm">
          Pick your first mission from the home screen to see it appear here.
        </p>
        <motion.button 
          onClick={() => setView('home')}
          className="px-8 py-4 bg-cyan-400 text-white font-black rounded-2xl shadow-lg shadow-cyan-400/20 hover:bg-cyan-500 transition-all"
        >
          Go to Home
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white p-8 custom-scrollbar">
      <div className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl font-black text-slate-800 mb-2">My Adventures</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Continuing {ongoingSubjects.length} journeys
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {ongoingSubjects.map((sub) => {
          // Calculate simple progress (e.g., how many chapters started)
          const chaptersStarted = Object.keys(completedPages[sub.id] || {}).length;
          
          return (
            <motion.button
              key={sub.id}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSubject(sub.id)}
              className="flex flex-col text-left overflow-hidden rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group"
            >
              <div className={`h-40 ${sub.color} relative overflow-hidden p-8 flex flex-col justify-end`}>
                <sub.icon className="absolute top-6 right-6 w-20 h-20 text-white/20 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
                <h4 className="text-3xl font-black text-white leading-tight">
                  {sub.name}
                </h4>
              </div>
              
              <div className="p-8 flex items-center justify-between bg-white">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-bold text-slate-700">Ongoing Adventure • {chaptersStarted} {chaptersStarted === 1 ? 'Chapter' : 'Chapters'}</p>
                </div>
                
                <div className={`w-12 h-12 rounded-2xl ${sub.color} flex items-center justify-center text-white shadow-lg`}>
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>

              {/* Progress bar mock */}
              <div className="px-8 pb-8">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${sub.color} opacity-80`} 
                    style={{ width: `${Math.min(100, chaptersStarted * 10)}%` }} 
                  />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
