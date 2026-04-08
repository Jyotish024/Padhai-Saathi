import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Key, User, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  
  const { selectedClass, setSelectedClass, setCurrentUserName } = useAppStore();

  const handleLogin = (e) => {
    e.preventDefault();
    // The class is already set in the store via the dropdown
    setCurrentUserName(name.trim());
    navigate('/app');
  };

  return (
    <div className="min-h-screen w-full bg-[#E0F7FA]/50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200/40 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/40 rounded-full blur-[100px]" />
      <div className="absolute bottom-[5%] left-[10%] w-[20%] h-[20%] bg-yellow-200/40 rounded-full blur-[60px]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1000px] bg-[#B2EBF2]/40 backdrop-blur-md rounded-[50px] border border-white/40 flex flex-col md:flex-row relative z-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
      >
        {/* Left Side: Welcome */}
        <div className="flex-1 p-12 flex flex-col items-start justify-center text-slate-800">
          <div className="relative mb-8 group">
             {/* Sparkling icon badge */}
             <div className="absolute -top-6 -right-6 text-cyan-500 z-10 animate-pulse">
               <div className="bg-cyan-500 rounded-full p-2.5 text-white shadow-lg shadow-cyan-200">
                 <SparkleIcon className="w-7 h-7" />
               </div>
             </div>
             
             {/* Mascot Integration: Glow & Shadow */}
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-64 h-64 bg-cyan-200/30 rounded-full blur-[60px] animate-pulse" />
             </div>
             
             {/* Borderless Mascot Image */}
             <motion.div 
               whileHover={{ scale: 1.05, rotate: 2 }}
               className="w-80 h-80 flex flex-col items-center justify-center relative"
             >
                 <img 
                   src="/assets/book_mascot.png" 
                   alt="Study Book" 
                   className="w-full h-full object-contain mix-blend-multiply brightness-[1.02] saturate-[0.9] filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.08)] relative z-10 rounded-[60px]"
                 />
                 {/* Ground Shadow */}
                 <div className="absolute bottom-4 w-32 h-4 bg-slate-900/10 rounded-full blur-[10px] transform scale-x-150" />
             </motion.div>
          </div>
          
          <h1 className="text-6xl font-black mb-4 tracking-tighter">
            Hi <span className="text-cyan-500">Explorer!</span>
          </h1>
          <p className="text-lg font-bold text-slate-600 max-w-sm leading-relaxed mb-4">
            Welcome back to <span className="text-slate-800">Padhai Sathi</span>. Your desk is ready for big adventures!
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[450px] bg-white p-12 flex flex-col rounded-[50px] shadow-[-10px_0_30px_rgba(0,0,0,0.03)]">
          <div className="flex justify-center mb-10">
            <div className="bg-[#D4E157]/40 px-6 py-2 rounded-full border border-[#C0CA33]/20 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#558B2F]" />
              <span className="text-xs font-black text-[#33691E] tracking-widest uppercase">School Entry</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[15px] font-black text-slate-700 ml-2 tracking-wide">Student Name</label>
              <div className="relative group">
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type your name here..."
                  className="w-full h-14 bg-slate-50 border-transparent focus:bg-white focus:border-cyan-200 transition-all rounded-full px-8 text-sm font-bold text-slate-700 outline-none shadow-inner"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[15px] font-black text-slate-700 ml-2 tracking-wide flex items-center gap-2">
                Secret Password <span className="text-lg">🔑</span>
              </label>
              <div className="relative group">
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your secret code..."
                  className="w-full h-14 bg-slate-50 border-transparent focus:bg-white focus:border-cyan-200 transition-all rounded-full px-8 text-sm font-bold text-slate-700 outline-none shadow-inner"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyan-400">
                  <Key className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[15px] font-black text-slate-700 ml-2 tracking-wide flex items-center gap-2">
                Select Your Class <span className="text-lg">📚</span>
              </label>
              <div className="relative group">
                <select 
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full h-14 bg-slate-50 border-transparent focus:bg-white focus:border-cyan-200 transition-all rounded-full px-8 text-sm font-bold text-slate-700 outline-none shadow-inner appearance-none cursor-pointer"
                >
                  <option value="Class 10">Class 10 (Science)</option>
                  <option value="Class 9">Class 9 (Mock)</option>
                  <option value="Class 8">Class 8 (Mock)</option>
                  <option value="Class 7">Class 7 (Mock)</option>
                  <option value="Class 6">Class 6 (Mock)</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full h-16 bg-[#FBC02D] hover:bg-[#F9A825] text-white font-black text-xl rounded-[25px] flex items-center justify-center gap-3 shadow-[0_10px_0_#F57F17] hover:translate-y-[2px] hover:shadow-[0_8px_0_#F57F17] active:translate-y-[4px] active:shadow-none transition-all mt-4"
            >
              Start Adventure <Rocket className="w-6 h-6" />
            </button>
          </form>

          <div className="mt-12 text-center space-y-6">
             <button className="text-[13px] font-black text-cyan-600 hover:text-cyan-700 underline underline-offset-4 tracking-wide">
               Need help finding your desk?
             </button>
             
             <div className="pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                <p className="text-[14px] font-bold text-slate-500">
                  New Explorer? <button onClick={() => navigate('/signup')} className="text-cyan-600 hover:text-cyan-700 font-black underline underline-offset-4">Sign Up here!</button>
                </p>
                <div className="flex items-center gap-3 w-full max-w-[200px]">
                  <div className="h-px flex-1 bg-slate-100"></div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or</span>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-[12px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                >
                  Already have a desk? Sign In
                </button>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SparkleIcon(props) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M12 3v3m6.36 1.64l-2.12 2.12M21 12h-3m-1.64 6.36l-2.12-2.12M12 21v-3m-6.36-1.64l2.12-2.12M3 12h3m1.64-6.36l2.12 2.12" strokeOpacity="0.5" />
      <path d="M12 8l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" fill="currentColor" />
    </svg>
  );
}
