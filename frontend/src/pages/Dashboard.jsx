import React, { useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { BookViewer } from '../components/BookViewer';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { QuizPanel } from '../components/QuizPanel';
import { AskDoubt } from '../components/AskDoubt';
import { TopNav } from '../components/TopNav';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { MajorTestPrompt } from '../components/MajorTestPrompt';
import { MajorTestModal } from '../components/MajorTestModal';

import { HomeView } from '../components/HomeView';
import { AdventuresView } from '../components/AdventuresView';
import { BadgesView } from '../components/BadgesView';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function Dashboard() {
  const { showExplanation, currentChapterId, currentPageNum, fetchExplanation, currentView, setView } = useAppStore();

  // Sync currentView with Browser History for the Back button
  useEffect(() => {
    const handlePopState = (event) => {
      // When user clicks the browser Back button, state.view contains the previous view
      if (event.state && event.state.view) {
        setView(event.state.view);
      } else {
        // Fallback to home if no state
        setView('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setView]);

  useEffect(() => {
    // Push a new history entry when the view changes, but only if it's different from current history state
    if (!window.history.state || window.history.state.view !== currentView) {
       window.history.pushState({ view: currentView }, '', `#${currentView}`);
    }
  }, [currentView]);

  useEffect(() => {
    if (showExplanation) {
      fetchExplanation(currentChapterId, currentPageNum);
    }
  }, [showExplanation, currentChapterId, currentPageNum, fetchExplanation]);

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-800 flex flex-col overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Top Navigation spanning full width */}
      {['home', 'adventures', 'badges'].includes(currentView) && <TopNav />}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-row min-h-0 relative">
        <ErrorBoundary>
        {currentView === 'home' ? (
          <HomeView />
        ) : currentView === 'adventures' ? (
          <AdventuresView />
        ) : currentView === 'badges' ? (
          <BadgesView />
        ) : (
          <>


            {/* Left Sidebar */}
            <Sidebar />

            {/* Center Panel: Book Viewer Container */}
            <div className="flex-1 flex bg-slate-50 min-w-0 p-6 relative">
              <BookViewer />
            </div>

            {/* Right Panel: AI Companion */}
            <div className="w-[380px] bg-slate-50 border-l border-slate-200 flex flex-col p-6 z-20 overflow-y-auto custom-scrollbar gap-8">
              <QuizPanel />
              
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  >
                    <ExplanationPanel />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-8 flex flex-col z-10 shrink-0">
                <AskDoubt />
              </div>
            </div>
          </>
        )}
        </ErrorBoundary>
      </div>

      <MajorTestPrompt />
      <MajorTestModal />

    </div>
  );
}

