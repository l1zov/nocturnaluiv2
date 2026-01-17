import type { Theme, ThemeName } from './theme';

export interface ThemeContextValue {
    currentTheme: Theme;
    themeName: ThemeName;
    setTheme: (themeName: ThemeName) => void;
    loading: boolean;
}
