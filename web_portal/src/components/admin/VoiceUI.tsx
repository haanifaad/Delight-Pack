'use client';

import React, { useState, useEffect } from 'react';
export default function VoiceUI() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { handleCommand } = useVoiceCommand();

  // Handle Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      handleCommand(text);
      setIsListening(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    // Store recognition instance globally for toggle
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)._recognition = recognition;
  }, [handleCommand]);

  const toggleListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = (window as any)._recognition;
    if (!recognition) return alert("Speech recognition not supported");

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
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
