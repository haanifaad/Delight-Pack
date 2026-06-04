import { useEffect, useRef, useState } from 'react';

export function useBarcodeScanner(onScan: (scannedString: string) => void, bufferTimeoutMs = 100) {
  const [buffer, setBuffer] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'Enter' && buffer.length > 0) {
        e.preventDefault();
        onScan(buffer);
        setBuffer('');
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        return;
      }

      // Allow printable characters
      if (e.key.length === 1) {
        setBuffer((prev) => prev + e.key);
        
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          // If no new keys for the buffer duration, clear it
          // This ensures typing normally doesn't trigger scan
          setBuffer('');
        }, bufferTimeoutMs);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [buffer, onScan, bufferTimeoutMs]);
}
