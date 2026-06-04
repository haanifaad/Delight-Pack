'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function B2BChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "Hello. I am the Delight Pack Smart Assistant. How can I help you with your industrial packaging needs today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: input }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      
      if (data.text) {
        setMessages([...newMessages, { role: 'model', content: data.text }]);
      } else {
        setMessages([...newMessages, { role: 'model', content: "System Error: Unable to process request." }]);
      }
    } catch {
      setMessages([...newMessages, { role: 'model', content: "Network Error: Could not reach the Smart System." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-amber-500 text-black border-4 border-black shadow-[0_10px_25px_rgba(245,158,11,0.5)] hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-7 h-7 fill-black" />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 md:w-96 bg-[#1F2937] border-4 border-black rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-amber-500 p-4 border-b-4 border-black flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-background text-amber-500 p-2 rounded-lg border-2 border-black/20 shadow-inner">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-black text-lg tracking-tight uppercase leading-none">DP Smart System</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 bg-background rounded-full animate-pulse"></div>
                <span className="text-[10px] text-black/80 font-bold tracking-widest uppercase">Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-black/60 hover:text-black transition-colors bg-black/10 hover:bg-black/20 p-1.5 rounded-lg">
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto h-[400px] flex flex-col gap-5 bg-[#111827] shadow-inner">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed border-2 font-medium ${msg.role === 'user' ? 'bg-amber-500 text-black border-black rounded-br-sm shadow-md' : 'bg-[#1F2937] border-zinc-700 text-zinc-200 rounded-bl-sm shadow-lg'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[70%] w-full bg-[#1F2937] border-2 border-zinc-700 rounded-2xl rounded-bl-sm p-3.5 shadow-lg flex flex-col gap-2">
                 <div className="h-2 w-full bg-zinc-700 rounded overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 animate-[shimmer_1.5s_infinite] -translate-x-full"></div>
                 </div>
                 <div className="h-2 w-3/4 bg-zinc-700 rounded overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 animate-[shimmer_1.5s_infinite] -translate-x-full"></div>
                 </div>
                 <div className="h-2 w-1/2 bg-zinc-700 rounded overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-0 w-full bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700 animate-[shimmer_1.5s_infinite] -translate-x-full"></div>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-[#1F2937] border-t-4 border-black">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about boxes & printing..."
              className="w-full bg-[#111827] border-2 border-zinc-600 focus:border-amber-500 rounded-xl pl-4 pr-12 py-3.5 text-sm text-foreground font-medium focus:outline-none transition-colors shadow-inner placeholder-zinc-500"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2.5 bg-amber-500 hover:bg-amber-400 border-2 border-black rounded-lg text-black disabled:opacity-50 disabled:hover:bg-amber-500 transition-colors shadow-sm"
            >
              <Send className="w-4 h-4 stroke-[3]" />
            </button>
          </form>
        </div>
      </div>
      
      {/* Global styles for the shimmer effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </>
  );
}

