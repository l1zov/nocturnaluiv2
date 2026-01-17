import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { invoke } from '@tauri-apps/api/core';
import type { ThemeName, ThemeContextValue } from '../types';
import { themes } from '../themes';
import { settingsService } from '../services';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({ children, defaultTheme = 'default' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const currentTheme = themes[themeName] || themes.default;

  useEffect(() => {
    try {
      const s = settingsService.get();
      if (s.theme && themes[s.theme as ThemeName]) {
        setThemeName(s.theme as ThemeName);
      }
    } catch (e) {
      invoke<string>('load_settings', { key: 'theme' })
        .then(savedTheme => {
          if (savedTheme && themes[savedTheme as ThemeName]) {
            setThemeName(savedTheme as ThemeName);
          }
        })
        .catch(() => { })
    } finally {
      setLoading(false);
    }

    const unsub = settingsService.subscribe((s) => {
      if (s.theme && themes[s.theme as ThemeName]) {
        setThemeName(s.theme as ThemeName);
      }
    });

    return () => unsub && unsub();
  }, []);

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
    try {
      settingsService.setKey('theme', newThemeName);
    } catch (e) { }
    invoke('save_settings', { key: 'theme', value: newThemeName }).catch(() => { });
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeName, setTheme, loading }}>
      {!loading && children}
    </ThemeContext.Provider>
  );
}
