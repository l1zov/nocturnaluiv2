import { Theme } from '../types/theme';

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: {
      primary: 'bg-zinc-950',
      secondary: 'bg-zinc-900',
      tertiary: 'bg-zinc-800',
      hover: 'hover:bg-white/5',
      active: 'bg-white/5',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-white/75',
      tertiary: 'text-white/50',
      muted: 'text-gray-400',
      accent: 'text-blue-400',
    },
    border: {
      primary: 'border-zinc-800',
      secondary: 'border-zinc-700',
      accent: 'border-blue-400',
    },
    accent: {
      primary: 'bg-blue-500',
      secondary: 'bg-purple-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    },
    focus: {
      ring: 'focus:ring-purple-500',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};


export const pinkPastelTheme: Theme = {
  name: 'pink-pastel',
  colors: {
    background: {
      primary: 'bg-rose-50',
      secondary: 'bg-rose-100',
      tertiary: 'bg-rose-200',
      hover: 'hover:bg-rose-100/50',
      active: 'bg-rose-100/50',
    },
    text: {
      primary: 'text-rose-800',
      secondary: 'text-rose-700',
      tertiary: 'text-rose-500',
      muted: 'text-rose-400',
      accent: 'text-pink-400',
    },
    border: {
      primary: 'border-rose-200',
      secondary: 'border-rose-300',
      accent: 'border-pink-400',
    },
    accent: {
      primary: 'bg-pink-300',
      secondary: 'bg-fuchsia-300',
      success: 'bg-green-400',
      warning: 'bg-yellow-400',
      error: 'bg-red-400',
    },
    focus: {
      ring: 'focus:ring-pink-400',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};


export const darkPinkPastelTheme: Theme = {
  name: 'dark-pink-pastel',
  colors: {
    background: {
      primary: 'bg-rose-200',
      secondary: 'bg-rose-300',
      tertiary: 'bg-rose-400',
      hover: 'hover:bg-rose-300/50',
      active: 'bg-rose-300/50',
    },
    text: {
      primary: 'text-rose-950',
      secondary: 'text-rose-900',
      tertiary: 'text-rose-700',
      muted: 'text-rose-600',
      accent: 'text-pink-600',
    },
    border: {
      primary: 'border-rose-400',
      secondary: 'border-rose-500',
      accent: 'border-pink-600',
    },
    accent: {
      primary: 'bg-pink-400',
      secondary: 'bg-fuchsia-400',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    },
    focus: {
      ring: 'focus:ring-pink-400',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
      hover: 'hover:bg-gray-100',
      active: 'bg-gray-100',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      tertiary: 'text-gray-500',
      muted: 'text-gray-400',
      accent: 'text-blue-600',
    },
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-300',
      accent: 'border-blue-500',
    },
    accent: {
      primary: 'bg-blue-500',
      secondary: 'bg-purple-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    },
    focus: {
      ring: 'focus:ring-blue-500',
    },
    controls: {
      close: 'bg-red-500',
      minimize: 'bg-yellow-500',
      maximize: 'bg-green-500',
    },
  },
};

export const themes = {
  dark: darkTheme,
  light: lightTheme,
  'pink-pastel': pinkPastelTheme,
  'dark-pink-pastel': darkPinkPastelTheme,
} as const;
