import { Theme } from '../types/theme';

export const draculaTheme: Theme = {
  name: 'dracula',
  editorTheme: 'dracula',
  colors: {
    background: {
      primary: 'bg-[#282a36]',
      secondary: 'bg-[#3a3c4e]',
      tertiary: 'bg-[#44475a]',
      hover: 'hover:bg-[#44475a]/50',
      active: 'bg-[#44475a]/50',
    },
    text: {
      primary: 'text-[#f8f8f2]',
      secondary: 'text-[#f8f8f2]/75',
      tertiary: 'text-[#f8f8f2]/50',
      muted: 'text-[#818ba9]',
      accent: 'text-[#bd93f9]',
    },
    border: {
      primary: 'border-[#44475a]',
      secondary: 'border-[#6272a4]',
      accent: 'border-[#bd93f9]',
    },
    accent: {
      primary: 'bg-[#bd93f9]',
      secondary: 'bg-[#ff79c6]',
      success: 'bg-[#50fa7b]',
      warning: 'bg-[#f1fa8c]',
      error: 'bg-[#ff5555]',
    },
    focus: {
      ring: 'focus:ring-[#bd93f9]',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const tomorrowNightTheme: Theme = {
  name: 'tomorrow-night',
  editorTheme: 'tomorrow_night',
  colors: {
    background: {
      primary: 'bg-[#1d1f21]',
      secondary: 'bg-[#282a2e]',
      tertiary: 'bg-[#373b41]',
      hover: 'hover:bg-[#373b41]/50',
      active: 'bg-[#373b41]/50',
    },
    text: {
      primary: 'text-[#c5c8c6]',
      secondary: 'text-[#c5c8c6]/75',
      tertiary: 'text-[#c5c8c6]/50',
      muted: 'text-[#969896]',
      accent: 'text-[#81a2be]',
    },
    border: {
      primary: 'border-[#373b41]',
      secondary: 'border-[#969896]',
      accent: 'border-[#81a2be]',
    },
    accent: {
      primary: 'bg-[#81a2be]',
      secondary: 'bg-[#b294bb]',
      success: 'bg-[#b5bd68]',
      warning: 'bg-[#f0c674]',
      error: 'bg-[#cc6666]',
    },
    focus: {
      ring: 'focus:ring-[#81a2be]',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const githubTheme: Theme = {
  name: 'github',
  editorTheme: 'github',
  colors: {
    background: {
      primary: 'bg-[#ffffff]',
      secondary: 'bg-[#f5f5f5]',
      tertiary: 'bg-[#e8e8e8]',
      hover: 'hover:bg-[#e8e8e8]/50',
      active: 'bg-[#e8e8e8]/50',
    },
    text: {
      primary: 'text-[#000000]',
      secondary: 'text-[#000000]/75',
      tertiary: 'text-[#000000]/50',
      muted: 'text-[#808072]',
      accent: 'text-[#0086B3]',
    },
    border: {
      primary: 'border-[#e8e8e8]',
      secondary: 'border-[#998]',
      accent: 'border-[#0086B3]',
    },
    accent: {
      primary: 'bg-[#0086B3]',
      secondary: 'bg-[#D14]',
      success: 'bg-[#099]',
      warning: 'bg-[#009926]',
      error: 'bg-[#D14]',
    },
    focus: {
      ring: 'focus:ring-[#0086B3]',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const glassyTheme: Theme = {
  name: 'glassy',
  editorTheme: 'tomorrow_night',
  colors: {
    background: {
      primary: 'bg-zinc-900/70 backdrop-blur-xl',
      secondary: 'bg-zinc-800/60 backdrop-blur-xl',
      tertiary: 'bg-zinc-700/50 backdrop-blur-xl',
      hover: 'hover:bg-white/10',
      active: 'bg-white/10',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-white/80',
      tertiary: 'text-white/60',
      muted: 'text-gray-500',
      accent: 'text-cyan-400',
    },
    border: {
      primary: 'border-white/20',
      secondary: 'border-white/10',
      accent: 'border-cyan-400',
    },
    accent: {
      primary: 'bg-cyan-500',
      secondary: 'bg-teal-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    },
    focus: {
      ring: 'focus:ring-cyan-500',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const cobaltTheme: Theme = {
  name: 'cobalt',
  editorTheme: 'cobalt',
  colors: {
    background: {
      primary: 'bg-[#002240]',
      secondary: 'bg-[#011e3a]',
      tertiary: 'bg-[rgba(0,0,0,0.35)]',
      hover: 'hover:bg-[rgba(0,0,0,0.50)]',
      active: 'bg-[rgba(0,0,0,0.50)]',
    },
    text: {
      primary: 'text-[#FFFFFF]',
      secondary: 'text-[#FFFFFF]/75',
      tertiary: 'text-[#FFFFFF]/50',
      muted: 'text-[#96a3af]',
      accent: 'text-[#FF9D00]',
    },
    border: {
      primary: 'border-[#003366]',
      secondary: 'border-[rgb(128,145,160)]',
      accent: 'border-[#FF9D00]',
    },
    accent: {
      primary: 'bg-[#FF9D00]',
      secondary: 'bg-[#FF628C]',
      success: 'bg-[#3AD900]',
      warning: 'bg-[#FFB054]',
      error: 'bg-[#FF628C]',
    },
    focus: {
      ring: 'focus:ring-[#FF9D00]',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const terminalTheme: Theme = {
  name: 'terminal',
  editorTheme: 'terminal',
  colors: {
    background: {
      primary: 'bg-black',
      secondary: 'bg-[#1a0005]',
      tertiary: 'bg-[#2A2A2A]',
      hover: 'hover:bg-[#2A2A2A]/50',
      active: 'bg-[#2A2A2A]/50',
    },
    text: {
      primary: 'text-[#DEDEDE]',
      secondary: 'text-[#DEDEDE]/75',
      tertiary: 'text-[#DEDEDE]/50',
      muted: 'text-steelblue',
      accent: 'text-tomato',
    },
    border: {
      primary: 'border-[#2A2A2A]',
      secondary: 'border-steelblue',
      accent: 'border-tomato',
    },
    accent: {
      primary: 'bg-tomato',
      secondary: 'bg-deeppink',
      success: 'bg-[#B9CA4A]',
      warning: 'bg-[#E78C45]',
      error: 'bg-red-500',
    },
    focus: {
      ring: 'focus:ring-tomato',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const twilightTheme: Theme = {
  name: 'twilight',
  editorTheme: 'twilight',
  colors: {
    background: {
      primary: 'bg-[#141414]',
      secondary: 'bg-[#232323]',
      tertiary: 'bg-[rgba(255,255,255,0.031)]',
      hover: 'hover:bg-[rgba(255,255,255,0.05)]',
      active: 'bg-[rgba(255,255,255,0.05)]',
    },
    text: {
      primary: 'text-[#F8F8F8]',
      secondary: 'text-[#F8F8F8]/75',
      tertiary: 'text-[#F8F8F8]/50',
      muted: 'text-[#827e83]',
      accent: 'text-[#CDA869]',
    },
    border: {
      primary: 'border-[#232323]',
      secondary: 'border-[#5F5A60]',
      accent: 'border-[#CDA869]',
    },
    accent: {
      primary: 'bg-[#CDA869]',
      secondary: 'bg-[#F9EE98]',
      success: 'bg-[#8F9D6A]',
      warning: 'bg-[#DAD085]',
      error: 'bg-[#CF6A4C]',
    },
    focus: {
      ring: 'focus:ring-[#CDA869]',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const themes = {
  dracula: draculaTheme,
  'tomorrow-night': tomorrowNightTheme,
  github: githubTheme,
  glassy: glassyTheme,
  cobalt: cobaltTheme,
  terminal: terminalTheme,
  twilight: twilightTheme,
} as const;
