import { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';
import AceEditor from 'react-ace';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { useThemeRawColors } from '../hooks/useThemeRawColors';
import { invoke } from '@tauri-apps/api/core';

import 'ace-builds/src-noconflict/mode-lua';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-twilight';
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
  const rawColors = useThemeRawColors();
  const [tabs, setTabs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<any>(null);
  const [showCloseButton, setShowCloseButton] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
  const [closingTabId, setClosingTabId] = useState<number | null>(null);
  const [renamingTab, setRenamingTab] = useState<{ id: number; title: string; initialWidth: number } | null>(null);
  const hoverTimeout = useRef<number | null>(null);

  useEffect(() => {
    const styleId = 'dynamic-scrollbar-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.innerHTML = `
      .ace_scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .ace_scrollbar::-webkit-scrollbar-thumb {
        background: #88888880;
        border-radius: 4px;
        border-right: 2px solid transparent;
        background-clip: padding-box;
      }
      .ace_scrollbar::-webkit-scrollbar-thumb:hover {
        background: #55555580;
      }
      .ace_scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
    `;
  }, []);

  useEffect(() => {
    const styleId = 'dynamic-suggestion-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.innerHTML = `
      .ace_editor.ace_autocomplete {
        background: ${rawColors.background.secondary} !important;
        border: 1px solid ${rawColors.border.primary} !important;
        color: ${rawColors.text.primary} !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        border-radius: 8px !important;
        padding: 5px !important;
      }
      .ace_editor.ace_autocomplete .ace_completion-highlight {
        color: ${rawColors.text.accent} !important;
        text-shadow: none !important;
      }
      .ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {
        background: ${rawColors.background.tertiary} !important;
        border-radius: 6px !important;
      }
      .ace_editor.ace_autocomplete .ace_marker-layer .ace_line-hover {
        background: ${rawColors.background.tertiary} !important;
        border: 1px solid ${rawColors.border.accent} !important;
        border-radius: 6px !important;
      }
    `;
  }, [rawColors]);

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
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setShowCloseButton(null);
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

  const handleTabMouseEnter = (id: number) => {
    hoverTimeout.current = window.setTimeout(() => {
      setShowCloseButton(id);
    }, 500);
  };

  const handleTabMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
    }
    setShowCloseButton(null);
  };

    const handleCloseTab = (id: number) => {
    setClosingTabId(id);

    setTimeout(async () => {
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
      setClosingTabId(null);
    }, 300);
  };

  const handleRenameTab = async () => {
    if (!renamingTab) return;

    const { id, title } = renamingTab;

    if (title.trim() === '') {
      setRenamingTab(null);
      return;
    }

    const tabToRename = tabs.find(t => t.id === id);
    if (tabToRename && tabToRename.title !== title) {
      try {
        await invoke('rename_tab', { id, newTitle: title });
        const updatedTabs = tabs.map(t =>
          t.id === id ? { ...t, title: title } : t
        );
        setTabs(updatedTabs);
      } catch (error) {
        console.error("rename tab error:", error);
      }
    }
    setRenamingTab(null);
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
    <div className="flex-1 flex flex-col bg-transparent">
                  <div className={theme.combine("flex items-center border-b", theme.border.primary)}>
        {tabs.map(tab => {
          const isActive = activeTab?.id === tab.id;
          const isRenaming = renamingTab?.id === tab.id;

          return (
            <div
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              onDoubleClick={(e) => {
                const titleElement = e.currentTarget.querySelector('span');
                const initialWidth = titleElement ? titleElement.offsetWidth : 60;
                setRenamingTab({ id: tab.id, title: tab.title, initialWidth });
              }}
              onMouseEnter={() => handleTabMouseEnter(tab.id)}
              onMouseLeave={handleTabMouseLeave}
              className={theme.combine(
                "relative flex items-center h-7 cursor-pointer text-sm border-r transition-all duration-200 ease-in-out",
                isActive ? theme.bg.secondary : "bg-transparent",
                isActive ? theme.text.primary : theme.text.secondary,
                isActive ? "font-medium" : "font-normal",
                `border-b ${theme.border.primary}`,
                closingTabId === tab.id ? 'tab-closing' : '',
                showCloseButton === tab.id && !isRenaming ? 'px-3 pr-8' : 'px-3'
              )}
              style={{ marginBottom: '-1px' }}
            >
              {isRenaming && renamingTab ? (
                <input
                  type="text"
                  value={renamingTab.title}
                  autoComplete="off"
                  onChange={(e) => {
                    if (e.target.value.length <= 24) {
                      setRenamingTab({ ...renamingTab, title: e.target.value });
                    }
                  }}
                  onBlur={handleRenameTab}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameTab();
                    } else if (e.key === 'Escape') {
                      setRenamingTab(null);
                    }
                  }}
                  autoFocus
                  className="bg-transparent border-none outline-none text-sm h-full p-0 m-0"
                  style={{
                    color: isActive ? rawColors.text.primary : rawColors.text.secondary,
                    width: `calc(${renamingTab.initialWidth}px + 2ch)`,
                    minWidth: `${renamingTab.initialWidth}px`
                  }}
                />
              ) : (
                <span>{tab.title}</span>
              )}
              {!isRenaming && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleCloseTab(tab.id); }}
                  className={theme.combine(
                    "absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity duration-300 ease-in-out",
                    showCloseButton === tab.id ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                    theme.bg.hover
                  )}
                >
                  <X size={14} className={theme.text.muted} />
                </button>
              )}
            </div>
          );
        })}
                <button
          onClick={handleAddTab}
          className={theme.combine(
            "px-2 h-7 text-sm border-r border-b",
            theme.text.secondary,
            theme.border.primary,
            theme.bg.hover
          )}
          style={{ marginBottom: '-1px' }}
        >
          +
        </button>
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
    </div>
  );
}

