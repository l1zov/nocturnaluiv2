import type { ReactNode } from "react";
import type { themes } from "../themes";

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
    editorTheme: string;
    video?: string;
}

export type ThemeName =
    | "dracula"
    | "tomorrow-night"
    | "github"
    | "glassy"
    | "cobalt"
    | "terminal"
    | "twilight";

export type AvailableThemes = keyof typeof themes;

export interface ThemeContextType {
    currentTheme: Theme;
    themeName: AvailableThemes;
    setTheme: (themeName: AvailableThemes) => void;
    loading: boolean;
}

export interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: AvailableThemes;
}
