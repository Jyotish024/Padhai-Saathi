import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { CheckCircle2, XCircle, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function QuizPanel() {
  const { quiz, isQuizzing } = useAppStore();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (isQuizzing) {
    return (
      <div className="w-full bg-white rounded-[32px] border border-slate-100 p-8 flex flex-col items-center justify-center gap-4 text-cyan-400 shadow-sm min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-[10px] font-bold tracking-widest uppercase">Sparky is preparing your quiz...</span>
      </div>
    );
  }

  if (!quiz || !quiz.questions) return null;

  const handleSelect = (qId, option) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) score++;
    });
    return score;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-[#F0F9FF] border border-cyan-100 rounded-[32px] p-6 shadow-sm flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
            <Info className="w-4 h-4 text-cyan-600" />
          </div>
          <h3 className="text-[13px] font-black text-slate-800 tracking-wider uppercase">Quick Quiz</h3>
        </div>
        {showResults && (
          <span className="text-xs font-black text-cyan-500">
            SCORE: {calculateScore()} / {quiz.questions.length}
          </span>
        )}
      </div>

      <div className="space-y-8">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="space-y-4">
            <p className="text-[13px] font-bold text-slate-700 leading-relaxed">
              {idx + 1}. {q.question}
            </p>
            <div className="grid grid-cols-1 gap-2">
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
                      w-full text-left px-5 py-3.5 rounded-2xl text-[12px] font-medium transition-all flex items-center justify-between group
                      ${isSelected ? 'ring-2 ring-cyan-400 bg-white' : 'bg-white/50 hover:bg-white border border-transparent'}
                      ${showCorrect ? 'bg-green-50 ring-2 ring-green-400 text-green-700' : ''}
                      ${showWrong ? 'bg-red-50 ring-2 ring-red-400 text-red-700' : ''}
                    `}
                  >
                    <span><span className="font-black mr-2 text-cyan-400">{key}.</span> {val}</span>
                    {showCorrect && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {showWrong && <XCircle className="w-4 h-4 text-red-500" />}
                  </button>
                );
              })}
            </div>
            {showResults && selectedAnswers[q.id] && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-[11px] text-slate-500 bg-white/40 p-3 rounded-xl border border-slate-100 font-medium italic"
              >
                Sparky says: {q.explanation}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {!showResults ? (
        <button 
          onClick={() => {
            const score = calculateScore();
            const { addXp, markPageCompleted, currentSubject, currentChapterId, currentPageNum } = useAppStore.getState();
            
            if (score > 0) {
              addXp(score * 100);
            }
            
            // Mark page as completed because the user has given the quiz
            markPageCompleted(currentSubject, currentChapterId, currentPageNum);
            
            setShowResults(true);
          }}
          disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-black text-xs py-4 rounded-2xl transition-all shadow-md shadow-cyan-200 disabled:opacity-50 disabled:shadow-none uppercase tracking-widest"
        >
          Check Answers
        </button>
      ) : (
        <button 
          onClick={() => {
            setShowResults(false);
            setSelectedAnswers({});
            useAppStore.getState().fetchQuiz(useAppStore.getState().currentChapterId, useAppStore.getState().currentPageNum);
          }}
          className="w-full bg-white border border-cyan-200 text-cyan-500 font-black text-xs py-4 rounded-2xl transition-all hover:bg-cyan-50 uppercase tracking-widest"
        >
          Try New Quiz
        </button>
      )}
    </motion.div>
  );
}
