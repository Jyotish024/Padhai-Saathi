import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Award, Gem, Star, Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import pkg from '../../package.json';

const badges = [
  {
    id: 'iron',
    name: 'Iron Warrior',
    minLvl: 10,
    icon: Shield,
    color: 'bg-slate-400',
    description: 'You are just getting started on your adventure!'
  },
  {
    id: 'bronze',
    name: 'Bronze Hero',
    minLvl: 30,
    icon: Star,
    color: 'bg-orange-400',
    description: 'A dedicated explorer with a heart of steel.'
  },
  {
    id: 'silver',
    name: 'Silver Sage',
    minLvl: 50,
    icon: Award,
    color: 'bg-zinc-300',
    description: 'Wisdom and skill are your constant companions.'
  },
  {
    id: 'gold',
    name: 'Golden Legend',
    minLvl: 70,
    icon: Trophy,
    color: 'bg-amber-400',
    description: 'Few have reached these heights. Truly legendary.'
  },
  {
    id: 'diamond',
    name: 'Diamond Master',
    minLvl: 100,
    icon: Gem,
    color: 'bg-cyan-400',
    description: 'The pinnacle of achievement. You are a master!'
  }
];

export default function About() {
  const navigate = useNavigate();
  const { currentUserName, selectedClass, currentSubject, lvl, xp, xpToNextLevel } = useAppStore();

  const userName = (currentUserName || '').trim() || 'Explorer';
  const xpPercent = Math.min(100, (xp / xpToNextLevel) * 100);
  const appName = 'StudentHelper';
  const appVersion = pkg?.version || 'unknown';

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col overflow-hidden font-sans selection:bg-cyan-500/30">
      <div className="w-full px-10 py-6 flex items-center justify-between bg-white border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app')}
            className="w-11 h-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight">About</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">
              App Info • Profile • Level • Badges
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[18px] overflow-hidden ring-2 ring-slate-100 shadow-sm bg-slate-100">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}&backgroundColor=dcfce7`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* App details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-[34px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">{appName}</h2>
                  <p className="text-sm font-semibold text-slate-500 mt-2 max-w-3xl">
                    {appName} is an AI-powered learning companion for school students. It combines chapter-based study,
                    page explanations, quizzes, global chat, and gamified progress to make daily learning structured and fun.
                  </p>
                </div>
                <div className="px-4 py-2 rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-black uppercase tracking-widest">
                  Version {appVersion}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Application Name</p>
                  <p className="text-sm font-black text-slate-800 mt-1">{appName}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Version</p>
                  <p className="text-sm font-black text-slate-800 mt-1">{appVersion}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Frontend Stack</p>
                  <p className="text-sm font-black text-slate-800 mt-1">React + Vite + Tailwind</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Backend Stack</p>
                  <p className="text-sm font-black text-slate-800 mt-1">FastAPI + WebSockets + Groq</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-100 p-5">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">What this app includes</p>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-semibold text-slate-600">
                  <p>• Class and subject-wise chapter library</p>
                  <p>• AI explanations per page</p>
                  <p>• Auto-generated practice quizzes</p>
                  <p>• Global student chat room</p>
                  <p>• XP, levels, and badge rewards</p>
                  <p>• Audio readout of generated responses</p>
                </div>
              </div>
            </div>
          </div>

          {/* User details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[34px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[24px] overflow-hidden bg-slate-100 ring-4 ring-white shadow-md">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}&backgroundColor=dcfce7`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xl font-black tracking-tight">{userName}</div>
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {selectedClass} • {currentSubject}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-end justify-between">
                  <div className="text-sm font-black text-slate-800">Level {lvl}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-500">
                    {Math.max(0, xpToNextLevel - xp).toLocaleString()} to next
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs font-bold text-slate-500">{xp.toLocaleString()} XP</div>
                  <div className="text-xs font-bold text-slate-400">{xpToNextLevel.toLocaleString()} XP limit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[34px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Badges</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                    Unlocked based on your level
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {badges.map((badge) => {
                  const isUnlocked = lvl >= badge.minLvl;
                  const Icon = badge.icon;
                  return (
                    <motion.div
                      key={badge.id}
                      whileHover={isUnlocked ? { scale: 1.01, y: -2 } : {}}
                      className={`
                        relative flex items-center gap-4 p-5 rounded-[26px] border transition-all
                        ${isUnlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-dashed border-slate-200 opacity-70'}
                      `}
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isUnlocked ? badge.color : 'bg-slate-200'}`}>
                        {isUnlocked ? <Icon className="w-7 h-7 text-white" /> : <Lock className="w-6 h-6 text-slate-400" />}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-black ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>{badge.name}</div>
                        <div className={`text-xs font-bold mt-1 ${isUnlocked ? 'text-slate-500' : 'text-slate-400'}`}>
                          {isUnlocked ? badge.description : `Reach Level ${badge.minLvl} to unlock.`}
                        </div>
                      </div>
                      {isUnlocked && (
                        <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-md">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

