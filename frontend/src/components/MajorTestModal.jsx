import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Timer, X, CheckCircle2, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_QUESTIONS = [
  {
    id: 1,
    type: 'mcq',
    marks: 1,
    question: "What is the result of mixing an acid with a base?",
    options: { A: "Salt and Water", B: "Acid and Base", C: "Oxygen and Hydrogen", D: "Metal and Gas" },
    answer: "A"
  },
  {
    id: 2,
    type: 'short',
    marks: 2,
    question: "Define neutralization reaction with one example.",
  },
  {
    id: 3,
    type: 'long',
    marks: 5,
    question: "Explain the process of electrolysis of water with a neat labeled diagram.",
  },
  {
    id: 4,
    type: 'formula',
    marks: 3,
    question: "Write the balanced chemical equation for the reaction of Sodium Carbonate with Hydrochloric acid.",
  },
  {
    id: 5,
    type: 'very_long',
    marks: 10,
    question: "Describe the modern periodic table, explaining the significance of periods and groups. How does the metallic character vary across a period?",
  }
];

export function MajorTestModal() {
  const { showMajorTestModal, setShowMajorTestModal } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [currentStep, setCurrentStep] = useState(0); // 0: Instructions, 1: Test, 2: Finished
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (!showMajorTestModal || currentStep !== 1) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setCurrentStep(2);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showMajorTestModal, currentStep]);

  if (!showMajorTestModal) return null;

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const renderQuestion = (q) => {
    switch (q.type) {
      case 'mcq':
        return (
          <div className="space-y-4">
            {Object.entries(q.options).map(([key, text]) => (
              <button
                key={key}
                onClick={() => handleAnswerChange(q.id, key)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[q.id] === key 
                  ? 'border-cyan-500 bg-cyan-50 text-cyan-700' 
                  : 'border-slate-100 hover:border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                    answers[q.id] === key ? 'border-cyan-500 bg-cyan-500 text-white' : 'border-slate-200'
                  }`}>
                    {key}
                  </div>
                  <span className="font-medium">{text}</span>
                </div>
              </button>
            ))}
          </div>
        );
      case 'short':
      case 'formula':
        return (
          <input 
            type="text"
            placeholder="Type your answer here..."
            className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-cyan-500 focus:outline-none transition-colors"
            value={answers[q.id] || ''}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          />
        );
      case 'long':
      case 'very_long':
        return (
          <textarea 
            placeholder="Type your detailed answer here..."
            rows={8}
            className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-cyan-500 focus:outline-none transition-colors resize-none"
            value={answers[q.id] || ''}
            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-white flex flex-col"
      >
        {/* Header */}
        <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Sparky Major Test</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Chapter 1 Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-50 border border-slate-100">
              <Timer className="w-5 h-5 text-cyan-500" />
              <span className="font-mono font-bold text-lg text-slate-700">{formatTime(timeLeft)}</span>
            </div>
            <button 
              onClick={() => setShowMajorTestModal(false)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {currentStep === 0 && (
            <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center justify-center text-center">
              <div className="max-w-2xl">
                <div className="w-20 h-20 rounded-3xl bg-cyan-50 flex items-center justify-center text-cyan-500 mx-auto mb-8">
                  <Wand2 className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Ready for the Major Test?</h3>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                  This test covers everything you've learned in this chapter. It includes MCQs, short answers, and long conceptual questions. You have exactly 1 hour to complete it.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left mb-10">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Time Limit</p>
                    <p className="font-bold text-slate-700">60 Minutes</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Questions</p>
                    <p className="font-bold text-slate-700">15 Questions</p>
                  </div>
                </div>
                <button 
                  onClick={() => setCurrentStep(1)}
                  className="px-10 py-5 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-2xl shadow-lg shadow-cyan-200 transition-all uppercase tracking-widest text-sm"
                >
                  Start The Test
                </button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <>
              {/* Question Navigation */}
              <div className="w-80 border-r border-slate-100 p-8 overflow-y-auto shrink-0 bg-slate-50/50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">Questions</h4>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {MOCK_QUESTIONS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentQuestionIndex(i)}
                      className={`w-full aspect-square rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                        currentQuestionIndex === i 
                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-200' 
                        : answers[MOCK_QUESTIONS[i].id]
                          ? 'bg-cyan-50 text-cyan-500 border border-cyan-100'
                          : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-10 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">Legend</p>
                  <div className="space-y-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-cyan-500" />
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-cyan-50 border border-cyan-100" />
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full border border-slate-100" />
                      <span>Remaining</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Area */}
              <div className="flex-1 overflow-y-auto p-16">
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-100 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                      Question {currentQuestionIndex + 1}
                    </div>
                    <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                      {MOCK_QUESTIONS[currentQuestionIndex].marks} Marks
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 mb-10 leading-tight">
                    {MOCK_QUESTIONS[currentQuestionIndex].question}
                  </h3>

                  <div className="mb-12">
                    {renderQuestion(MOCK_QUESTIONS[currentQuestionIndex])}
                  </div>

                  <div className="flex items-center justify-between pt-10 border-t border-slate-100">
                    <button 
                      onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                      disabled={currentQuestionIndex === 0}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>

                    {currentQuestionIndex === MOCK_QUESTIONS.length - 1 ? (
                      <button 
                        onClick={() => setCurrentStep(2)}
                        className="px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-black rounded-2xl shadow-lg shadow-green-200 transition-all uppercase tracking-widest text-sm"
                      >
                        Submit Final Test
                      </button>
                    ) : (
                      <button 
                        onClick={() => setCurrentQuestionIndex(p => Math.min(MOCK_QUESTIONS.length - 1, p + 1))}
                        className="flex items-center gap-2 px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-black rounded-xl shadow-lg shadow-cyan-200 transition-all uppercase tracking-widest text-xs"
                      >
                        Next Question
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="flex-1 overflow-y-auto p-10 flex flex-col items-center justify-center text-center">
              <div className="max-w-2xl">
                <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500 mx-auto mb-8">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-4">Assessment Submitted!</h3>
                <p className="text-slate-500 mb-10 leading-relaxed font-medium">
                  Great job! Your answers have been recorded for the major test. Your teacher (or Sparky) will review them and provide a detailed report soon.
                </p>
                <button 
                  onClick={() => {
                    setShowMajorTestModal(false);
                    // Reset or show results logic here
                  }}
                  className="px-10 py-5 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-sm"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
