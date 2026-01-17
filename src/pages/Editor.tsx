import { useEffect, useState, useRef } from 'react';
import AceEditor from 'react-ace';
import { useTheme } from '../context/ThemeContext';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { useThemeRawColors } from '../hooks/useThemeRawColors';
import useHotkey from '../hooks/useHotkey';
import { invoke } from '@tauri-apps/api/core';
import { suggestionService, settingsService, tabsService } from '../services';
import type { Tab, RenamingTabState, AceCompletion, SortableTabProps } from '../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import 'ace-builds/src-noconflict/mode-lua';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-nord_dark';
import 'ace-builds/src-noconflict/theme-gruvbox';
import 'ayu-ace/light';
import '../themes/ace-default';
import '../themes/ace-frappe-mist';

import 'ace-builds/src-noconflict/ext-language_tools';
import ace from 'ace-builds';

ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict');

type AceEditorInstance = Parameters<NonNullable<React.ComponentProps<typeof AceEditor>['onLoad']>>[0];

export function Editor() {
  const { currentTheme } = useTheme();
  const theme = useThemeClasses();
  const rawColors = useThemeRawColors();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [renamingTab, setRenamingTab] = useState<RenamingTabState | null>(null);
  const editorRef = useRef<AceEditorInstance | null>(null);
  const handleExecuteRef = useRef<() => void>(() => { });
  const initialSettings = settingsService.get();
  const [fontFamily, setFontFamily] = useState<string>(initialSettings.fontFamily as string);
  const [fontSize, setFontSize] = useState<number>(initialSettings.fontSize as number);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(!!initialSettings.showLineNumbers);
  const suggestionCacheRef = useRef<AceCompletion[]>([]);
  const suggestionsFetchedRef = useRef<boolean>(false);

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

    return () => {
      styleElement?.parentNode?.removeChild(styleElement);
    };
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
    const fetchSuggestions = async (): Promise<any[]> => {
      if (suggestionsFetchedRef.current) {
        return suggestionCacheRef.current;
      }
      try {
        await suggestionService.loadSuggestions();
        const data = suggestionService.getSuggestions();
        suggestionCacheRef.current = Array.isArray(data) ? data : [];
        suggestionsFetchedRef.current = true;
        return suggestionCacheRef.current;
      } catch (error) {
        console.error('[Editor.fetchSuggestions]', error);
        suggestionsFetchedRef.current = true;
        suggestionCacheRef.current = [];
        return [];
      }
    };

    const langTools = ace.require('ace/ext/language_tools');

    const luaCompleter = {
      getCompletions: async (_editor: any, _session: any, _pos: any, prefix: any, callback: any) => {
        if (!prefix || prefix.length < 2) {
          callback(null, []);
          return;
        }

        const allSuggestions = await fetchSuggestions();
        const prefixLower = prefix.toLowerCase();

        const fuzzyScore = (caption: string): number => {
          const captionLower = caption.toLowerCase();
          let score = 0;
          let prefixIdx = 0;
          let consecutiveMatches = 0;
          let lastMatchIdx = -1;

          for (let i = 0; i < captionLower.length && prefixIdx < prefixLower.length; i++) {
            if (captionLower[i] === prefixLower[prefixIdx]) {
              score += 1;

              if (lastMatchIdx === i - 1) {
                consecutiveMatches++;
                score += consecutiveMatches * 2;
              } else {
                consecutiveMatches = 0;
              }

              if (i === 0) score += 10;

              if (i > 0) {
                const prevChar = caption[i - 1];
                if (prevChar === '.' || prevChar === '_' || prevChar === ':') {
                  score += 5;
                } else if (caption[i] === caption[i].toUpperCase() && caption[i] !== caption[i].toLowerCase()) {
                  score += 3;
                }
              }
              lastMatchIdx = i;
              prefixIdx++;
            }
          }
          return prefixIdx === prefixLower.length ? score : 0;
        };

        const scored = allSuggestions
          .map((s: any) => ({ ...s, score: fuzzyScore(s.caption) }))
          .filter((s: any) => s.score > 0);

        scored.sort((a: any, b: any) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.caption.localeCompare(b.caption);
        });

        callback(null, scored.slice(0, 12));
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

    const unsubTabs = tabsService.subscribe((state) => {
      setTabs(state.tabs);
      const activeTab = state.tabs.find(t => t.id === state.activeTabId);
      if (activeTab) {
        setActiveTab(activeTab);
      }
    });

    tabsService.fetchTabs();

    return () => {
      clearInterval(interval);
      unsubTabs();
    };
  }, []);

  useEffect(() => {
    const unsub = settingsService.subscribe((s) => {
      setFontFamily(s.fontFamily as string);
      setFontSize(s.fontSize as number);
      setShowLineNumbers(!!s.showLineNumbers);
    });
    return () => unsub?.();
  }, []);



  const handleEditorChange = (newContent: string) => {
    if (!activeTab) return;

    tabsService.updateTabContent(activeTab.id, newContent);
  };

  const handleAddTab = async () => {
    try {
      await tabsService.addTab();
    } catch (error) {
      console.error('[Editor.handleAddTab]', error);
    }
  };

  const handleTabClick = async (id: number) => {
    try {
      await tabsService.setActiveTab(id);
    } catch (error) {
      console.error('[Editor.handleTabClick]', { id }, error);
    }
  };

  const handleRenameTab = async () => {
    if (!renamingTab) return;

    const { id, title } = renamingTab;
    setRenamingTab(null);

    if (title.trim() === '') return;

    const tabToRename = tabs.find(t => t.id === id);
    if (tabToRename && tabToRename.title !== title) {
      try {
        await tabsService.renameTab(id, title);
      } catch (error) {
        console.error('[Editor.handleRenameTab]', { id, title }, error);
      }
    }
  };

  const handleClear = () => {
    if (activeTab) {
      handleEditorChange('');
    }
  };

  const handleExecute = async () => {
    if (!isConnected || !activeTab) return;
    try {
      await invoke('execute_script_command', { script: activeTab.content });
    } catch (error) {
      console.error('[Editor.handleExecute]', { tabId: activeTab.id }, error);
    }
  };

  useEffect(() => {
    handleExecuteRef.current = handleExecute;
  }, [handleExecute]);

  useHotkey(['meta+enter', 'ctrl+enter'], () => {
    handleExecuteRef.current();
  }, [isConnected, activeTab], { enabled: true, enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'], preventDefault: true });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex((tab) => tab.id === active.id);
      const newIndex = tabs.findIndex((tab) => tab.id === over.id);

      const newTabs = arrayMove(tabs, oldIndex, newIndex);
      setTabs(newTabs);

      try {
        await tabsService.reorderTabs(newTabs.map((tab) => tab.id));
      } catch (error) {
        console.error('[Editor.handleDragEnd]', error);
        setTabs(tabs);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent">
      <div className={theme.combine("flex items-center border-b", theme.border.primary)}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tabs.map((tab) => tab.id)}
            strategy={horizontalListSortingStrategy}
          >
            {tabs.map((tab) => (
              <SortableTab
                key={tab.id}
                tab={tab}
                isActive={activeTab?.id === tab.id}
                isRenaming={renamingTab?.id === tab.id}
                renamingTab={renamingTab}
                theme={theme}
                rawColors={rawColors}
                onTabClick={handleTabClick}
                onTabDoubleClick={(id: number, title: string, initialWidth: number) =>
                  setRenamingTab({ id, title, initialWidth })
                }
                onRenameChange={(title: string) =>
                  renamingTab && setRenamingTab({ ...renamingTab, title })
                }
                onRenameSubmit={handleRenameTab}
                onRenameCancel={() => setRenamingTab(null)}
              />
            ))}
          </SortableContext>
        </DndContext>
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
          onLoad={(editor) => {
            editorRef.current = editor;
            editor.commands.addCommand({
              name: 'executeScript',
              bindKey: { mac: 'Command-Enter' },
              exec: () => handleExecuteRef.current(),
            });
          }}
          value={activeTab?.content || ''}
          name="nocturnal_ace_editor"
          height="100%"
          width="100%"
          showPrintMargin={false}
          showGutter={showLineNumbers}
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            fontFamily,
            fontSize,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            highlightActiveLine: false,
            wrap: true,
            showPrintMargin: false,
          }}
        />
      </div>

      <div
        className={theme.combine(
          "flex items-center justify-between p-2 border-t",
          theme.border.primary
        )}
      >
        <button
          onClick={handleClear}
          style={{
            backgroundColor: currentTheme.colors.background.tertiary,
            color: currentTheme.colors.text.secondary,
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease',
            marginRight: '8px'
          }}
        >
          Clear
        </button>
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

function SortableTab({
  tab,
  isActive,
  isRenaming,
  renamingTab,
  theme,
  rawColors,
  onTabClick,
  onTabDoubleClick,
  onRenameChange,
  onRenameSubmit,
  onRenameCancel,
}: SortableTabProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tab.id,
    disabled: isRenaming,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    opacity: isDragging ? 0.8 : 1,
    marginBottom: '-1px',
    zIndex: isDragging ? 1000 : 'auto',
    cursor: isRenaming ? 'text' : isDragging ? 'grabbing' : 'grab',
  };

  const handleClick = () => {
    if (!isRenaming) {
      onTabClick(tab.id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isRenaming) {
      const titleElement = e.currentTarget.querySelector('span');
      const initialWidth = titleElement ? titleElement.offsetWidth : 60;
      onTabDoubleClick(tab.id, tab.title, initialWidth);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...(isRenaming ? {} : listeners)}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={theme.combine(
        "relative flex items-center h-7 text-sm select-none",
        isActive ? theme.bg.secondary : "bg-transparent",
        isActive ? theme.text.primary : theme.text.secondary,
        isActive ? "font-medium" : "font-normal",
        `border ${theme.border.primary}`,
        isDragging && !isActive ? '' : 'border-l-transparent border-t-transparent',
        isDragging ? 'shadow-lg' : '',
        'px-3'
      )}
    >
      {isRenaming && renamingTab ? (
        <input
          type="text"
          value={renamingTab.title}
          autoComplete="off"
          onChange={(e) => {
            if (e.target.value.length <= 24) {
              onRenameChange(e.target.value);
            }
          }}
          onBlur={onRenameSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onRenameSubmit();
            } else if (e.key === 'Escape') {
              onRenameCancel();
            }
          }}
          onPointerDown={(e) => e.stopPropagation()}
          autoFocus
          className="bg-transparent border-none outline-none text-sm h-full p-0 m-0 cursor-text"
          style={{
            color: isActive ? rawColors.text.primary : rawColors.text.secondary,
            width: `calc(${renamingTab.initialWidth}px + 2ch)`,
            minWidth: `${renamingTab.initialWidth}px`
          }}
        />
      ) : (
        <span className="pointer-events-none">{tab.title}</span>
      )}
    </div>
  );
}
