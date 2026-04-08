const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  getChapters: async (className = "Class 10", subject = "Science") => {
    try {
      const res = await fetch(`${API_BASE}/chapters?className=${className}&subject=${subject}`);
      if (!res.ok) throw new Error("Failed to fetch chapters");
      return await res.json();
    } catch (e) {
      console.error("Backend error:", e);
      throw e;
    }
  },

  explainPage: async (chapter, page) => {
    try {
      const res = await fetch(`${API_BASE}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter, page })
      });
      if (!res.ok) throw new Error("Failed to explain page");
      return await res.json();
    } catch (e) {
      console.error("Explain error:", e);
      throw e;
    }
  },

  askDoubt: async (question, chapter, page) => {
    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, chapter, page })
      });
      if (!res.ok) throw new Error("Failed to ask doubt");
      return await res.json();
    } catch (e) {
      console.error("Ask error:", e);
      throw e;
    }
  },

  generateQuiz: async (chapter, page) => {
    try {
      const res = await fetch(`${API_BASE}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapter, page })
      });
      if (!res.ok) throw new Error("Failed to generate quiz");
      return await res.json();
    } catch (e) {
      console.error("Quiz error:", e);
      throw e;
    }
  }
};
