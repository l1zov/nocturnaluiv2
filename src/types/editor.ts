import type { Ace } from 'ace-builds';
import type { Tab, RenamingTabState } from './tabs';
import type { Theme } from './theme';
import type { ThemeClassesReturn, ThemeRawColorsReturn } from './hooks';

export type AceEditorInstance = Ace.Editor;

export type AceSession = Ace.EditSession;

export interface AcePosition {
    row: number;
    column: number;
}

export interface AceCommand {
    name: string;
    bindKey: {
        win?: string;
        mac?: string;
    };
    exec: (editor: AceEditorInstance) => void;
}

export interface EditorSettings {
    fontFamily: string;
    fontSize: number;
    showLineNumbers: boolean;
    enableBasicAutocompletion: boolean;
    enableLiveAutocompletion: boolean;
    highlightActiveLine: boolean;
    wrap: boolean;
    showPrintMargin: boolean;
}

export interface AceEditorProps {
    mode: string;
    theme: string;
    onChange: (value: string) => void;
    onLoad?: (editor: AceEditorInstance) => void;
    value: string;
    name: string;
    height?: string;
    width?: string;
    showPrintMargin?: boolean;
    showGutter?: boolean;
    editorProps?: Record<string, unknown>;
    setOptions?: Partial<EditorSettings>;
}

export interface TabBarProps {
    tabs: Tab[];
    activeTabId: number | null;
    renamingTab: RenamingTabState | null;
    onTabClick: (id: number) => void;
    onTabDoubleClick: (id: number, title: string, initialWidth: number) => void;
    onRenameChange: (title: string) => void;
    onRenameSubmit: () => void;
    onRenameCancel: () => void;
    onAddTab: () => void;
    onReorderTabs: (tabIds: number[]) => void;
    onContextMenu: (tab: Tab, x: number, y: number) => void;
}

export interface SortableTabItemProps {
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
    onContextMenu: (tab: Tab, x: number, y: number) => void;
}

export interface TabContextMenuProps {
    tab: Tab;
    x: number;
    y: number;
    tabCount: number;
    onClose: () => void;
    onRename: (id: number, title: string) => void;
    onDuplicate: (tab: Tab) => void;
    onCloseTab: (id: number) => void;
    onCloseOtherTabs: (id: number) => void;
    onCloseAllTabs: () => void;
}

export interface AceEditorComponentProps {
    content: string;
    editorTheme: string;
    fontFamily: string;
    fontSize: number;
    showLineNumbers: boolean;
    onContentChange: (content: string) => void;
    onExecute: () => void;
}

export interface EditorToolbarProps {
    isConnected: boolean;
    theme: Theme;
    onClear: () => void;
    onExecute: () => void;
}

export interface ContextMenuState {
    tab: Tab;
    x: number;
    y: number;
}
