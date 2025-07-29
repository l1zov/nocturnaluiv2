import { useTheme } from '../context/ThemeContext';

export function useThemeClasses() {
  const { currentTheme } = useTheme();
  const { colors } = currentTheme;
  
  return {
    bg: {
      primary: colors.background.primary,
      secondary: colors.background.secondary,
      tertiary: colors.background.tertiary,
      hover: colors.background.hover,
      active: colors.background.active,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      tertiary: colors.text.tertiary,
      muted: colors.text.muted,
      accent: colors.text.accent,
    },
    border: {
      primary: colors.border.primary,
      secondary: colors.border.secondary,
      accent: colors.border.accent,
    },
    accent: {
      primary: colors.accent.primary,
      secondary: colors.accent.secondary,
      success: colors.accent.success,
      warning: colors.accent.warning,
      error: colors.accent.error,
    },
    focus: {
      ring: colors.focus.ring,
    },
    controls: {
      close: colors.controls.close,
      minimize: colors.controls.minimize,
      maximize: colors.controls.maximize,
    },
    combine: (...classes: string[]) => classes.filter(Boolean).join(' '),
  };
}
