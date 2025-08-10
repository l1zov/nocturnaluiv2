import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useState } from "react";
import { EditorContent } from "../components/editor/editorContent";
import { EditorControls } from "../components/editor/editorControls";
import { useEditorStyles } from "../components/editor/editorStyles";
import { TabBar } from "../components/editor/tabBar";
import type { Tab } from "../types/editor";

import "ace-builds/src-noconflict/mode-lua";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-nord_dark";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ayu-ace/light";

import "ace-builds/src-noconflict/ext-language_tools";

let suggestionCache: any[] = [];
let suggestionsFetched = false;

async function fetchSuggestions(): Promise<any[]> {
    if (suggestionsFetched) {
        return suggestionCache;
    }
    try {
        const data: any = await invoke("fetch_suggestions_command");
        if (data && typeof data === "object") {
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
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [activeTab, setActiveTab] = useState<Tab | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    useEditorStyles();

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const connected = await invoke("check_connection_command");
                setIsConnected(connected as boolean);
            } catch (_error) {
                setIsConnected(false);
            }
        };

        checkConnection();
        const interval = setInterval(checkConnection, 1000);

        const initTabs = async () => {
            try {
                const initialTabs = await invoke("get_tabs");
                const initialActiveTab = await invoke("get_active_tab");
                setTabs(initialTabs as Tab[]);
                setActiveTab(initialActiveTab as Tab);
            } catch (error) {
                console.error("get tabs error:", error);
            }
        };

        initTabs();

        return () => {
            clearInterval(interval);
        };
    }, []);

    const handleEditorChange = useCallback(
        (newContent: string) => {
            if (!activeTab) return;

            const updatedActiveTab = { ...activeTab, content: newContent };
            setActiveTab(updatedActiveTab);

            setTabs(
                tabs.map((tab) =>
                    tab.id === activeTab.id ? updatedActiveTab : tab,
                ),
            );

            invoke("update_tab_content", {
                id: activeTab.id,
                content: newContent,
            });
        },
        [activeTab, tabs],
    );

    const handleClear = useCallback(() => {
        if (activeTab) {
            handleEditorChange("");
        }
    }, [activeTab, handleEditorChange]);

    const handleExecute = useCallback(async () => {
        if (!isConnected || !activeTab) return;
        try {
            await invoke("execute_script_command", {
                script: activeTab.content,
            });
        } catch (error) {
            console.error("script not executed:", error);
        }
    }, [isConnected, activeTab]);

    return (
        <div className="flex-1 flex flex-col bg-transparent">
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onTabsChange={setTabs}
            />
            <EditorContent
                activeTab={activeTab}
                onContentChange={handleEditorChange}
                isConnected={isConnected}
                onExecute={handleExecute}
            />
            <EditorControls
                onClear={handleClear}
                onExecute={handleExecute}
                isConnected={isConnected}
            />
        </div>
    );
}
