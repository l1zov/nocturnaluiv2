import type { ReactNode } from 'react';
import type { Tab, RenamingTabState } from './tabs';
import type { ThemeClassesReturn, ThemeRawColorsReturn } from './hooks';

export interface SortableTabProps {
    tab: Tab;
    isActive: boolean;
    isRenaming: boolean;
    renamingTab: RenamingTabState | null;
    theme: ThemeClassesReturn;
    rawColors: ThemeRawColorsReturn;
    onTabClick: (id: number) => void;
    onTabDoubleClick: (id: number, title: string, initialWidth: number) => void;
    onRenameChange: (title: string) => void;
    onRenameSubmit: () => void;
    onRenameCancel: () => void;
}

export interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: string;
}

export interface TrafficLightIconProps {
    className?: string;
}

export interface NavLink {
    href: string;
    label: string;
    icon?: ReactNode;
}

export interface UpdateItem {
    version: string;
    description: string;
}
