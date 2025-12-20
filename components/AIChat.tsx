
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Loader2 } from 'lucide-react';
import { getChatResponse } from '../services/gemini';
import { ChatMessage } from '../types';
import LatexRenderer from './LatexRenderer';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'welcome',
    role: 'model',
    text: "Hi Cheenu! I'm ALOO, your JEE mentor. Ready to master the laws of physics or crack some complex equations? Let's get you to that IIT!",
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => { 
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: ChatMessage = { 
      id: crypto.randomUUID(), 
      role: 'user', 
      text: input, 
      timestamp: new Date() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);
    
    try {
      const history = messages.map(m => ({ 
        role: m.role, 
        parts: [{ text: m.text }] 
      }));
      
      const responseText = await getChatResponse(history, currentInput);
      
      const modelMsg: ChatMessage = { 
        id: crypto.randomUUID(), 
        role: 'model', 
        text: responseText || "I'm having trouble connecting to the logic core, Cheenu. Try again.", 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      setMessages(prev => [...prev, { 
        id: crypto.randomUUID(), 
        role: 'model', 
        text: "Deep sync error with ALOO's core. Please try again, Cheenu.", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={`fixed bottom-6 right-6 p-5 md:p-6 bg-blue-600 text-white rounded-[2rem] shadow-2xl transition-all z-[100] hover:scale-110 active:scale-90 ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Open ALOO Chat"
      >
        <MessageSquare size={28} />
      </button>

      <div className={`fixed bottom-6 right-6 w-[92vw] sm:w-[400px] h-[80vh] sm:h-[600px] bg-slate-950 glass-card rounded-[2.5rem] z-[100] flex flex-col transition-all duration-500 origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        <div className="p-5 md:p-6 bg-slate-900/80 rounded-t-[2.5rem] flex justify-between items-center border-b border-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl">
              <Bot size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">ALOO AI</span>
              <span className="text-[9px] text-slate-500 font-bold">JEE Mentor</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[88%] p-4 rounded-2xl text-[13px] font-medium leading-relaxed shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-900/90 text-slate-300 border border-slate-800 rounded-tl-none'
              }`}>
                <LatexRenderer text={msg.text} />
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800/50 flex items-center gap-2">
                <Loader2 size={12} className="animate-spin text-blue-500" />
                <span className="text-blue-500/70 text-[10px] font-bold uppercase tracking-widest">ALOO is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 md:p-5 border-t border-blue-500/10 bg-slate-900/50 backdrop-blur-md">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex gap-3"
          >
            <input 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Solve a doubt, Cheenu..." 
              className="flex-1 bg-slate-950 border border-slate-800 text-white px-5 py-3 rounded-2xl focus:outline-none focus:border-blue-500/50 text-[13px] placeholder:text-slate-700" 
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping} 
              className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all disabled:opacity-20 flex items-center justify-center"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIChat;
