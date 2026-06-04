import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X, Minus, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSupportChat } from '@/components/SupportChatContext';

type MessageRole = 'user' | 'agent';

type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: Date;
};

const AGENT_REPLIES = [
  "Thanks for reaching out! I'll look into that for you right away.",
  "I understand. Let me check your account details and get back to you shortly.",
  "That's a great question. Our team typically resolves order inquiries within one business day.",
  "I've noted your request. Is there anything else I can help you with today?",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'agent',
    text: "Hi Tom! Welcome to Nexus Depository support. How can we help you today?",
    timestamp: new Date(),
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 max-w-[85%]">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
        <Headphones className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1" aria-label="Agent is typing">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.9s' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  const time = message.timestamp.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'flex gap-2 max-w-[85%]',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto',
      )}
    >
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <Headphones className="h-3.5 w-3.5" />
        </div>
      )}
      <div className={cn('flex flex-col gap-1', isUser ? 'items-end' : 'items-start')}>
        <div
          className={cn(
            'px-3.5 py-2.5 text-sm leading-relaxed shadow-sm',
            isUser
              ? 'rounded-2xl rounded-br-md bg-indigo-500 text-white'
              : 'rounded-2xl rounded-bl-md bg-slate-100 text-slate-800',
          )}
        >
          {message.text}
        </div>
        <span className="px-1 text-[10px] text-slate-400">{time}</span>
      </div>
    </div>
  );
}

export function SupportChatWidget() {
  const { isOpen, toggle, close } = useSupportChat();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const replyIndexRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      const timer = window.setTimeout(() => inputRef.current?.focus(), 300);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const delay = 1200 + Math.random() * 800;
    window.setTimeout(() => {
      const reply: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        text: AGENT_REPLIES[replyIndexRef.current % AGENT_REPLIES.length],
        timestamp: new Date(),
      };
      replyIndexRef.current += 1;
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, delay);
  }, [input, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="flex w-[min(100vw-3rem,380px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10"
            style={{ height: 'min(520px, calc(100vh - 8rem))' }}
            role="dialog"
            aria-label="Customer support chat"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-3 bg-slate-900 px-4 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500">
                  <Headphones className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-white">
                    Customer Support
                  </h2>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-xs font-medium text-emerald-400">
                      Agent Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-slate-400 hover:bg-slate-800 hover:text-white"
                  onClick={toggle}
                  aria-label="Minimize chat"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-slate-400 hover:bg-slate-800 hover:text-white"
                  onClick={close}
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-slate-50/80 px-4 py-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="shrink-0 border-t border-slate-200 bg-white p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  disabled={isTyping}
                  className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                  aria-label="Message input"
                />
                <Button
                  size="icon"
                  className="shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
                  onClick={sendMessage}
                  disabled={!input.trim() || isTyping}
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle bubble */}
      <motion.div className="relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          size="icon-lg"
          className={cn(
            'h-14 w-14 rounded-full shadow-lg shadow-indigo-500/30 transition-colors',
            isOpen
              ? 'bg-slate-700 hover:bg-slate-800'
              : 'bg-indigo-500 hover:bg-indigo-600',
          )}
          onClick={toggle}
          aria-label={isOpen ? 'Close support chat' : 'Open support chat'}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                <X className="h-6 w-6 text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.15 }}
              >
                <MessageCircle className="h-6 w-6 text-white" />
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {!isOpen && (
        <span className="pointer-events-none absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white ring-2 ring-white">
          1
        </span>
      )}
    </div>
  );
}
