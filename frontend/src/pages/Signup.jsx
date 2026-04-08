import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Mail, User, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF4C2]/40 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-200/40 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-200/35 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] bg-white/40 backdrop-blur-md rounded-[50px] border border-white/40 flex flex-col md:flex-row relative z-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
      >
        {/* Left Side: Welcome */}
        <div className="flex-1 p-12 flex flex-col items-start justify-center text-slate-800">
          <div className="relative mb-8 group">
             {/* Mascot Integration: Glow & Shadow */}
             <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-amber-200/40 rounded-full blur-[60px] animate-pulse" />
             </div>

             {/* Borderless Mascot Image */}
             <motion.div 
               whileHover={{ scale: 1.05, rotate: -2 }}
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
          
          <h1 className="text-6xl font-black mb-4 tracking-tighter text-amber-500">
            Join the <span className="text-slate-800">Club!</span>
          </h1>
          <p className="text-lg font-bold text-slate-600 max-w-sm leading-relaxed mb-4">
            Become a part of <span className="text-slate-800">Padhai Sathi</span> today and start your learning adventure!
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-[450px] bg-white p-12 flex flex-col rounded-[50px] shadow-[-10px_0_30px_rgba(0,0,0,0.03)]">
          <div className="flex justify-center mb-10">
            <div className="bg-amber-100 px-6 py-2 rounded-full border border-amber-200 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-black text-amber-600 tracking-widest uppercase">New Member</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[15px] font-black text-slate-700 ml-2 tracking-wide">Your Name</label>
              <div className="relative group">
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="What's your name?"
                  className="w-full h-14 bg-slate-50 border-transparent focus:bg-white focus:border-amber-200 transition-all rounded-full px-8 text-sm font-bold text-slate-700 outline-none shadow-inner"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-400">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[15px] font-black text-slate-700 ml-2 tracking-wide">Parent's Email</label>
              <div className="relative group">
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email for adventure invites..."
                  className="w-full h-14 bg-slate-50 border-transparent focus:bg-white focus:border-amber-200 transition-all rounded-full px-8 text-sm font-bold text-slate-700 outline-none shadow-inner"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-400">
                  <Mail className="w-5 h-5" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full h-16 bg-[#FBC02D] hover:bg-[#F9A825] text-white font-black text-xl rounded-[25px] flex items-center justify-center gap-3 shadow-[0_10px_0_#F57F17] hover:translate-y-[2px] hover:shadow-[0_8px_0_#F57F17] active:translate-y-[4px] active:shadow-none transition-all mt-4"
            >
              Sign Me Up! <Rocket className="w-6 h-6" />
            </button>
          </form>

          <div className="mt-12 text-center">
             <button 
                onClick={() => navigate('/login')}
                className="text-[13px] font-black text-amber-600 hover:text-amber-700 underline underline-offset-4 tracking-wide"
              >
               Already have a desk? Log in!
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
