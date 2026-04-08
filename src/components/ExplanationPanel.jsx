import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { Lightbulb, Brain, PlayCircle, Loader2, Activity, Wand2, ListChecks, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function ExplanationPanel() {
  const { explanation, isExplaining } = useAppStore();

  const parseConcepts = (text) => {
    if (!text) return [];
    if (typeof text !== 'string') text = String(text);
    
    let concepts = [];
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    
    if (parts.length > 1) {
       for(let i=1; i<parts.length; i+=2) {
          const desc = parts[i+1]?.replace(/^[.:-\s]+/, '').trim() || '';
          concepts.push({ title: parts[i].trim(), desc });
       }
       return concepts.filter(c => c.title && c.desc);
    }
    return [{ title: "Concept", desc: text }];
  };

  if (isExplaining) {
    return (
      <div className="w-full h-40 flex flex-col items-center justify-center bg-white rounded-[32px] border border-slate-100 shadow-sm gap-4 text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-[10px] font-bold tracking-widest uppercase">Analyzing Page...</span>
      </div>
    );
  }

  if (!explanation) {
    return null; // Placeholder is handled by the BookViewer component on empty state
  }

  const concepts = parseConcepts(explanation.conceptExplanation);

  return (
    <div className="w-full flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6">
        
        {/* Adventure Recap (Overview) */}
        {explanation.overview && (
          <div className="bg-[#FFF9EA] border border-amber-100 rounded-[32px] p-6 relative overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                <Lightbulb className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-[13px] font-black text-slate-800 tracking-wider">ADVENTURE RECAP</h3>
            </div>
            
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
              {explanation.overview}
            </p>
          </div>
        )}

        {/* Mind Map (Concept Explanation) */}
        {explanation.conceptExplanation && (
          <div className="bg-[#F0FDF4] border border-green-200/60 rounded-[32px] p-6 relative overflow-hidden shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center shrink-0">
                <Brain className="w-4 h-4 text-green-600" />
              </div>
              <h3 className="text-[13px] font-black text-slate-800 tracking-wider">MIND MAP</h3>
            </div>
            
            {concepts.map((c, i) => (
              <div key={i} className="bg-white border border-green-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-[13px] font-black text-cyan-400 mb-2 capitalize">{c.title}</h4>
                <p className="text-[12px] text-slate-600 leading-relaxed font-medium">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Mission Debrief (Activities) */}
        {explanation.activities && (
          <div className="bg-[#FFF7ED] border border-orange-200/60 rounded-[32px] p-6 relative overflow-hidden shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-200 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="text-[13px] font-black text-slate-800 tracking-wider">MISSION DEBRIEF</h3>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
              {explanation.activities}
            </p>
          </div>
        )}

        {/* Real World Magic (Examples) */}
        {explanation.examples && (
          <div className="bg-[#FDF2F8] border border-pink-200/60 rounded-[32px] p-6 relative overflow-hidden shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-pink-200 flex items-center justify-center shrink-0">
                <Wand2 className="w-4 h-4 text-pink-600" />
              </div>
              <h3 className="text-[13px] font-black text-slate-800 tracking-wider">REAL WORLD MAGIC</h3>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
              {explanation.examples}
            </p>
          </div>
        )}

        {/* Sparky's Checklist (Key Points) */}
        {explanation.keyPoints && explanation.keyPoints.length > 0 && (
          <div className="bg-[#FAF5FF] border border-purple-200/60 rounded-[32px] p-6 relative overflow-hidden shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center shrink-0">
                <ListChecks className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="text-[13px] font-black text-slate-800 tracking-wider">SPARKY'S CHECKLIST</h3>
            </div>
            <ul className="space-y-3">
              {(Array.isArray(explanation.keyPoints) ? explanation.keyPoints : [String(explanation.keyPoints)]).map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-[13px] text-slate-600 font-medium leading-relaxed">
                  <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* The Big Picture (Final Understanding) */}
        {explanation.finalUnderstanding && (
          <div className="bg-[#EFF6FF] border border-blue-200/60 rounded-[32px] p-6 relative overflow-hidden shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-[13px] font-black text-slate-800 tracking-wider">THE BIG PICTURE</h3>
            </div>
            <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
              {explanation.finalUnderstanding}
            </p>
          </div>
        )}

      </motion.div>
    </div>
  );
}
