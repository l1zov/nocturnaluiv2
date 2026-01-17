import type { Ace } from 'ace-builds';

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
