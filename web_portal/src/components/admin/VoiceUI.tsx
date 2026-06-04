'use client';

import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useDashboardVoiceControl } from '@/lib/hooks/useDashboardVoiceControl';

export default function VoiceUI() {
  const { isListening, transcript, startListening, stopListening, error } = useDashboardVoiceControl();

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      {error && (
        <div className="bg-red-500 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      {transcript && (
        <div className="bg-zinc-800 text-foreground text-sm px-4 py-2 rounded-lg shadow-lg border border-zinc-700 animate-fade-in">
          &quot;{transcript}&quot;
        </div>
      )}
      <button 
        onClick={toggleListening}
        className={`p-4 rounded-full shadow-2xl transition-all ${isListening ? 'bg-red-500 animate-pulse scale-110' : 'bg-blue-600 hover:bg-blue-500'} text-foreground border-4 border-black/20`}
        title="Admin Voice Command"
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>
    </div>
  );
}
