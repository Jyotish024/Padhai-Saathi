import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ScrollArea } from './ui/ScrollArea';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAppStore } from '../store/useAppStore';
import { CHAPTER_STATUS_MESSAGES } from '../lib/constants';

export function AskDoubt() {
  const { currentChapterId, currentPageNum, messages, isTyping, addMessage, setIsTyping } = useAppStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const statusMessage = CHAPTER_STATUS_MESSAGES[currentChapterId] || "Sparky is ready!";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;
    
    addMessage('user', input);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const res = await api.askDoubt(currentInput, currentChapterId, currentPageNum);
      addMessage('ai', res.answer);
    } catch (e) {
      addMessage('ai', "Oops! My circuits got a little tangled. Try asking again!");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[280px] bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
      
      {/* Header */}
      <div className="bg-white px-5 py-3 flex items-center gap-4 relative">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
            <div className="w-6 h-6 border-2 border-white rounded opacity-80" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800 tracking-wider">SPARKY SAYS</span>
          <span className="text-[10px] text-cyan-500 font-bold tracking-widest uppercase">
            {isTyping ? "Thinking..." : statusMessage}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 px-5" ref={scrollRef}>
        <div className="space-y-4 pb-2">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div 
                key={m.id} 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-[24px] px-5 py-3.5 text-[13px] leading-relaxed font-medium italic ${
                  m.role === 'user' 
                    ? 'bg-cyan-500 text-white rounded-br-sm' 
                    : 'bg-slate-50 text-slate-600 rounded-bl-sm'
                }`}>
                  "{m.text}"
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }} 
                className="flex justify-start"
              >
                <div className="bg-slate-50 text-slate-400 rounded-[24px] rounded-bl-sm px-5 py-4 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="p-4 bg-white">
        <form onSubmit={handleSend} className="relative flex items-center">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Sparky anything..." 
            className="h-[46px] w-full bg-slate-50 border-transparent text-sm text-slate-700 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-cyan-400 rounded-full transition-all font-medium pl-5 pr-14"
            disabled={isTyping}
          />
          <button 
            disabled={isTyping || !input.trim()}
            type="submit" 
            className="absolute right-1.5 w-9 h-9 flex items-center justify-center rounded-full bg-cyan-400 hover:bg-cyan-500 text-white shadow-sm transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4 mr-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
