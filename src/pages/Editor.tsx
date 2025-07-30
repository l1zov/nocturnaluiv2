import React, { useEffect } from 'react';
import AceEditor from 'react-ace';
import { useTheme } from '../context/ThemeContext';
import { invoke } from '@tauri-apps/api/core';

import 'ace-builds/src-noconflict/mode-lua';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/ext-language_tools';
import ace from 'ace-builds';

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
  const { currentTheme } = useTheme();
  const [value, setValue] = React.useState('print("hello from nocturnal")');

  useEffect(() => {
    const langTools = ace.require('ace/ext/language_tools');

    const luaCompleter = {
            getCompletions: async (_editor: any, _session: any, _pos: any, _prefix: any, callback: any) => {
        const suggestions = await fetchSuggestions();
        callback(null, suggestions.map((s: any) => ({
          caption: s.label,
          value: s.label,
          meta: s.detail || 'keyword',
          docHTML: s.documentation,
        })));
      },
    };

    langTools.addCompleter(luaCompleter);

    return () => {
    };
  }, []);

  

  const handleExecute = async () => {
    try {
      await invoke('execute_script_command', { script: value });
    } catch (error) {
      console.error('script not executed:', error);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-transparent">
      <div className="flex items-center p-2 bg-transparent">
        <button
          onClick={handleExecute}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Execute
        </button>
      </div>
      <div className={`flex-1 w-full h-full overflow-hidden`}>
        <AceEditor
          mode="lua"
          theme={currentTheme.editorTheme}
          onChange={(newValue) => setValue(newValue)}
          value={value}
          name="nocturnal_ace_editor"
          height="100%"
          width="100%"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            highlightActiveLine: false,
          }}
        />
      </div>
    </main>
  );
}

