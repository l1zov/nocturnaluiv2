import { useEffect, useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import useHotkey from '../hooks/useHotkey';
import { invoke } from '@tauri-apps/api/core';
import { settingsService, tabsService } from '../services';
import type { Tab, RenamingTabState, ContextMenuState } from '../types';
import {
  TabBar,
  TabContextMenu,
  AceEditor,
  EditorToolbar,
} from '../components/editor';

export function Editor() {
  const { currentTheme } = useTheme();
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [renamingTab, setRenamingTab] = useState<RenamingTabState | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const handleExecuteRef = useRef<() => void>(() => {});
  
  const initialSettings = settingsService.get();
  const [fontFamily, setFontFamily] = useState<string>(initialSettings.fontFamily as string);
  const [fontSize, setFontSize] = useState<number>(initialSettings.fontSize as number);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(!!initialSettings.showLineNumbers);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const connected = await invoke('check_connection_command');
        setIsConnected(connected as boolean);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 1000);

    const unsubTabs = tabsService.subscribe((state) => {
      setTabs(state.tabs);
      const active = state.tabs.find(t => t.id === state.activeTabId);
      if (active) {
        setActiveTab(active);
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

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

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

  const handleReorderTabs = async (tabIds: number[]) => {
    try {
      await tabsService.reorderTabs(tabIds);
    } catch (error) {
      console.error('[Editor.handleReorderTabs]', error);
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

  const handleCloseTab = async (id: number) => {
    try {
      await tabsService.closeTab(id);
    } catch (error) {
      console.error('[Editor.handleCloseTab]', { id }, error);
    }
  };

  const handleCloseOtherTabs = async (id: number) => {
    try {
      const otherTabs = tabs.filter(t => t.id !== id);
      for (const tab of otherTabs) {
        await tabsService.closeTab(tab.id);
      }
    } catch (error) {
      console.error('[Editor.handleCloseOtherTabs]', { id }, error);
    }
  };

  const handleCloseAllTabs = async () => {
    try {
      for (const tab of tabs) {
        await tabsService.closeTab(tab.id);
      }
    } catch (error) {
      console.error('[Editor.handleCloseAllTabs]', error);
    }
  };

  const handleDuplicateTab = async (tab: Tab) => {
    try {
      const newTab = await tabsService.addTab();
      await tabsService.renameTab(newTab.id, `${tab.title} (copy)`);
      await tabsService.updateTabContent(newTab.id, tab.content);
    } catch (error) {
      console.error('[Editor.handleDuplicateTab]', { tabId: tab.id }, error);
    }
  };

  const handleRenameFromContext = (id: number, title: string) => {
    const titleElement = document.querySelector(`[data-tab-id="${id}"] span`);
    const initialWidth = titleElement ? titleElement.clientWidth : 60;
    setRenamingTab({ id, title, initialWidth });
  };

  useEffect(() => {
    handleExecuteRef.current = handleExecute;
  }, [handleExecute]);

  useHotkey(['meta+enter', 'ctrl+enter'], () => {
    handleExecuteRef.current();
  }, [isConnected, activeTab], { enabled: true, enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'], preventDefault: true });

  useHotkey('escape', () => {
    if (contextMenu) {
      setContextMenu(null);
    }
  }, [contextMenu], { enabled: true });

  return (
    <div className="flex-1 flex flex-col bg-transparent">
      <TabBar
        tabs={tabs}
        activeTabId={activeTab?.id ?? null}
        renamingTab={renamingTab}
        onTabClick={handleTabClick}
        onTabDoubleClick={(id, title, initialWidth) => setRenamingTab({ id, title, initialWidth })}
        onRenameChange={(title) => renamingTab && setRenamingTab({ ...renamingTab, title })}
        onRenameSubmit={handleRenameTab}
        onRenameCancel={() => setRenamingTab(null)}
        onAddTab={handleAddTab}
        onReorderTabs={handleReorderTabs}
        onContextMenu={(tab, x, y) => setContextMenu({ tab, x, y })}
      />

      {contextMenu && (
        <TabContextMenu
          tab={contextMenu.tab}
          x={contextMenu.x}
          y={contextMenu.y}
          tabCount={tabs.length}
          onClose={() => setContextMenu(null)}
          onRename={handleRenameFromContext}
          onDuplicate={handleDuplicateTab}
          onCloseTab={handleCloseTab}
          onCloseOtherTabs={handleCloseOtherTabs}
          onCloseAllTabs={handleCloseAllTabs}
        />
      )}

      <AceEditor
        content={activeTab?.content || ''}
        editorTheme={currentTheme.editorTheme}
        fontFamily={fontFamily}
        fontSize={fontSize}
        showLineNumbers={showLineNumbers}
        onContentChange={handleEditorChange}
        onExecute={handleExecute}
      />

      <EditorToolbar
        isConnected={isConnected}
        theme={currentTheme}
        onClear={handleClear}
        onExecute={handleExecute}
      />
    </div>
  );
}
