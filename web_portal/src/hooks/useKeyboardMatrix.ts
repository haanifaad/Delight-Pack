import { useEffect } from 'react';

interface KeyboardMatrixOptions {
  isFocused: boolean;
  onAltC: () => void;
  onEsc: () => void;
}

export function useKeyboardMatrix({ isFocused, onAltC, onEsc }: KeyboardMatrixOptions) {
  useEffect(() => {
    if (!isFocused) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Prevent F5 (Refresh)
      if (e.key === 'F5') {
        e.preventDefault();
        console.warn('Refresh disabled in Ledger mode.');
      }

      // Prevent Ctrl+P / Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        console.warn('Print disabled in Ledger mode.');
      }

      // Prevent Ctrl+R / Cmd+R (Reload)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
      }

      // Custom Shortcut: Alt + C -> Create Ledger Entry
      if (e.altKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        onAltC();
      }

      // Custom Shortcut: Esc -> Cancel edit
      if (e.key === 'Escape') {
        e.preventDefault();
        onEsc();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
    };
  }, [isFocused, onAltC, onEsc]);
}
