import { useEffect, useState, useRef } from 'react';
import AceEditor from 'react-ace';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { invoke } from '@tauri-apps/api/core';
import { FolderOpen, Trash2, Undo, Redo } from 'lucide-react';

import 'ace-builds/src-noconflict/mode-lua';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-vibrant_ink';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/ext-language_tools';
import ace from 'ace-builds';

let cache: any[] = [];
let loaded = false;

async function getSuggestions(): Promise<any[]> {
  if (loaded) return cache;
  try {
    const data: any = await invoke('fetch_suggestions_command');
    if (data && typeof data === 'object') {
      cache = [
        ...(data.class || []),
        ...(data.function || []),
        ...(data.method || []),
        ...(data.property || []),
      ];
    } else {
      cache = [];
    }
    loaded = true;
    return cache;
  } catch (error) {
    console.error(error);
    loaded = true;
    cache = [];
    return [];
  }
}

getSuggestions();

export function Editor() {
  const { currentTheme } = useTheme();
  const theme = useThemeClasses();
  const [tabs, setTabs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [confirmClear, setConfirmClear] = useState(true);
  const editorRef = useRef<any>(null);

  const updateTheme = () => {
    const style = document.createElement('style');
    style.id = 'ace-autocomplete-theme';
    
    const old = document.getElementById('ace-autocomplete-theme');
    if (old) old.remove();

    const themes = {
      'dracula': {
        bg: '#282a36',
        bgHover: '#44475a',
        text: '#f8f8f2',
        textSecondary: '#6272a4',
        border: '#44475a',
        accent: '#ff79c6'
      },
      'github': {
        bg: '#ffffff',
        bgHover: '#f6f8fa',
        text: '#24292e',
        textSecondary: '#586069',
        border: '#e1e4e8',
        accent: '#0366d6'
      },
      'tomorrow-night': {
        bg: '#1d1f21',
        bgHover: '#373b41',
        text: '#c5c8c6',
        textSecondary: '#969896',
        border: '#373b41',
        accent: '#81a2be'
      },
      'glassy': {
        bg: 'rgba(30, 30, 30, 0.9)',
        bgHover: 'rgba(60, 60, 60, 0.9)',
        text: '#ffffff',
        textSecondary: '#cccccc',
        border: 'rgba(80, 80, 80, 0.9)',
        accent: '#00d4ff'
      },
      'monokai': {
        bg: '#272822',
        bgHover: '#49483e',
        text: '#f8f8f2',
        textSecondary: '#a6e22e',
        border: '#49483e',
        accent: '#f92672'
      },
      'solarized-dark': {
        bg: '#002b36',
        bgHover: '#073642',
        text: '#839496',
        textSecondary: '#586e75',
        border: '#073642',
        accent: '#268bd2'
      },
      'cyberpunk': {
        bg: '#0f0f23',
        bgHover: '#1a1a3a',
        text: '#00ff88',
        textSecondary: '#ff0080',
        border: '#1a1a3a',
        accent: '#ff0080'
      },
      'nord': {
        bg: '#2e3440',
        bgHover: '#3b4252',
        text: '#eceff4',
        textSecondary: '#d8dee9',
        border: '#3b4252',
        accent: '#88c0d0'
      },
      'catppuccin': {
        bg: '#1e1e2e',
        bgHover: '#313244',
        text: '#cdd6f4',
        textSecondary: '#a6adc8',
        border: '#313244',
        accent: '#cba6f7'
      }
    };

    const colors = themes[currentTheme.name as keyof typeof themes] || themes['dracula'];

    style.textContent = `
      .ace_editor.ace_autocomplete {
        background: ${colors.bg} !important;
        border: 1px solid ${colors.border} !important;
        border-radius: 6px !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      }
      
      .ace_editor.ace_autocomplete .ace_marker-layer .ace_active-line {
        background: ${colors.bgHover} !important;
      }
      
      .ace_editor.ace_autocomplete .ace_line {
        color: ${colors.text} !important;
        padding: 4px 8px !important;
      }
      
      .ace_editor.ace_autocomplete .ace_completion-highlight {
        color: ${colors.accent} !important;
        font-weight: bold !important;
      }
      
      .ace_editor.ace_autocomplete .ace_completion-meta {
        color: ${colors.textSecondary} !important;
        font-style: italic !important;
        margin-left: 8px !important;
      }
      
      .ace_editor.ace_autocomplete .ace_line:hover {
        background: ${colors.bgHover} !important;
      }
      
      .ace_editor.ace_autocomplete .ace_selected {
        background: ${colors.bgHover} !important;
      }
      
      .ace_tooltip {
        background: ${colors.bg} !important;
        border: 1px solid ${colors.border} !important;
        color: ${colors.text} !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
      }
    `;

    document.head.appendChild(style);
  };

  useEffect(() => {
    const langTools = ace.require('ace/ext/language_tools');

    const luaCompleter = {
            getCompletions: async (_editor: any, _session: any, _pos: any, _prefix: any, callback: any) => {
        const suggestions = await getSuggestions();
        callback(null, suggestions.map((s: any) => ({
          caption: s.label,
          value: s.label,
          meta: s.detail || 'keyword',
          docHTML: s.documentation,
        })));
      },
    };

    langTools.addCompleter(luaCompleter);

    const check = async () => {
      try {
        const connected = await invoke('check_connection_command');
        setConnected(connected as boolean);
      } catch (error) {
        setConnected(false);
      }
    };

    check();
    const interval = setInterval(check, 1000);

    const init = async () => {
      try {
        const saved = localStorage.getItem('editorTabs');
        const activeId = localStorage.getItem('activeTabId');
        
        if (saved) {
          const parsed = JSON.parse(saved);
          setTabs(parsed);
          
          if (activeId) {
            const active = parsed.find((tab: any) => tab.id === parseInt(activeId));
            if (active) {
              setActiveTab(active);
            } else {
              setActiveTab(parsed[0]);
            }
          } else {
            setActiveTab(parsed[0]);
          }
        } else {
          const defaultTab = {
            id: 1,
            title: 'Welcome.lua',
            content: '-- Welcome to Nocturnal UI Editor!\n-- This is a Lua code editor\n\nprint("Hello, world!")\n\n-- Try adding a new tab with the + button'
          };
          setTabs([defaultTab]);
          setActiveTab(defaultTab);
          
          localStorage.setItem('editorTabs', JSON.stringify([defaultTab]));
          localStorage.setItem('activeTabId', '1');
        }
      } catch (error) {
        console.error("init error:", error);
        const defaultTab = {
          id: 1,
          title: 'Welcome.lua',
          content: '-- Welcome to Nocturnal UI Editor!\n-- This is a Lua code editor\n\nprint("Hello, world!")\n\n-- Try adding a new tab with the + button'
        };
        setTabs([defaultTab]);
        setActiveTab(defaultTab);
      }
    };

    init();

    const savedSize = localStorage.getItem('fontSize');
    const savedConfirm = localStorage.getItem('confirmClear');
    if (savedSize) {
      setFontSize(parseInt(savedSize));
    }
    if (savedConfirm !== null) {
      setConfirmClear(savedConfirm === 'true');
    }

    updateTheme();

    const onFontChange = (e: any) => {
      setFontSize(e.detail);
    };
    const onConfirmChange = (e: any) => {
      setConfirmClear(e.detail);
    };
    const onGuiChange = (_e: any) => {
    };

    window.addEventListener('fontSizeChanged', onFontChange);
    window.addEventListener('confirmBeforeClearChanged', onConfirmChange);
    window.addEventListener('guiFontSizeChanged', onGuiChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('fontSizeChanged', onFontChange);
      window.removeEventListener('confirmBeforeClearChanged', onConfirmChange);
      window.removeEventListener('guiFontSizeChanged', onGuiChange);
    };
  }, []);

  useEffect(() => {
    updateTheme();
  }, [currentTheme.name]);

  const onChange = (content: string) => {
    if (!activeTab) return;

    const updated = { ...activeTab, content };
    setActiveTab(updated);

    const newTabs = tabs.map(tab => tab.id === activeTab.id ? updated : tab);
    setTabs(newTabs);

    localStorage.setItem('editorTabs', JSON.stringify(newTabs));
  };

  const addTab = async () => {
    try {
      const newId = Math.max(...tabs.map(t => t.id), 0) + 1;
      const tab = {
        id: newId,
        title: `Untitled-${newId}`,
        content: '-- New script\nprint("Hello, world!")'
      };
      
      const updated = [...tabs, tab];
      setTabs(updated);
      setActiveTab(tab);
      
      localStorage.setItem('editorTabs', JSON.stringify(updated));
      localStorage.setItem('activeTabId', newId.toString());
    } catch (error) {
      console.error("tab error:", error);
    }
  };

  const clickTab = async (id: number) => {
    try {
      const tab = tabs.find(t => t.id === id);
      if (tab) {
        setActiveTab(tab);
        localStorage.setItem('activeTabId', id.toString());
      }
    } catch (error) {
      console.error("tab error:", error);
    }
  };

  const closeTab = async (id: number) => {
    try {
      const updated = tabs.filter(tab => tab.id !== id);
      setTabs(updated);
      
      if (updated.length > 0) {
        if (activeTab?.id === id) {
          const tab = updated[updated.length - 1];
          setActiveTab(tab);
          localStorage.setItem('activeTabId', tab.id.toString());
        }
      } else {
        setActiveTab(null);
        localStorage.removeItem('activeTabId');
      }
      
      localStorage.setItem('editorTabs', JSON.stringify(updated));
    } catch (error) {
      console.error("tab error:", error);
    }
  };

  const execute = async () => {
    if (!connected || !activeTab) return;
    try {
      await invoke('execute_script_command', { script: activeTab.content });
    } catch (error) {
      console.error('script failed:', error);
    }
  };

  const clear = () => {
    if (!activeTab) return;
    
    if (confirmClear) {
      const ok = window.confirm('Are you sure you want to clear all content? This action cannot be undone.');
      if (!ok) return;
    }
    
    const updated = tabs.map(tab => 
      tab.id === activeTab.id ? { ...tab, content: '' } : tab
    );
    setTabs(updated);
    setActiveTab({ ...activeTab, content: '' });
    
    localStorage.setItem('editorTabs', JSON.stringify(updated));
  };

  const undo = () => {
    if (editorRef.current) {
      editorRef.current.editor.undo();
    }
  };

  const redo = () => {
    if (editorRef.current) {
      editorRef.current.editor.redo();
    }
  };

  const openFile = async () => {
    try {
      const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__;
      
      if (isTauri) {
        try {
          await invoke('open_downloads_folder');
        } catch (err) {
          console.error('Tauri open failed:', err);
          alert('Could not open Downloads folder. Make sure you are running the desktop version.');
        }
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.lua,.js,.py,.md,.json';
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const content = event.target?.result as string;
              
              const newId = Math.max(...tabs.map(t => t.id), 0) + 1;
              const tab = {
                id: newId,
                title: file.name,
                content: content
              };
              
              const updated = [...tabs, tab];
              setTabs(updated);
              setActiveTab(tab);
            };
            reader.readAsText(file);
          }
        };
        input.click();
      }
    } catch (error) {
      console.error('open failed:', error);
      alert('Could not open file');
    }
  };

  return (
    <main className="flex-1 flex flex-col bg-transparent">
      <div className="flex items-center border-b border-gray-700">
        {tabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => clickTab(tab.id)}
            className={`flex items-center px-4 py-2 cursor-pointer text-sm ${
              activeTab?.id === tab.id 
                ? `bg-gray-800 border-b-2 ${theme.border.accent}` 
                : 'hover:bg-gray-700'
            }`}>
            <span>{tab.title}</span>
            <button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }} className="ml-2 text-gray-400 hover:text-white">x</button>
          </div>
        ))}
        <button onClick={addTab} className="px-3 py-2 text-sm hover:bg-gray-700">+</button>
      </div>
      <div className={`flex-1 w-full h-full overflow-hidden`}>
        <AceEditor
          ref={editorRef}
          mode="lua"
          theme={currentTheme.editorTheme}
          onChange={onChange}
          value={activeTab?.content || ''}
          name="nocturnal_ace_editor"
          height="100%"
          width="100%"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            fontFamily: 'Fira Code',
            fontSize: fontSize,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            highlightActiveLine: false,
            wrap: true,
          }}
        />
      </div>

      <div
        className={theme.combine(
          "flex items-center justify-between p-2 border-t space-x-2",
          theme.border.primary
        )}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={clear}
            className={theme.combine(
              "flex items-center px-2 py-2 rounded text-sm font-medium transition-colors opacity-70 hover:opacity-100",
              theme.bg.secondary,
              theme.text.primary,
              theme.bg.hover
            )}
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={undo}
            className={theme.combine(
              "flex items-center px-2 py-2 rounded text-sm font-medium transition-colors opacity-70 hover:opacity-100",
              theme.bg.secondary,
              theme.bg.hover,
              theme.text.primary,
              "cursor-pointer"
            )}
          >
            <Undo size={16} />
          </button>
          <button
            onClick={redo}
            className={theme.combine(
              "flex items-center px-2 py-2 rounded text-sm font-medium transition-colors opacity-70 hover:opacity-100",
              theme.bg.secondary,
              theme.bg.hover,
              theme.text.primary,
              "cursor-pointer"
            )}
          >
            <Redo size={16} />
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={openFile}
            className={theme.combine(
              "flex items-center space-x-2 px-3 py-2 rounded text-sm font-medium transition-colors",
              theme.accent.primary,
              theme.text.primary,
              "cursor-pointer"
            )}
          >
            <FolderOpen size={16} />
            <span>Open</span>
          </button>
          <button
            onClick={execute}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onMouseLeave={() => setPressed(false)}
            disabled={!connected}
            style={{
              backgroundColor:
                connected
                  ? pressed
                    ? currentTheme.colors.background.active
                    : currentTheme.colors.accent.primary
                  : currentTheme.colors.background.tertiary,
              color: connected ? currentTheme.colors.text.primary : currentTheme.colors.text.muted,
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 500,
              border: 'none',
              cursor: connected ? 'pointer' : 'not-allowed',
              opacity: connected ? 1 : 0.5,
              transform: pressed && connected ? 'scale(0.92)' : 'scale(1)',
              transition: 'transform 0.1s ease, background-color 0.2s ease',
            }}
          >
            Execute
          </button>
        </div>
      </div>
    </main>
  );
}

