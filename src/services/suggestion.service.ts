import { createSingleton } from './base';
import { suggestions } from './suggestions';
import type { AceCompletion } from '../types';

export interface RawSuggestion {
    caption: string;
    value: string;
    meta: string;
    snippet?: string;
    docText?: string;
}

class SuggestionServiceClass {
    private suggestions: AceCompletion[] = [];
    private loaded = false;

    async loadSuggestions(): Promise<void> {
        if (this.loaded) return;

        try {
            this.suggestions = this.buildSuggestions();
            this.loaded = true;
        } catch (error) {
            console.error('[SuggestionService.load]', error);
        }
    }

    // get all suggestions
    getSuggestions(): AceCompletion[] {
        return this.suggestions;
    }

    // check if suggestions are loaded
    isLoaded(): boolean {
        return this.loaded;
    }

    private buildSuggestions(): AceCompletion[] {
        return (suggestions as RawSuggestion[]).map((item) => ({
            caption: item.caption,
            value: item.snippet ?? item.value,
            meta: item.meta,
            docHTML: item.docText ? `<p>${item.docText}</p>` : undefined,
        }));
    }
}

const getSuggestionService = createSingleton(() => new SuggestionServiceClass());

export const suggestionService = getSuggestionService();
