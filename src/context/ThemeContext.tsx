import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Theme } from '../types/theme';
import { themes } from '../themes';

type AvailableThemes = keyof typeof themes;

interface ThemeContextType {
  currentTheme: Theme;
  themeName: AvailableThemes;
  setTheme: (themeName: AvailableThemes) => void;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: AvailableThemes;
}

export function ThemeProvider({ children, defaultTheme = 'dracula' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<AvailableThemes>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const currentTheme = themes[themeName];

  useEffect(() => {
    // Check if we're in Tauri environment
    const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;
    
    if (isTauri) {
      // Use Tauri for desktop app
      invoke<string>('load_settings', { key: 'theme' })
        .then(savedTheme => {
          if (savedTheme && themes[savedTheme as AvailableThemes]) {
            setThemeName(savedTheme as AvailableThemes);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      // Use localStorage for web version
      const savedTheme = localStorage.getItem('selectedTheme');
      if (savedTheme && themes[savedTheme as AvailableThemes]) {
        setThemeName(savedTheme as AvailableThemes);
      }
      setLoading(false);
    }
  }, []);

  const setTheme = (newThemeName: AvailableThemes) => {
    setThemeName(newThemeName);
    
    // Check if we're in Tauri environment
    const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;
    
    if (isTauri) {
      // Use Tauri for desktop app
      invoke('save_settings', { key: 'theme', value: newThemeName }).catch(console.error);
    } else {
      // Use localStorage for web version
      localStorage.setItem('selectedTheme', newThemeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeName, setTheme, loading }}>
      {!loading && children}
    </ThemeContext.Provider>
  );
}
