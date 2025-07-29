export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    hover: string;
    active: string;
  };

  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    accent: string;
  };

  border: {
    primary: string;
    secondary: string;
    accent: string;
  };

  accent: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
  };
  
  // focus ring
  focus: {
    ring: string;
  };
  
  // window controls
  controls: {
    close: string;
    minimize: string;
    maximize: string;
  };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

export type ThemeName = 'dark' | 'light' | 'midnight' | 'ocean';
