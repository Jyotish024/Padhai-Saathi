import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Zap, ChevronDown, User, Info, LogOut } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function TopNav() {
  const navigate = useNavigate();
  const { xp, currentView, setView, lvl, xpToNextLevel, currentUserName, setCurrentUserName } = useAppStore();
  const [showXp, setShowXp] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const xpPercent = Math.min(100, (xp / xpToNextLevel) * 100);
  const userName = (currentUserName || '').trim() || 'Explorer';
  
  return (
    <div className="w-full h-20 px-10 flex items-center justify-between bg-white border-b border-slate-100 shrink-0 z-30 shadow-sm">
      
      {/* Brand */}
      <div className="flex items-center">
        <h1 className="text-[22px] font-black tracking-tight text-cyan-400">
          Padhai Sathi
        </h1>
      </div>

      {/* Center Tabs */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setView('home')}
          className={cn(
            "px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors",
            currentView === 'home' ? "bg-cyan-50 text-cyan-500" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          )}
        >
          Home
        </button>
        <button 
          onClick={() => setView('adventures')}
          className={cn(
            "px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors",
            currentView === 'adventures' ? "bg-cyan-50 text-cyan-500" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          )}
        >
          My Adventures
        </button>


        <button 
          onClick={() => setView('badges')}
          className={cn(
            "px-6 py-2.5 rounded-full font-bold text-[14px] transition-colors",
            currentView === 'badges' ? "bg-cyan-50 text-cyan-500" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          )}
        >
          Badges
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        
        {/* XP & Level Pill with Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowXp(!showXp)}
            onBlur={() => setTimeout(() => setShowXp(false), 200)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100/50 hover:bg-amber-100/50 hover:border-amber-200/50 transition-all cursor-pointer group"
          >
            <div className="px-2 py-0.5 rounded bg-amber-400 text-white text-[10px] font-black uppercase shadow-sm group-hover:scale-105 transition-transform">
              Lvl {lvl}
            </div>
            <span className="text-sm font-bold text-slate-800">{xp.toLocaleString()} XP</span>
            <ChevronDown className={cn("w-4 h-4 text-amber-500 transition-transform", showXp && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showXp && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-14 right-0 w-[280px] bg-white rounded-[24px] border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] p-6 z-50 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between pointer-events-none">
                  <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-400">Your Progress</h4>
                  <Zap className="w-4 h-4 text-amber-400" />
                </div>
                
                <div className="flex flex-col gap-1 items-center justify-center p-4 bg-amber-50/50 rounded-[16px]">
                  <span className="text-3xl font-black text-slate-800 tracking-tight">{xp.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Current XP</span>
                </div>

                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold text-slate-500">Level {lvl}</span>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">
                      {xpToNextLevel - xp} to next limit
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${xpPercent}%` }}
                       transition={{ duration: 0.5, ease: "easeOut" }}
                       className="h-full bg-gradient-to-r from-amber-400 to-amber-300 rounded-full relative"
                     >
                        <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,.15) 25%, rgba(255,255,255,.15) 50%, transparent 50%, transparent 75%, rgba(255,255,255,.15) 75%, rgba(255,255,255,.15) 100%)', backgroundSize: '1rem 1rem' }} />
                     </motion.div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">0</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{xpToNextLevel.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        
        {/* Notifications */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-cyan-400 hover:bg-cyan-50 transition-colors relative">
          <Bell className="w-5 h-5 fill-current" />
        </button>

        {/* Profile menu */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu((v) => !v)}
            onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
            className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-slate-100 hover:ring-cyan-200 transition-all cursor-pointer shadow-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10"
            aria-haspopup="menu"
            aria-expanded={showProfileMenu}
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}&backgroundColor=dcfce7`}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute top-14 right-0 w-[220px] bg-white rounded-[22px] border border-slate-100 shadow-[0_20px_40px_rgba(0,0,0,0.10)] p-2 z-50"
                role="menu"
              >
                <div className="px-3 py-2.5">
                  <div className="text-xs font-black text-slate-800 tracking-wide">{userName}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Level {lvl}</div>
                </div>
                <div className="h-px bg-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/about');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[16px] hover:bg-slate-50 transition-colors text-slate-700"
                  role="menuitem"
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-bold">Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/about');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[16px] hover:bg-slate-50 transition-colors text-slate-700"
                  role="menuitem"
                >
                  <Info className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-bold">About</span>
                </button>

                <div className="h-px bg-slate-100 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setCurrentUserName('');
                    setView('home');
                    navigate('/login', { replace: true });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[16px] hover:bg-rose-50 transition-colors text-rose-600"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-black">Logout</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
