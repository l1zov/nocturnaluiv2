import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Theme } from '../types/theme';
import { themes } from '../themes';
import { settingsService } from '../services';

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

export function ThemeProvider({ children, defaultTheme = 'default' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<AvailableThemes>(defaultTheme);
  const [loading, setLoading] = useState(true);
  const currentTheme = themes[themeName] || themes.default;

  useEffect(() => {
    try {
      const s = settingsService.get();
      if (s.theme && themes[s.theme as AvailableThemes]) {
        setThemeName(s.theme as AvailableThemes);
      }
    } catch (e) {
      invoke<string>('load_settings', { key: 'theme' })
        .then(savedTheme => {
          if (savedTheme && themes[savedTheme as AvailableThemes]) {
            setThemeName(savedTheme as AvailableThemes);
          }
        })
        .catch(() => {})
    } finally {
      setLoading(false);
    }

    const unsub = settingsService.subscribe((s) => {
      if (s.theme && themes[s.theme as AvailableThemes]) {
        setThemeName(s.theme as AvailableThemes);
      }
    });

    return () => unsub && unsub();
  }, []);

  const setTheme = (newThemeName: AvailableThemes) => {
    setThemeName(newThemeName);
    try {
      settingsService.setKey('theme', newThemeName);
    } catch (e) {}
    invoke('save_settings', { key: 'theme', value: newThemeName }).catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, themeName, setTheme, loading }}>
      {!loading && children}
    </ThemeContext.Provider>
  );
}
