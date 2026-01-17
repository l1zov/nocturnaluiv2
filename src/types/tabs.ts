export interface Tab {
  id: number;
  title: string;
  content: string;
}

export interface RenamingTabState {
  id: number;
  title: string;
  initialWidth: number;
}

export type TabsListener = (tabs: Tab[], activeTabId?: number) => void;

export interface TabsState {
  tabs: Tab[];
  activeTabId: number | null;
}
