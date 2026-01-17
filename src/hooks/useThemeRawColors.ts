import { useTheme } from '../context/ThemeContext';
import type { ThemeRawColorsReturn } from '../types';

function extractColor(cssClass: string): string {
  if (!cssClass) return '';
  const match = cssClass.match(/#([a-fA-F0-9]{6,8}|[a-fA-F0-9]{3})|rgb\(.*?\)|rgba\(.*?\)|hsl\(.*?\)|hsla\(.*?\)|transparent|currentColor/);
  return match ? match[0] : '';
}

export function useThemeRawColors(): ThemeRawColorsReturn {
  const { currentTheme } = useTheme();
  const { colors } = currentTheme;

  const rawColors = {
    background: {
      primary: extractColor(colors.background.primary),
      secondary: extractColor(colors.background.secondary),
      tertiary: extractColor(colors.background.tertiary),
    },
    text: {
      primary: extractColor(colors.text.primary),
      secondary: extractColor(colors.text.secondary),
      tertiary: extractColor(colors.text.tertiary),
      accent: extractColor(colors.text.accent),
    },
    border: {
      primary: extractColor(colors.border.primary),
      accent: extractColor(colors.border.accent),
    },
    accent: {
      primary: extractColor(colors.accent.primary),
    }
  };

  return rawColors;
}
