export interface Tab {
    id: number;
    title: string;
    content: string;
}

export interface RenamingTab {
    id: number;
    title: string;
    initialWidth: number;
}

export interface EditorStyles {
    scrollbar: string;
    suggestions: string;
}

export interface TabBarProps {
    tabs: Tab[];
    activeTab: Tab | null;
    onTabChange: (tab: Tab | null) => void;
    onTabsChange: (tabs: Tab[]) => void;
}

export interface EditorContentProps {
    activeTab: Tab | null;
    onContentChange: (content: string) => void;
    isConnected: boolean;
    onExecute: () => void;
}

export interface EditorControlsProps {
    onClear: () => void;
    onExecute: () => void;
    isConnected: boolean;
}
