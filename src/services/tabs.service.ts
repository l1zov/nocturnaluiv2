import { invoke, invokeRequired, BaseService } from './base';
import type { Tab } from '../types';

export type { Tab };

export interface TabsState {
    tabs: Tab[];
    activeTabId: number | null;
}

class TabsServiceClass extends BaseService<TabsState> {
    private tabs: Tab[] = [];
    private activeTabId: number | null = null;

    constructor() {
        super();
        this.init();
    }

    protected getSnapshot(): TabsState {
        return {
            tabs: [...this.tabs],
            activeTabId: this.activeTabId,
        };
    }

    private async init(): Promise<void> {
        try {
            await this.fetchTabs();
        } catch (error) {
            console.error('[TabsService.init]', error);
        }
    }

    async fetchTabs(): Promise<Tab[]> {
        const [tabs, activeTab] = await Promise.all([
            invoke<Tab[]>('get_tabs', undefined, { context: 'TabsService.fetchTabs' }),
            invoke<Tab>('get_active_tab', undefined, { context: 'TabsService.getActiveTab' }),
        ]);

        if (tabs) {
            this.tabs = tabs;
            this.activeTabId = activeTab?.id ?? null;
            this.markInitialized();
            return tabs;
        }

        return [];
    }

    async addTab(): Promise<Tab> {
        const newTab = await invokeRequired<Tab>('add_tab', undefined, 'TabsService.addTab');
        await this.fetchTabs();
        return newTab;
    }

    async closeTab(id: number): Promise<void> {
        await invokeRequired<Tab[]>('close_tab', { id }, 'TabsService.closeTab');
        await this.fetchTabs();
    }

    async setActiveTab(id: number): Promise<void> {
        await invokeRequired('set_active_tab', { id }, 'TabsService.setActiveTab');
        this.activeTabId = id;
        this.notify();
    }

    async renameTab(id: number, newTitle: string): Promise<void> {
        await invokeRequired('rename_tab', { id, newTitle }, 'TabsService.renameTab');

        const tab = this.tabs.find(t => t.id === id);
        if (tab) {
            tab.title = newTitle;
            this.notify();
        }
    }

    async updateTabContent(id: number, content: string): Promise<void> {
        await invoke('update_tab_content', { id, content }, { context: 'TabsService.updateContent' });

        const tab = this.tabs.find(t => t.id === id);
        if (tab) {
            tab.content = content;
        }
    }

    async reorderTabs(tabIds: number[]): Promise<Tab[]> {
        const reorderedTabs = await invokeRequired<Tab[]>(
            'reorder_tabs',
            { tabIds },
            'TabsService.reorderTabs'
        );
        this.tabs = reorderedTabs;
        this.notify();
        return reorderedTabs;
    }

    getTabs(): Tab[] {
        return this.tabs;
    }

    getActiveTabId(): number | null {
        return this.activeTabId;
    }

    getActiveTab(): Tab | null {
        return this.tabs.find(t => t.id === this.activeTabId) ?? null;
    }

    getTabById(id: number): Tab | null {
        return this.tabs.find(t => t.id === id) ?? null;
    }
}

export const tabsService = new TabsServiceClass();
