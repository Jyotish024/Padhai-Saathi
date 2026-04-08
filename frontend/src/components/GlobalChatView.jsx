import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Users, Send, Smile, Info, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

export function GlobalChatView() {
  const { lvl, currentUserName } = useAppStore();
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const endOfMessagesRef = useRef(null);
  const socketRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const userName = (currentUserName || "").trim() || "Guest";
    
    // Determine the API URL (same as api.js)
    const apiUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:8000`;
    
    // Convert http/https to ws/wss
    const wsUrl = apiUrl.replace(/^http/, "ws") + "/ws/chat";
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ user: userName }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "chat") {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              user: data.user,
              level: data.user === userName ? lvl : 1,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.user)}&backgroundColor=dbeafe`,
              text: data.message,
              time: "Just now",
              isOwn: data.user === userName
            }
          ]);
          return;
        }

        if (data.type === "system") {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              user: "System",
              level: 0,
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=System&backgroundColor=e2e8f0",
              text: data.message,
              time: "Just now",
              isOwn: false,
              isSystem: true
            }
          ]);
          return;
        }

        if (data.type === "users") {
          setOnlineUsers(Array.isArray(data.users) ? data.users : []);
        }
      } catch (error) {
        console.error("Invalid chat message payload:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("Chat websocket error:", error);
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [currentUserName, lvl]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (socketRef.current?.readyState !== WebSocket.OPEN) return;
    socketRef.current.send(JSON.stringify({ message: inputValue.trim() }));

    setInputValue("");
  };

  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="bg-white px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 shadow-sm z-10 w-full max-w-5xl mx-auto rounded-t-[40px] mt-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-[14px] flex items-center justify-center text-indigo-500">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              Global Study Room <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></span>
            </h1>
            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-widest mt-0.5">
              <Users className="w-3.5 h-3.5" /> {onlineUsers.length} Students Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <Info className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto bg-white p-8 custom-scrollbar border-x border-slate-100 flex flex-col gap-6">
        
        {/* Date Divider */}
        <div className="w-full flex items-center justify-center mb-4">
          <div className="bg-slate-50 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Today
          </div>
        </div>

        {messages.map((msg) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id} 
            className={`flex w-full ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-4 max-w-[80%] ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar Column */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100">
                  <img src={msg.avatar} alt={msg.user} className="w-full h-full object-cover" />
                </div>
                <div className="mt-1 px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white bg-slate-800">
                  Lvl {msg.level}
                </div>
              </div>

              {/* Message Content */}
              <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-black text-slate-600 tracking-wider">
                    {msg.isOwn ? 'You' : msg.user}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {msg.time}
                  </span>
                </div>
                
                <div className={`
                  px-5 py-3.5 rounded-[24px] text-[15px] font-medium leading-relaxed shadow-sm
                  ${msg.isSystem
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : msg.isOwn 
                    ? 'bg-indigo-500 text-white rounded-tr-sm border border-indigo-600' 
                    : 'bg-slate-50 text-slate-700 rounded-tl-sm border border-slate-100'
                  }
                `}>
                  {msg.text}
                </div>
              </div>

            </div>
          </motion.div>
        ))}
        
        {/* Invisible element to auto-scroll to */}
        <div ref={endOfMessagesRef} className="h-4 w-full shrink-0" />
      </div>

      {/* Input Area */}
      <div className="bg-white p-6 border-t border-slate-100 border-x shrink-0 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-10 w-full max-w-5xl mx-auto rounded-b-[40px] mb-20">
        <form onSubmit={handleSend} className="flex items-end gap-4 relative">
          <div className="flex-1 bg-slate-50 relative rounded-[20px] border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all flex items-center shadow-inner">
            <button type="button" className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors shrink-0">
              <Smile className="w-6 h-6" />
            </button>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question or help a fellow student globally..."
              className="flex-1 bg-transparent border-none outline-none py-4 pr-6 text-slate-700 font-medium placeholder:text-slate-400"
            />
          </div>
          <button 
            type="submit"
            disabled={!inputValue.trim()}
            className="w-14 h-14 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:bg-slate-300 text-white rounded-[20px] flex flex-col items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20 transition-all"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4 text-center">
          Live global chat connected
        </p>
      </div>
    </div>
  );
}
