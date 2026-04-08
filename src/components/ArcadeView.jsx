import React, { useState } from 'react';
import { Trophy, Gamepad2, Clock, Users, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

const dummyQuiz = {
  id: "daily-1",
  title: "Daily Science Challenge",
  xpReward: 500,
  questions: [
    {
      id: "q1",
      question: "Which of the following is an example of a chemical reaction?",
      options: {
        A: "Melting of ice",
        B: "Rusting of iron",
        C: "Boiling water",
        D: "Breaking glass"
      },
      answer: "B",
      explanation: "Rusting of iron involves a chemical change producing a new substance (iron oxide), whereas melting, boiling, and breaking are physical changes."
    },
    {
      id: "q2",
      question: "What is the pH value of a neutral solution?",
      options: {
        A: "0",
        B: "7",
        C: "14",
        D: "1"
      },
      answer: "B",
      explanation: "A neutral solution, like pure water, has a pH of exactly 7 at 25°C."
    }
  ]
};

export function ArcadeView() {
  const { addXp, lvl } = useAppStore();
  const [activeContest, setActiveContest] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const handleSelect = (qId, option) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const calculateScore = () => {
    let score = 0;
    activeContest.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) score++;
    });
    return score;
  };

  const handleClaimReward = () => {
    const score = calculateScore();
    const xpEarned = (score / activeContest.questions.length) * activeContest.xpReward;
    addXp(Math.round(xpEarned));
    setRewardClaimed(true);
  };

  if (activeContest) {
    return (
      <div className="flex-1 overflow-y-auto bg-white p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
            <div>
              <button 
                onClick={() => {
                  setActiveContest(null);
                  setSelectedAnswers({});
                  setShowResults(false);
                  setRewardClaimed(false);
                }}
                className="text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 mb-2 block transition-colors"
              >
                ← Back to Arcade
              </button>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">{activeContest.title}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4" /> {activeContest.xpReward} XP Pool
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 font-bold text-sm">
                  <Users className="w-4 h-4" /> 1,204 Players Live
                </span>
              </div>
            </div>
            {showResults && (
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Score</span>
                <div className="text-3xl font-black text-cyan-500">
                  {calculateScore()} <span className="text-lg text-slate-300">/ {activeContest.questions.length}</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#F0F9FF] border border-cyan-100 rounded-[32px] p-8 shadow-sm">
            <div className="space-y-8">
              {activeContest.questions.map((q, idx) => (
                <div key={q.id} className="space-y-4">
                  <p className="text-[15px] font-bold text-slate-700 leading-relaxed">
                    {idx + 1}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(q.options).map(([key, val]) => {
                      const isSelected = selectedAnswers[q.id] === key;
                      const isCorrect = q.answer === key;
                      const showCorrect = showResults && isCorrect;
                      const showWrong = showResults && isSelected && !isCorrect;

                      return (
                        <button
                          key={key}
                          onClick={() => handleSelect(q.id, key)}
                          className={`
                            w-full text-left px-5 py-4 rounded-2xl text-[13px] font-medium transition-all flex items-center justify-between group
                            ${isSelected ? 'ring-2 ring-cyan-400 bg-white' : 'bg-white/50 hover:bg-white border border-transparent'}
                            ${showCorrect ? 'bg-green-50 ring-2 ring-green-400 text-green-700' : ''}
                            ${showWrong ? 'bg-red-50 ring-2 ring-red-400 text-red-700' : ''}
                          `}
                        >
                          <span><span className="font-black mr-2 text-cyan-400">{key}.</span> {val}</span>
                          {showCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                          {showWrong && <XCircle className="w-5 h-5 text-red-500" />}
                        </button>
                      );
                    })}
                  </div>
                  {showResults && selectedAnswers[q.id] && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[13px] text-slate-600 bg-white/60 p-4 rounded-2xl border border-slate-100 font-medium mt-4"
                    >
                      <span className="font-black text-cyan-500 mr-2">Explanation:</span>
                      {q.explanation}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-cyan-100">
              {!showResults ? (
                <button 
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(selectedAnswers).length < activeContest.questions.length}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-black text-sm py-5 rounded-2xl transition-all shadow-xl shadow-cyan-200 disabled:opacity-50 disabled:shadow-none uppercase tracking-widest"
                >
                  Submit Answers
                </button>
              ) : !rewardClaimed ? (
                <button 
                  onClick={handleClaimReward}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-white font-black text-sm py-5 rounded-2xl transition-all shadow-xl shadow-amber-200 uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  Claim My {Math.round((calculateScore() / activeContest.questions.length) * activeContest.xpReward)} XP! <Trophy className="w-5 h-5" />
                </button>
              ) : (
                <div className="w-full bg-green-50 border border-green-200 text-green-600 font-black text-sm py-5 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest">
                  <CheckCircle2 className="w-5 h-5" /> Rewards Claimed! Look at your level ({lvl})
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 custom-scrollbar">
      <div className="max-w-5xl mx-auto mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tight text-slate-800 mb-2">
            The Arcade
          </h1>
          <p className="text-lg font-bold text-slate-400">
            Compete with students globally. Earn XP. Climb the ranks.
          </p>
        </div>
        <div className="px-6 py-3 bg-white rounded-[20px] shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="w-12 h-12 rounded-[14px] bg-amber-50 flex items-center justify-center">
             <Trophy className="w-6 h-6 text-amber-400" />
           </div>
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank</p>
             <p className="text-xl font-black text-slate-700">#4,208</p>
           </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Daily Contest */}
        <div className="bg-white rounded-[40px] border border-cyan-100 p-8 shadow-xl shadow-cyan-500/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-cyan-50 text-cyan-600 font-black text-[10px] uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <Clock className="w-3 h-3" /> Ends in 04:12:05
                </span>
                <span className="px-4 py-1.5 bg-amber-50 text-amber-600 font-black text-[10px] uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> +500 XP Pool
                </span>
              </div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-tight mb-4">
                Daily Science Sprint
              </h2>
              <p className="text-slate-500 font-bold max-w-sm">
                A quick 10-question sprint testing your general science knowledge. Fast times yield bonus XP.
              </p>
            </div>
            
            <button 
              onClick={() => setActiveContest(dummyQuiz)}
              className="w-full py-5 bg-cyan-500 hover:bg-cyan-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-cyan-200 transition-all flex items-center justify-center gap-3"
            >
              Enter Contest <Gamepad2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Weekly Contest */}
        <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col h-full justify-between gap-10">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <Trophy className="w-3 h-3" /> Weekly Mega Event
                </span>
                <span className="px-4 py-1.5 bg-amber-500/20 text-amber-400 font-black text-[10px] uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> +5,000 XP Pool + Badge
                </span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-4">
                Grand Mathematics Tournament
              </h2>
              <p className="text-indigo-200 font-medium max-w-sm">
                Tackle advanced algebra and geometry in this week's 30-minute endurance contest against players worldwide.
              </p>
            </div>
            
            <button 
              onClick={() => setActiveContest({...dummyQuiz, id: "weekly-1", title: "Grand Mathematics Tournament", xpReward: 5000})}
              className="w-full py-5 bg-indigo-500 hover:bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-3"
            >
              Join Tournament <Gamepad2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
