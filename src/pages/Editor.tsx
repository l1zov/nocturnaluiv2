import React, { useEffect, useRef } from 'react';
import MonacoEditor, { OnMount } from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { invoke } from '@tauri-apps/api/core';
import type * as monaco from 'monaco-editor';

let suggestionCache: any[] = [];
let suggestionsFetched = false;

async function fetchSuggestions(): Promise<any[]> {
  if (suggestionsFetched) {
    return suggestionCache;
  }
  try {
    const data: any = await invoke('fetch_suggestions_command');
    if (data && typeof data === 'object') {
      const combinedSuggestions = [
        ...(data.class || []),
        ...(data.function || []),
        ...(data.method || []),
        ...(data.property || []),
      ];
      suggestionCache = combinedSuggestions;
    } else {
      suggestionCache = [];
    }
    suggestionsFetched = true;
    return suggestionCache;
  } catch (error) {
    console.error(error);
    suggestionsFetched = true;
    suggestionCache = [];
    return [];
  }
}

fetchSuggestions();

export function Editor() {
  const { themeName } = useTheme();
  const theme = useThemeClasses();
  const [value, setValue] = React.useState('print("hello from nocturnal")');
  const completionProviderRef = useRef<monaco.IDisposable | null>(null);

    const handleEditorDidMount: OnMount = (_editor, monaco) => {
    if (completionProviderRef.current) {
      completionProviderRef.current.dispose();
    }

    completionProviderRef.current = monaco.languages.registerCompletionItemProvider('lua', {
      provideCompletionItems: async (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const allSuggestions = await fetchSuggestions();
        
        const monacoSuggestions = allSuggestions.map(s => ({
          label: s.label,
          kind: monaco.languages.CompletionItemKind.Keyword, // Or map from s.detail
          insertText: s.label,
          documentation: s.documentation,
          range: range,
        }));

        return {
          suggestions: monacoSuggestions,
        };
      },
    });
  };

  useEffect(() => {
    return () => {
      completionProviderRef.current?.dispose();
    };
  }, []);

  return (
    <main className="flex-1 flex flex-col p-4 bg-transparent">
      <div className={`flex-1 w-full h-full rounded-md overflow-hidden border ${theme.border.primary}`}>
                <MonacoEditor
          height="100%"
          language="lua"
          value={value}
          onMount={handleEditorDidMount}
          onChange={(newValue: string | undefined) => setValue(newValue || '')}
          theme={themeName.includes('dark') || themeName.includes('glassy') ? 'vs-dark' : 'vs-light'}
                    loading={<div style={{ height: '100%', backgroundColor: themeName.includes('dark') || themeName.includes('glassy') ? '#1e1e1e' : '#ffffff' }} />}
          options={{
            renderLineHighlight: 'none',
            renderLineHighlightOnlyWhenFocus: true,
          }}
        />
      </div>
    </main>
  );
}
