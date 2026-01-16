import { invoke } from '@tauri-apps/api/core';

export type Tab = {
  id: number;
  title: string;
  content: string;
};

type Listener = (tabs: Tab[], activeTabId?: number) => void;

class TabsServiceClass {
  private tabs: Tab[] = [];
  private activeTabId: number | null = null;
  private listeners: Listener[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    try {
      await this.fetchTabs();
    } catch (error) {
      console.error('init error:', error);
    }
  }

  private notify() {
    this.listeners.forEach((l) => l(this.tabs, this.activeTabId ?? undefined));
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn);
    if (this.tabs.length > 0) {
      fn(this.tabs, this.activeTabId ?? undefined);
    }
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  async fetchTabs() {
    try {
      const tabs = await invoke<Tab[]>('get_tabs');
      const activeTab = await invoke<Tab>('get_active_tab');
      this.tabs = tabs;
      this.activeTabId = activeTab.id;
      this.notify();
      return tabs;
    } catch (error) {
      console.error('fetchTabs error:', error);
      return [];
    }
  }

  async addTab() {
    try {
      const newTab = await invoke<Tab>('add_tab');
      await this.fetchTabs();
      return newTab;
    } catch (error) {
      console.error('addTab error:', error);
      throw error;
    }
  }

  async closeTab(id: number) {
    try {
      await invoke<Tab[]>('close_tab', { id });
      await this.fetchTabs();
    } catch (error) {
      console.error('closeTab error:', error);
      throw error;
    }
  }

  async setActiveTab(id: number) {
    try {
      await invoke('set_active_tab', { id });
      this.activeTabId = id;
      this.notify();
    } catch (error) {
      console.error('setActiveTab error:', error);
      throw error;
    }
  }

  async renameTab(id: number, newTitle: string) {
    try {
      await invoke('rename_tab', { id, newTitle });
      const tab = this.tabs.find(t => t.id === id);
      if (tab) {
        tab.title = newTitle;
        this.notify();
      }
    } catch (error) {
      console.error('renameTab error:', error);
      throw error;
    }
  }

  async updateTabContent(id: number, content: string) {
    try {
      await invoke('update_tab_content', { id, content });
      const tab = this.tabs.find(t => t.id === id);
      if (tab) {
        tab.content = content;
        this.notify();
      }
    } catch (error) {
      console.error('updateTabContent error:', error);
      throw error;
    }
  }

  async reorderTabs(tabIds: number[]) {
    try {
      const reorderedTabs = await invoke<Tab[]>('reorder_tabs', { tabIds });
      this.tabs = reorderedTabs;
      this.notify();
      return reorderedTabs;
    } catch (error) {
      console.error('reorderTabs error:', error);
      throw error;
    }
  }

  getTabs() {
    return this.tabs;
  }

  getActiveTabId() {
    return this.activeTabId;
  }

  getActiveTab() {
    return this.tabs.find(t => t.id === this.activeTabId) ?? null;
  }
}

export const tabsService = new TabsServiceClass();
