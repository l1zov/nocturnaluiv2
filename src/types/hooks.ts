export interface UseHotkeyOptions {
    enabled?: boolean;
    keyEvent?: 'keydown' | 'keyup' | 'keypress';
    enableOnTags?: string[];
    preventDefault?: boolean;
    stopPropagation?: boolean;
    filter?: (event: KeyboardEvent) => boolean;
}


export interface ThemeClassesReturn {
    bg: {
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
    focus: {
        ring: string;
    };
    controls: {
        close: string;
        minimize: string;
        maximize: string;
    };
    combine: (...classes: string[]) => string;
}

export interface ThemeRawColorsReturn {
    background: {
        primary: string;
        secondary: string;
        tertiary: string;
    };
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        accent: string;
    };
    border: {
        primary: string;
        accent: string;
    };
    accent: {
        primary: string;
    };
}
