'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dp' | 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dp');

  useEffect(() => {
    // On mount, check if there's a saved theme in localStorage
    const savedTheme = localStorage.getItem('theme-mode') as Theme;
    if (savedTheme && ['dp', 'light', 'dark'].includes(savedTheme)) {
      setTimeout(() => setThemeState(savedTheme), 0);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to dp mode
      setTimeout(() => setThemeState('dp'), 0);
      document.documentElement.setAttribute('data-theme', 'dp');
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme-mode', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
