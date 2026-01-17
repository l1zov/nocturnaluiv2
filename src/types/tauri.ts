import type { Tab } from './tabs';

export type TauriCommand =
    | 'get_tabs'
    | 'get_active_tab'
    | 'add_tab'
    | 'close_tab'
    | 'set_active_tab'
    | 'rename_tab'
    | 'update_tab_content'
    | 'reorder_tabs'
    | 'save_settings'
    | 'load_settings'
    | 'close_window'
    | 'minimize_window'
    | 'toggle_maximize_window'
    | 'check_connection_command'
    | 'execute_script_command';

export type TauriEvent =
    | 'connection-status-changed';


export interface TauriCommandArgs {
    get_tabs: Record<string, never>;
    get_active_tab: Record<string, never>;
    add_tab: Record<string, never>;
    close_tab: { id: number };
    set_active_tab: { id: number };
    rename_tab: { id: number; newTitle: string };
    update_tab_content: { id: number; content: string };
    reorder_tabs: { tabIds: number[] };
    save_settings: { key: string; value: string };
    load_settings: { key: string };
    close_window: Record<string, never>;
    minimize_window: Record<string, never>;
    toggle_maximize_window: Record<string, never>;
    check_connection_command: Record<string, never>;
    execute_script_command: { script: string };
}

export interface TauriCommandReturns {
    get_tabs: Tab[];
    get_active_tab: Tab;
    add_tab: Tab;
    close_tab: Tab[];
    set_active_tab: void;
    rename_tab: void;
    update_tab_content: void;
    reorder_tabs: Tab[];
    save_settings: void;
    load_settings: string | null;
    close_window: void;
    minimize_window: void;
    toggle_maximize_window: void;
    check_connection_command: boolean;
    execute_script_command: void;
}
