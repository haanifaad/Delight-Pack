'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { Moon, Sun, Monitor } from 'lucide-react'; // Fallback icons if DP logo isn't easily available as an icon

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'dp') setTheme('light');
    else if (theme === 'light') setTheme('dark');
    else setTheme('dp');
  };

  return (
    <button
      onClick={cycleTheme}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-card shadow-lg border border-border text-foreground hover:scale-105 active:scale-95 transition-all"
      aria-label="Toggle Theme"
      title={`Current Theme: ${theme.toUpperCase()}`}
    >
      {theme === 'dp' && <Monitor className="w-6 h-6 text-primary" />}
      {theme === 'light' && <Sun className="w-6 h-6" />}
      {theme === 'dark' && <Moon className="w-6 h-6" />}
      
      {/* Small badge to indicate DP mode */}
      {theme === 'dp' && (
        <span className="absolute -top-1 -right-1 bg-secondary text-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
          DP
        </span>
      )}
    </button>
  );
}
