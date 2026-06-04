"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: Event & { error?: string }) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export function useDashboardVoiceControl() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Intent parsing logic
  const parseIntentAndExecute = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // Example: "Show this month's profit"
    if (lowerText.includes('profit') || lowerText.includes('finance') || lowerText.includes('income')) {
      router.push('/admin/analytics');
      return;
    }

    // Example: "Open inventory spreadsheet"
    if (lowerText.includes('inventory') || lowerText.includes('stock')) {
      router.push('/admin/inventory');
      return;
    }

    // Example: "Go to orders"
    if (lowerText.includes('order')) {
      router.push('/admin/orders');
      return;
    }
    
    // Add more intents as required
  }, [router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setTimeout(() => setError('Speech recognition is not supported in this browser.'), 0);
        return;
      }

      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false; // Set to true if you want live feedback
      rec.lang = 'en-US';

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.results.length - 1; i >= 0; i--) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
            break; // Only take the latest final chunk to avoid massive strings
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          parseIntentAndExecute(finalTranscript);
        }
      };

      rec.onerror = (event: Event & { error?: string }) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error || 'Unknown error');
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setTimeout(() => setRecognition(rec), 0);
    }
  }, [parseIntentAndExecute]);

  const startListening = () => {
    setError(null);
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening
  };
}
