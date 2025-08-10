import { invoke } from "@tauri-apps/api/core";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import { useThemeRawColors } from "../../hooks/useThemeRawColors";
import type { RenamingTab, Tab, TabBarProps } from "../../types/editor";

export function TabBar({
    tabs,
    activeTab,
    onTabChange,
    onTabsChange,
}: TabBarProps) {
    const theme = useThemeClasses();
    const rawColors = useThemeRawColors();
    const [showCloseButton, setShowCloseButton] = useState<number | null>(null);
    const [closingTabId, setClosingTabId] = useState<number | null>(null);
    const [renamingTab, setRenamingTab] = useState<RenamingTab | null>(null);
    const hoverTimeout = useRef<number | null>(null);

    const handleTabClick = async (id: number) => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
        }
        try {
            await invoke("set_active_tab", { id });
            const newActiveTab = tabs.find((t) => t.id === id);
            if (newActiveTab) {
                onTabChange(newActiveTab);
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
                const updatedTabs: Tab[] = await invoke("close_tab", { id });
                onTabsChange(updatedTabs);
                if (updatedTabs.length > 0) {
                    const newActiveTab = await invoke("get_active_tab");
                    onTabChange(newActiveTab as Tab);
                } else {
                    onTabChange(null);
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

        if (title.trim() === "") {
            setRenamingTab(null);
            return;
        }

        const tabToRename = tabs.find((t) => t.id === id);
        if (tabToRename && tabToRename.title !== title) {
            try {
                await invoke("rename_tab", { id, newTitle: title });
                const updatedTabs = tabs.map((t) =>
                    t.id === id ? { ...t, title } : t,
                );
                onTabsChange(updatedTabs);
            } catch (error) {
                console.error("rename tab error:", error);
            }
        }
        setRenamingTab(null);
    };

    const handleAddTab = async () => {
        try {
            const newTab = await invoke("add_tab");
            const updatedTabs: Tab[] = await invoke("get_tabs");
            onTabsChange(updatedTabs);
            onTabChange(newTab as Tab);
        } catch (error) {
            console.error("add tab error:", error);
        }
    };

    return (
        <div
            className={theme.combine(
                "flex items-center border-b",
                theme.border.primary,
            )}
        >
            {tabs.map((tab) => {
                const isActive = activeTab?.id === tab.id;
                const isRenaming = renamingTab?.id === tab.id;

                return (
                    <div
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        onDoubleClick={(e) => {
                            const titleElement =
                                e.currentTarget.querySelector("span");
                            const initialWidth = titleElement
                                ? titleElement.offsetWidth
                                : 60;
                            setRenamingTab({
                                id: tab.id,
                                title: tab.title,
                                initialWidth,
                            });
                        }}
                        onMouseEnter={() => handleTabMouseEnter(tab.id)}
                        onMouseLeave={handleTabMouseLeave}
                        className={theme.combine(
                            "relative flex items-center h-7 cursor-pointer text-sm border-r transition-all duration-200 ease-in-out",
                            isActive ? theme.bg.secondary : "bg-transparent",
                            isActive
                                ? theme.text.primary
                                : theme.text.secondary,
                            isActive ? "font-medium" : "font-normal",
                            `border-b ${theme.border.primary}`,
                            closingTabId === tab.id ? "tab-closing" : "",
                            showCloseButton === tab.id && !isRenaming
                                ? "px-3 pr-8"
                                : "px-3",
                        )}
                        style={{ marginBottom: "-1px" }}
                    >
                        {isRenaming && renamingTab ? (
                            <input
                                type="text"
                                value={renamingTab.title}
                                autoComplete="off"
                                onChange={(e) => {
                                    if (e.target.value.length <= 24) {
                                        setRenamingTab({
                                            ...renamingTab,
                                            title: e.target.value,
                                        });
                                    }
                                }}
                                onBlur={handleRenameTab}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleRenameTab();
                                    } else if (e.key === "Escape") {
                                        setRenamingTab(null);
                                    }
                                }}
                                className="bg-transparent border-none outline-none text-sm h-full p-0 m-0"
                                style={{
                                    color: isActive
                                        ? rawColors.text.primary
                                        : rawColors.text.secondary,
                                    width: `calc(${renamingTab.initialWidth}px + 2ch)`,
                                    minWidth: `${renamingTab.initialWidth}px`,
                                }}
                            />
                        ) : (
                            <span>{tab.title}</span>
                        )}
                        {!isRenaming && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCloseTab(tab.id);
                                    setShowCloseButton(tab.id);
                                }}
                                className={theme.combine(
                                    "absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded transition-opacity duration-300 ease-in-out",
                                    showCloseButton === tab.id
                                        ? "opacity-100 pointer-events-auto"
                                        : "opacity-0 pointer-events-none",
                                    theme.bg.hover,
                                )}
                                type="button"
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
                    theme.bg.hover,
                )}
                style={{ marginBottom: "-1px" }}
                type="button"
            >
                +
            </button>
        </div>
    );
}
