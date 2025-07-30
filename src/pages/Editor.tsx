import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../hooks/useThemeClasses';
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
  const theme = useThemeClasses();
  const [value, setValue] = React.useState('print("hello from nocturnal")');
  const [isConnected, setIsConnected] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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

    const checkConnection = async () => {
      try {
        const connected = await invoke('check_connection_command');
        setIsConnected(connected as boolean);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  

  const handleExecute = async () => {
    if (!isConnected) return;
    try {
      await invoke('execute_script_command', { script: value });
    } catch (error) {
      console.error('script not executed:', error);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-transparent">
      <div className={`flex-1 w-full h-full overflow-hidden mt-2`}>
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
            fontFamily: 'Fira Code',
            fontSize: 16,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            highlightActiveLine: false,
            wrap: true,
          }}
        />
      </div>

      <div
        className={theme.combine(
          "flex items-center justify-end p-2 border-t",
          theme.border.primary
        )}
      >
        <button
          onClick={handleExecute}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          disabled={!isConnected}
          style={{
            backgroundColor:
              isConnected
                ? isPressed
                  ? currentTheme.colors.background.active
                  : currentTheme.colors.accent.primary
                : currentTheme.colors.background.tertiary,
            color: isConnected ? currentTheme.colors.text.primary : currentTheme.colors.text.muted,
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 500,
            border: 'none',
            cursor: isConnected ? 'pointer' : 'not-allowed',
            opacity: isConnected ? 1 : 0.5,
            transform: isPressed && isConnected ? 'scale(0.92)' : 'scale(1)',
            transition: 'transform 0.1s ease, background-color 0.2s ease',
          }}
        >
          Execute
        </button>
      </div>
    </main>
  );
}

