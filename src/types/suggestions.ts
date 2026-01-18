import type { Ace } from 'ace-builds';

export interface Suggestion {
    label: string;
    detail: string;
    documentation: string;
}

export type SuggestionCategory =
    | 'function'
    | 'method'
    | 'property'
    | 'keyword'
    | 'variable'
    | 'class'
    | 'module'
    | 'snippet';

export type SuggestionsData = {
    [K in SuggestionCategory]?: Suggestion[];
};


export type AceCompleterCallback = (
    error: Error | null,
    completions: AceCompletion[]
) => void;

export interface AceCompletion {
    caption: string;
    value: string;
    meta: string;
    docHTML?: string;
    score?: number;
}

export interface AceCompleter {
    getCompletions: (
        editor: Ace.Editor,
        session: Ace.EditSession,
        pos: Ace.Point,
        prefix: string,
        callback: AceCompleterCallback
    ) => void;
}

export interface AceLangTools {
    addCompleter: (completer: AceCompleter) => void;
    setCompleters: (completers: AceCompleter[]) => void;
}
