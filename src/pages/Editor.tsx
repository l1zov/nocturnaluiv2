import { useEffect, useState } from 'react';
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
  const [tabs, setTabs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<any>(null);
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

    const initTabs = async () => {
      try {
        const initialTabs = await invoke('get_tabs');
        const initialActiveTab = await invoke('get_active_tab');
        setTabs(initialTabs as any[]);
        setActiveTab(initialActiveTab);
      } catch (error) {
        console.error("get tabs error:", error);
      }
    };

    initTabs();

    return () => {
      clearInterval(interval);
    };
  }, []);

  

  const handleEditorChange = (newContent: string) => {
    if (!activeTab) return;

    const updatedActiveTab = { ...activeTab, content: newContent };
    setActiveTab(updatedActiveTab);

    setTabs(tabs.map(tab => tab.id === activeTab.id ? updatedActiveTab : tab));

    invoke('update_tab_content', { id: activeTab.id, content: newContent });
  };

  const handleAddTab = async () => {
    try {
      const newTab = await invoke('add_tab');
      const updatedTabs: any = await invoke('get_tabs');
      setTabs(updatedTabs);
      setActiveTab(newTab);
    } catch (error) {
      console.error("add tab error:", error);
    }
  };

  const handleTabClick = async (id: number) => {
    try {
      await invoke('set_active_tab', { id });
      const newActiveTab = tabs.find(t => t.id === id);
      if (newActiveTab) {
        setActiveTab(newActiveTab);
      }
    } catch (error) {
      console.error("active tab error:", error);
    }
  };

  const handleCloseTab = async (id: number) => {
    try {
      const updatedTabs: any = await invoke('close_tab', { id });
      setTabs(updatedTabs);
      if (updatedTabs.length > 0) {
        const newActiveTab = await invoke('get_active_tab');
        setActiveTab(newActiveTab);
      } else {
        setActiveTab(null);
      }
    } catch (error) {
      console.error("close tab error:", error);
    }
  };

  const handleExecute = async () => {
    if (!isConnected || !activeTab) return;
    try {
      await invoke('execute_script_command', { script: activeTab.content });
    } catch (error) {
      console.error('script not executed:', error);
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-transparent">
      <div className="flex items-center border-b border-gray-700">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center px-4 py-2 cursor-pointer text-sm ${activeTab?.id === tab.id ? 'bg-gray-800 border-b-2 border-blue-500' : 'hover:bg-gray-700'}`}>
            <span>{tab.title}</span>
            <button onClick={(e) => { e.stopPropagation(); handleCloseTab(tab.id); }} className="ml-2 text-gray-400 hover:text-white">x</button>
          </div>
        ))}
        <button onClick={handleAddTab} className="px-3 py-2 text-sm hover:bg-gray-700">+</button>
      </div>
      <div className={`flex-1 w-full h-full overflow-hidden`}>
        <AceEditor
          mode="lua"
          theme={currentTheme.editorTheme}
          onChange={handleEditorChange}
          value={activeTab?.content || ''}
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

