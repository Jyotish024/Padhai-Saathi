import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ArrowLeft, Pause, Bot, Archive, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Keep the worker same-origin (Vite bundles it) to avoid cross-origin failures.
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

const getChapterTitle = (subject, chapterId) => {
  if (subject !== 'Science') return chapterId;
  const titles = {
    "Chapter 1": "Chemical Reactions and Equations",
    "Chapter 2": "Acids, Bases and Salts",
    "Chapter 3": "Metals and Non-metals",
    "Chapter 4": "Carbon and its Compounds",
    "Chapter 5": "Life Processes",
    "Chapter 6": "Control and Coordination",
    "Chapter 7": "How do Organisms Reproduce?",
    "Chapter 8": "Heredity and Evolution",
    "Chapter 9": "Light - Reflection and Refraction",
    "Chapter 10": "The Human Eye and the Colourful World",
    "Chapter 11": "Electricity",
    "Chapter 12": "Magnetic Effects of Electric Current",
    "Chapter 13": "Our Environment"
  };
  return titles[chapterId] || chapterId;
};

export function BookViewer() {
  const { currentChapterId, currentPageNum, numPages, setNumPages, prevPage, nextPage, fetchExplanation, chapters, currentSubject, markPageCompleted, setLastSeen, setView } = useAppStore();
  const [direction, setDirection] = useState(0);
  const [isPillHovered, setIsPillHovered] = useState(false);
  const [isPillVisible, setIsPillVisible] = useState(true);
  const [pdfError, setPdfError] = useState(false);
  const [pageWidth, setPageWidth] = useState(800);
  const contentRef = useRef(null);

  // Reset error state when chapter or subject changes
  useEffect(() => {
    setPdfError(false);
  }, [currentChapterId, currentSubject]);

  // Compute available width for the PDF page so images scale correctly
  useEffect(() => {
    const updateWidth = () => {
      if (contentRef.current) {
        const w = contentRef.current.clientWidth;
        // Subtract horizontal padding (2 * 32px = 64px) and some buffer
        setPageWidth(Math.max(400, w - 80));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    let timeoutId;
    const handleMouseMove = (e) => {
      // If mouse is within bottom 150px of screen
      if (window.innerHeight - e.clientY < 150) {
        setIsPillVisible(true);
        clearTimeout(timeoutId);
      } else if (!isPillHovered) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setIsPillVisible(false), 2000);
      }
    };
    
    // Initial setup
    window.addEventListener('mousemove', handleMouseMove);
    timeoutId = setTimeout(() => {
      if (!isPillHovered) setIsPillVisible(false);
    }, 2000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [isPillHovered]);

  // Reset error state when chapter or subject changes
  useEffect(() => {
    setPdfError(false);
  }, [currentChapterId, currentSubject]);

  const handleNext = useCallback(() => {
    if (numPages && currentPageNum >= numPages) return;
    setDirection(1);
    nextPage();
  }, [numPages, currentPageNum, nextPage]);

  const handlePrev = useCallback(() => {
    if (currentPageNum <= 1) return;
    setDirection(-1);
    prevPage();
  }, [currentPageNum, prevPage]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent triggering if user is typing in an input (like chat or auth forms)
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLastSeen(currentSubject, currentChapterId, numPages);
    setPdfError(false);
  }

  function onDocumentLoadError(error) {
    console.error('PDF load error:', error);
    setPdfError(true);
  }

  const completedPages = useAppStore(state => state.completedPages);
  const acceptedPrompts = useAppStore(state => state.acceptedPrompts);
  const setShowMajorTestPrompt = useAppStore(state => state.setShowMajorTestPrompt);

  useEffect(() => {
    if (numPages && currentPageNum === numPages) {
      const subjectProgress = completedPages[currentSubject] || {};
      const done = subjectProgress[currentChapterId]?.size || 0;
      // Trigger if all pages are done and we haven't already accepted/shown the prompt for this chapter
      if (done >= numPages && !acceptedPrompts.has(currentChapterId)) {
        setShowMajorTestPrompt(true);
      }
    }
  }, [currentPageNum, numPages, currentChapterId, currentSubject, completedPages, acceptedPrompts, setShowMajorTestPrompt]);

  const pdfFile = chapters[currentChapterId];
  const pdfUrl = pdfFile ? `/pdfs/${pdfFile}` : null;

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-white rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-100">
      
      {/* Navbar Header style for BookViewer */}
      {pdfUrl && (
        <div className="px-8 py-5 shrink-0 flex items-center justify-between border-b border-slate-100 bg-white z-20 shadow-sm relative">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setView('home')}
              className="flex items-center justify-center p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all shadow-sm group border border-slate-100"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-0.5">
                <span className="px-2.5 py-1 bg-cyan-50 text-cyan-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                  {currentSubject} {currentChapterId.replace('Chapter ', '3.')}
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Page {currentPageNum} {numPages ? `of ${numPages}` : ''}
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">
                {getChapterTitle(currentSubject, currentChapterId)}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div ref={contentRef} className="flex-1 flex flex-col items-center overflow-auto p-4 md:p-8 pt-6 relative custom-scrollbar bg-slate-50/50">
        
        {pdfError ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-6 p-20">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
              <Archive className="w-10 h-10 text-slate-300" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-slate-600">Content Coming Soon!</h3>
              <p className="text-sm font-bold text-slate-400 max-w-xs">
                This chapter's PDF hasn't been added yet. Try Science for a full experience!
              </p>
            </div>
            <button 
              onClick={() => useAppStore.getState().setView('home')}
              className="px-6 py-3 bg-cyan-400 text-white font-black rounded-2xl shadow-lg hover:bg-cyan-500 transition-all"
            >
              Back to Home
            </button>
          </div>
        ) : pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center p-20 text-cyan-500 font-medium text-sm gap-4 mt-20">
                <Loader2 className="w-10 h-10 animate-spin" />
                <span className="tracking-widest uppercase text-xs font-bold">Unpacking the magic...</span>
              </div>
            }
            className="flex flex-col items-center justify-start w-full max-w-5xl"
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentPageNum}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="bg-white rounded-2xl mb-[120px] shadow-xl overflow-hidden w-full flex justify-center border border-slate-100 relative group"
              >


                 <Page 
                   pageNumber={currentPageNum} 
                   width={pageWidth}
                   renderTextLayer={true}
                   renderAnnotationLayer={true}
                   renderInteractiveForms={true}
                   className="select-text"
                   loading={
                     <div className="w-full h-[800px] flex items-center justify-center bg-white rounded-2xl">
                       <Loader2 className="w-8 h-8 animate-spin text-cyan-300" />
                     </div>
                   }
                 />


              </motion.div>
            </AnimatePresence>
          </Document>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs font-bold uppercase tracking-widest">
            Select a mission to begin
          </div>
        )}

        {/* Lumina Bottom Navigation Pill */}
        <AnimatePresence>
          {pdfUrl && isPillVisible && (
            <motion.div 
              initial={{ y: 120 }}
              animate={{ y: 0 }}
              exit={{ y: 120 }}
              transition={{ type: "spring", stiffness: 150, damping: 20 }}
              onMouseEnter={() => setIsPillHovered(true)}
              onMouseLeave={() => setIsPillHovered(false)}
              className="fixed bottom-10 left-[calc(50%-120px)] flex items-center justify-between w-[240px] bg-white backdrop-blur-xl border border-slate-100 px-6 py-3 rounded-[32px] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] z-50 transition-shadow duration-500 hover:shadow-[0_30px_60px_-10px_rgba(0,0,0,0.15)]"
            >
              <button 
                className="flex flex-col items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 group"
                onClick={handlePrev} 
                disabled={currentPageNum <= 1}
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[9px] font-bold tracking-widest uppercase">Back</span>
              </button>
              
              {/* Center AI FAB - Integrated Inside */}
              <div className="px-2">
                <button 
                  onClick={useAppStore.getState().toggleExplanation}
                  className="flex flex-col items-center group transition-all"
                >
                  <div className="w-14 h-14 rounded-full bg-cyan-400 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(34,211,238,0.4)] group-hover:scale-105 transition-transform ring-4 ring-white">
                    <Bot className="w-6 h-6" />
                  </div>
                  <span className="text-[8px] font-bold tracking-widest uppercase text-cyan-500 mt-1 whitespace-nowrap">AI Tutor</span>
                </button>
              </div>
              <button 
                className="flex flex-col items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 group"
                onClick={handleNext} 
                disabled={numPages ? currentPageNum >= numPages : false}
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span className="text-[9px] font-bold tracking-widest uppercase">Next</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
