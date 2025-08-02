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
      muted: 'text-[#6272a4]',
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
  editorTheme: 'tomorrow_night', // Changed from 'github' to dark theme
  colors: {
    background: {
      primary: 'bg-[#0d1117]', // Changed to dark GitHub color
      secondary: 'bg-[#161b22]', // Changed to dark GitHub color
      tertiary: 'bg-[#21262d]', // Changed to dark GitHub color
      hover: 'hover:bg-[#21262d]/50',
      active: 'bg-[#21262d]/50',
    },
    text: {
      primary: 'text-[#e6edf3]', // Changed to light text
      secondary: 'text-[#e6edf3]/75',
      tertiary: 'text-[#e6edf3]/50',
      muted: 'text-[#7d8590]', // Changed to GitHub dark muted color
      accent: 'text-[#58a6ff]', // Changed to GitHub blue
    },
    border: {
      primary: 'border-[#30363d]', // Changed to dark border
      secondary: 'border-[#7d8590]',
      accent: 'border-[#58a6ff]', // Changed to GitHub blue
    },
    accent: {
      primary: 'bg-[#58a6ff]', // Changed to GitHub blue
      secondary: 'bg-[#f85149]', // Changed to GitHub red
      success: 'bg-[#3fb950]', // Changed to GitHub green
      warning: 'bg-[#d29922]', // Changed to GitHub yellow
      error: 'bg-[#f85149]', // Changed to GitHub red
    },
    focus: {
      ring: 'focus:ring-[#58a6ff]', // Changed to GitHub blue
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
      muted: 'text-gray-400',
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

export const monokaiTheme: Theme = {
  name: 'monokai',
  editorTheme: 'monokai',
  colors: {
    background: {
      primary: 'bg-[#272822]',
      secondary: 'bg-[#3e3d32]',
      tertiary: 'bg-[#49483e]',
      hover: 'hover:bg-[#49483e]/50',
      active: 'bg-[#49483e]/50',
    },
    text: {
      primary: 'text-[#f8f8f2]',
      secondary: 'text-[#f8f8f2]/75',
      tertiary: 'text-[#f8f8f2]/50',
      muted: 'text-[#75715e]',
      accent: 'text-[#a6e22e]',
    },
    border: {
      primary: 'border-[#49483e]',
      secondary: 'border-[#75715e]',
      accent: 'border-[#a6e22e]',
    },
    accent: {
      primary: 'bg-[#a6e22e]',
      secondary: 'bg-[#f92672]',
      success: 'bg-[#a6e22e]',
      warning: 'bg-[#e6db74]',
      error: 'bg-[#f92672]',
    },
    focus: {
      ring: 'focus:ring-[#a6e22e]',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const solarizedDarkTheme: Theme = {
  name: 'solarized-dark',
  editorTheme: 'solarized_dark',
  colors: {
    background: {
      primary: 'bg-[#002b36]',
      secondary: 'bg-[#073642]',
      tertiary: 'bg-[#586e75]',
      hover: 'hover:bg-[#586e75]/50',
      active: 'bg-[#586e75]/50',
    },
    text: {
      primary: 'text-[#839496]',
      secondary: 'text-[#839496]/75',
      tertiary: 'text-[#839496]/50',
      muted: 'text-[#657b83]',
      accent: 'text-[#268bd2]',
    },
    border: {
      primary: 'border-[#586e75]',
      secondary: 'border-[#657b83]',
      accent: 'border-[#268bd2]',
    },
    accent: {
      primary: 'bg-[#268bd2]',
      secondary: 'bg-[#d33682]',
      success: 'bg-[#859900]',
      warning: 'bg-[#b58900]',
      error: 'bg-[#dc322f]',
    },
    focus: {
      ring: 'focus:ring-[#268bd2]',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const cyberpunkTheme: Theme = {
  name: 'cyberpunk',
  editorTheme: 'vibrant_ink',
  colors: {
    background: {
      primary: 'bg-[#0a0a0a]',
      secondary: 'bg-[#1a1a2e]',
      tertiary: 'bg-[#16213e]',
      hover: 'hover:bg-[#ff00ff]/20',
      active: 'bg-[#ff00ff]/20',
    },
    text: {
      primary: 'text-[#00ffff]',
      secondary: 'text-[#00ffff]/75',
      tertiary: 'text-[#00ffff]/50',
      muted: 'text-[#8892b0]',
      accent: 'text-[#ff00ff]',
    },
    border: {
      primary: 'border-[#ff00ff]',
      secondary: 'border-[#00ffff]',
      accent: 'border-[#ff00ff]',
    },
    accent: {
      primary: 'bg-[#ff00ff]',
      secondary: 'bg-[#00ffff]',
      success: 'bg-[#00ff00]',
      warning: 'bg-[#ffff00]',
      error: 'bg-[#ff0040]',
    },
    focus: {
      ring: 'focus:ring-[#ff00ff]',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const nordTheme: Theme = {
  name: 'nord',
  editorTheme: 'tomorrow_night',
  colors: {
    background: {
      primary: 'bg-[#2e3440]',
      secondary: 'bg-[#3b4252]',
      tertiary: 'bg-[#434c5e]',
      hover: 'hover:bg-[#434c5e]/50',
      active: 'bg-[#434c5e]/50',
    },
    text: {
      primary: 'text-[#eceff4]',
      secondary: 'text-[#eceff4]/75',
      tertiary: 'text-[#eceff4]/50',
      muted: 'text-[#d8dee9]',
      accent: 'text-[#88c0d0]',
    },
    border: {
      primary: 'border-[#434c5e]',
      secondary: 'border-[#d8dee9]',
      accent: 'border-[#88c0d0]',
    },
    accent: {
      primary: 'bg-[#88c0d0]',
      secondary: 'bg-[#81a1c1]',
      success: 'bg-[#a3be8c]',
      warning: 'bg-[#ebcb8b]',
      error: 'bg-[#bf616a]',
    },
    focus: {
      ring: 'focus:ring-[#88c0d0]',
    },
    controls: {
      close: 'bg-red-400',
      minimize: 'bg-yellow-400',
      maximize: 'bg-green-400',
    },
  },
};

export const catppuccinTheme: Theme = {
  name: 'catppuccin',
  editorTheme: 'dracula',
  colors: {
    background: {
      primary: 'bg-[#1e1e2e]',
      secondary: 'bg-[#313244]',
      tertiary: 'bg-[#45475a]',
      hover: 'hover:bg-[#45475a]/50',
      active: 'bg-[#45475a]/50',
    },
    text: {
      primary: 'text-[#cdd6f4]',
      secondary: 'text-[#cdd6f4]/75',
      tertiary: 'text-[#cdd6f4]/50',
      muted: 'text-[#6c7086]',
      accent: 'text-[#cba6f7]',
    },
    border: {
      primary: 'border-[#45475a]',
      secondary: 'border-[#6c7086]',
      accent: 'border-[#cba6f7]',
    },
    accent: {
      primary: 'bg-[#cba6f7]',
      secondary: 'bg-[#f38ba8]',
      success: 'bg-[#a6e3a1]',
      warning: 'bg-[#f9e2af]',
      error: 'bg-[#f38ba8]',
    },
    focus: {
      ring: 'focus:ring-[#cba6f7]',
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
  monokai: monokaiTheme,
  'solarized-dark': solarizedDarkTheme,
  cyberpunk: cyberpunkTheme,
  nord: nordTheme,
  catppuccin: catppuccinTheme,
} as const;
