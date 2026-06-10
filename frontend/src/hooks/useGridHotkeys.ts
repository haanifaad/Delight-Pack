import { useEffect } from 'react';

type HotkeyConfig = {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  preventDefault?: boolean;
};

export const useGridHotkeys = (hotkeys: HotkeyConfig[]) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Iterate through configured hotkeys
      for (const hotkey of hotkeys) {
        const matchKey = e.key.toLowerCase() === hotkey.key.toLowerCase();
        const matchAlt = !!hotkey.altKey === e.altKey;
        const matchCtrl = !!hotkey.ctrlKey === (e.ctrlKey || e.metaKey);
        const matchShift = !!hotkey.shiftKey === e.shiftKey;

        if (matchKey && matchAlt && matchCtrl && matchShift) {
          if (hotkey.preventDefault !== false) {
            e.preventDefault();
          }
          hotkey.action();
          return; // Stop after first match
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hotkeys]);
};
