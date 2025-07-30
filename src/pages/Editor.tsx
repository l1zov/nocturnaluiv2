import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { autocompletion, CompletionContext, acceptCompletion, completionStatus } from '@codemirror/autocomplete';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { keymap } from '@codemirror/view';
import { indentMore } from '@codemirror/commands';
import { invoke } from '@tauri-apps/api/core';

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

async function luaCompletions(context: CompletionContext) {
  const word = context.matchBefore(/\w*/);
  if (!word || (word.from === word.to && !context.explicit)) {
    return null;
  }

  const allSuggestions = await fetchSuggestions();

  const filteredSuggestions = allSuggestions.filter(s => 
    s.label && typeof s.label === 'string' && s.label.toLowerCase().startsWith(word.text.toLowerCase())
  );

  if (filteredSuggestions.length === 0) {
    return null;
  }

  return {
    from: word.from,
    options: filteredSuggestions.map((s) => ({
      label: s.label,
      type: s.detail || 'keyword',
      info: s.documentation,
    })),
  };
}

const luaCompletionExtension = autocompletion({ override: [luaCompletions] });

export function Editor() {
  const theme = useThemeClasses();
  const [value, setValue] = React.useState('print("hello from nocturnal")');

  const onChange = React.useCallback((val: string) => {
    setValue(val);
  }, []);

  return (
    <main className="flex-1 flex flex-col p-4 bg-transparent">
      <div className={`flex-1 w-full h-full rounded-md overflow-hidden border ${theme.border.primary}`}>
        <CodeMirror
          value={value}
          height="100%"
          extensions={[luaCompletionExtension, keymap.of([{
            key: "Tab",
            run: (e) => {
              if (completionStatus(e.state) === "active") {
                return acceptCompletion(e);
              }
              return indentMore(e);
            },
          }])]}
          onChange={onChange}
          theme="dark"
        />
      </div>
    </main>
  );
}
