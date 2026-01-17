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
