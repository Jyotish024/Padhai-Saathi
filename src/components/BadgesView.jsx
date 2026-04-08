import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Award, 
  Gem, 
  Star, 
  Trophy, 
  Lock,
  CheckCircle2
} from 'lucide-react';

const badges = [
  { 
    id: 'iron', 
    name: 'Iron Warrior', 
    minLvl: 10, 
    icon: Shield, 
    color: 'bg-slate-400', 
    text: 'text-slate-600',
    description: 'You are just getting started on your adventure!'
  },
  { 
    id: 'bronze', 
    name: 'Bronze Hero', 
    minLvl: 30, 
    icon: Star, 
    color: 'bg-orange-400', 
    text: 'text-orange-600',
    description: 'A dedicated explorer with a heart of steel.'
  },
  { 
    id: 'silver', 
    name: 'Silver Sage', 
    minLvl: 50, 
    icon: Award, 
    color: 'bg-zinc-300', 
    text: 'text-zinc-500',
    description: 'Wisdom and skill are your constant companions.'
  },
  { 
    id: 'gold', 
    name: 'Golden Legend', 
    minLvl: 70, 
    icon: Trophy, 
    color: 'bg-amber-400', 
    text: 'text-amber-600',
    description: 'Few have reached these heights. Truly legendary.'
  },
  { 
    id: 'diamond', 
    name: 'Diamond Master', 
    minLvl: 100, 
    icon: Gem, 
    color: 'bg-cyan-400', 
    text: 'text-cyan-600',
    description: 'The pinnacle of achievement. You are a master!'
  }
];

export function BadgesView() {
  const { lvl } = useAppStore();

  return (
    <div className="flex-1 overflow-y-auto bg-white p-8 custom-scrollbar">
      <div className="max-w-5xl mx-auto mb-12">
        <h1 className="text-4xl font-black text-slate-800 mb-2">Hall of Fame</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Level {lvl} Explorer • Tracking your achievements
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {badges.map((badge) => {
          const isUnlocked = lvl >= badge.minLvl;
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.id}
              whileHover={isUnlocked ? { scale: 1.02, y: -5 } : {}}
              className={`relative flex flex-col items-center text-center p-8 rounded-[40px] border-2 transition-all duration-500 ${
                isUnlocked 
                ? 'bg-white border-slate-50 shadow-xl shadow-slate-100' 
                : 'bg-slate-50 border-dashed border-slate-200 opacity-60 grayscale'
              }`}
            >
              {/* Badge Icon Wrapper */}
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 relative ${
                isUnlocked ? badge.color : 'bg-slate-200'
              }`}>
                {isUnlocked ? (
                   <Icon className="w-16 h-16 text-white" />
                ) : (
                   <Lock className="w-12 h-12 text-slate-400" />
                )}
                
                {/* Unlocked Checkmark */}
                {isUnlocked && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-white shadow-lg">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Text Info */}
              <h3 className={`text-xl font-black mb-2 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                {badge.name}
              </h3>
              
              <p className={`text-sm font-bold mb-6 px-4 leading-relaxed ${isUnlocked ? 'text-slate-500' : 'text-slate-300'}`}>
                {isUnlocked ? badge.description : `Unlock this prestigious badge by reaching Level ${badge.minLvl}.`}
              </p>

              {/* Progress/Requirement Pill */}
              <div className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isUnlocked 
                ? `${badge.color} text-white` 
                : 'bg-slate-100 text-slate-400'
              }`}>
                {isUnlocked ? 'Unlocked!' : `Min Level ${badge.minLvl}`}
              </div>

              {/* Progress bar for locked badges */}
              {!isUnlocked && (
                <div className="w-full mt-6 px-4">
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-400" 
                      style={{ width: `${Math.min(100, (lvl / badge.minLvl) * 100)}%` }} 
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
