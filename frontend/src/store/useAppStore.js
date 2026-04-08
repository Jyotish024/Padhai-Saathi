import { create } from 'zustand';
import { api } from '../lib/api';

export const useAppStore = create((set) => ({
  chapters: {},
  currentChapterId: "Chapter 1",
  currentPageNum: 1, // 1-indexed for react-pdf
  numPages: null,
  selectedClass: "Class 10",
  currentUserName: "",
  currentSubject: "Science",
  currentView: "home", // "home" or "subject" or "adventures" or "badges"
  
  // Last Seen Tracking for Hero Card
  lastSeenSubject: "Science",
  lastSeenChapterId: "Chapter 1",
  lastSeenNumPages: 0,
  
  // AI State
  explanation: null,
  isExplaining: false,
  quiz: null,
  isQuizzing: false,
  messages: [
    { id: 1, role: 'ai', text: "Want to see how ductile gold can be? One gram can stretch for 2 kilometers!" }
  ],
  isTyping: false,
  showExplanation: false,
  
  // XP & Leveling State
  xp: 0,
  lvl: 1,
  xpToNextLevel: 3000,
  
  // Major Test State
  // Major Test & Progress State
  completedPages: {}, // { [subjectName]: { [chapterId]: Set of page numbers } }
  acceptedPrompts: new Set(), // Set of chapterIds
  showMajorTestPrompt: false,
  showMajorTestModal: false,

  toggleExplanation: () => set((state) => ({ showExplanation: !state.showExplanation })),

  markPageCompleted: (subject, chapterId, pageNum) => set((state) => {
    const currentSubjectProgress = state.completedPages[subject] || {};
    const currentChapterPages = currentSubjectProgress[chapterId] || new Set();
    
    if (currentChapterPages.has(pageNum)) return state;
    
    const newCompletedPages = {
      ...state.completedPages,
      [subject]: {
        ...currentSubjectProgress,
        [chapterId]: new Set([...currentChapterPages, pageNum])
      }
    };
    return { completedPages: newCompletedPages };
  }),

  acceptMajorTest: (chapterId) => set((state) => ({
    acceptedPrompts: new Set([...state.acceptedPrompts, chapterId]),
    showMajorTestPrompt: false
  })),

  setShowMajorTestPrompt: (show) => set({ showMajorTestPrompt: show }),
  setShowMajorTestModal: (show) => set({ showMajorTestModal: show, showMajorTestPrompt: false }),
  resetMajorTest: () => set({ showMajorTestPrompt: false, showMajorTestModal: false }),


  setSelectedClass: (className) => set({ selectedClass: className }),
  setCurrentUserName: (name) => set({ currentUserName: name }),
  setSubject: (subject) => {
    set({ currentSubject: subject, currentView: "subject" });
    useAppStore.getState().initChapters();
  },
  setView: (view) => set({ currentView: view }),
  setLastSeen: (subject, chapterId, numPages) => set({ 
    lastSeenSubject: subject, 
    lastSeenChapterId: chapterId, 
    lastSeenNumPages: numPages 
  }),


  initChapters: async () => {
    try {
      const { selectedClass, currentSubject } = useAppStore.getState();
      const chapters = await api.getChapters(selectedClass, currentSubject);
      if (chapters && Object.keys(chapters).length > 0) {
        set({ chapters, currentChapterId: Object.keys(chapters)[0] });
      }
    } catch (e) {
      console.error("Failed to init chapters:", e);
    }
  },

  setChapter: (id) => set({ 
    currentChapterId: id, 
    currentPageNum: 1, 
    numPages: null, 
    explanation: null, 
    quiz: null,
    messages: [{ id: Date.now(), role: 'ai', text: `Welcome to ${id}! I'm Sparky, your study buddy. Let's explore together!` }]
  }),
  
  setPage: (num) => set({ 
    currentPageNum: num, 
    explanation: null, 
    quiz: null 
  }),
  
  setNumPages: (n) => set({ numPages: n }),
  
  nextPage: () => set((state) => {
    const next = state.numPages ? Math.min(state.currentPageNum + 1, state.numPages) : state.currentPageNum + 1;
    return { 
      currentPageNum: next, 
      explanation: null, 
      quiz: null
    };
  }),
  
  prevPage: () => set((state) => {
    const prev = Math.max(1, state.currentPageNum - 1);
    return { 
      currentPageNum: prev, 
      explanation: null, 
      quiz: null
    };
  }),

  // Updated addXp to optionally return state instead of calling set if needed
  addXp: (amount, returnStateOnly = false) => {
    const logic = (state) => {
      let newXp = state.xp + amount;
      let newLvl = state.lvl;
      let nextThreshold = state.xpToNextLevel;

      while (newXp >= nextThreshold) {
        newXp -= nextThreshold;
        newLvl += 1;
        nextThreshold = newLvl * 3000;
      }
      return { xp: newXp, lvl: newLvl, xpToNextLevel: nextThreshold };
    };

    if (returnStateOnly) {
      return logic(useAppStore.getState());
    } else {
      set(logic);
    }
  },

  fetchExplanation: async (chapterId, pageNum) => {
    set({ isExplaining: true, explanation: null });
    try {
      const explanation = await api.explainPage(chapterId, pageNum);
      set((state) => ({ 
        explanation, 
        isExplaining: false,
        messages: [...state.messages, { id: Date.now(), role: 'ai', text: explanation.overview || "I've analyzed the page! Here's a quick summary." }]
      }));
    } catch (e) {
      console.error(e);
      set({ isExplaining: false });
    }
  },

  fetchQuiz: async (chapterId, pageNum) => {
    set({ isQuizzing: true, quiz: null });
    try {
      const quiz = await api.generateQuiz(chapterId, pageNum);
      set({ quiz, isQuizzing: false });
    } catch (e) {
      console.error(e);
      set({ isQuizzing: false });
    }
  },

  addMessage: (role, text) => set((state) => ({
    messages: [...state.messages, { id: Date.now(), role, text }]
  })),

  setIsTyping: (isTyping) => set({ isTyping })
}));
