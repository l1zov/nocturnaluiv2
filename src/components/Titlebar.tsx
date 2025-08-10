import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { Minus, Square, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useThemeClasses } from "../hooks/useThemeClasses";

export function Titlebar() {
    const [hovered, setHovered] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const THEME = useThemeClasses();

    useEffect(() => {
        let unlistenFn: (() => void) | undefined;

        const setup = async () => {
            try {
                const INITIAL_STATUS = await invoke<boolean>(
                    "check_connection_command",
                );
                setIsConnected(INITIAL_STATUS);
            } catch (error) {
                console.error(error);
            }

            const unlisten = await listen<{ connected: boolean }>(
                "connection-status-changed",
                (event) => {
                    setIsConnected(event.payload.connected);
                },
            );
            unlistenFn = unlisten;
        };

        setup();

        return () => {
            if (unlistenFn) {
                unlistenFn();
            }
        };
    }, []);

    return (
        <div
            data-tauri-drag-region
            className={THEME.combine(
                "h-10 flex justify-between items-center px-4 border-b select-none",
                THEME.border.primary,
            )}
        >
            <div className="flex items-center">
                <span
                    className={THEME.combine(
                        "text-sm font-medium",
                        THEME.text.primary,
                    )}
                >
                    Nocturnal UI
                </span>
                <span
                    className={THEME.combine(
                        "text-xs mx-2",
                        THEME.text.tertiary,
                    )}
                >
                    |
                </span>
                <span
                    className={THEME.combine("text-xs", THEME.text.secondary)}
                >
                    {isConnected ? "Connected" : "Not connected"}
                </span>
            </div>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => getCurrentWindow().close()}
                    onMouseEnter={() => setHovered("close")}
                    onMouseLeave={() => setHovered(null)}
                    className={THEME.combine(
                        "w-3 h-3 rounded-full relative",
                        THEME.controls.close,
                    )}
                    type="button"
                >
                    {hovered === "close" && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <X size={7} color="black" strokeWidth={2} />
                        </div>
                    )}
                </button>
                <button
                    onClick={() => getCurrentWindow().minimize()}
                    onMouseEnter={() => setHovered("minimize")}
                    onMouseLeave={() => setHovered(null)}
                    className={THEME.combine(
                        "w-3 h-3 rounded-full relative",
                        THEME.controls.minimize,
                    )}
                    type="button"
                >
                    {hovered === "minimize" && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Minus size={7} color="black" strokeWidth={2} />
                        </div>
                    )}
                </button>
                <button
                    onClick={() => getCurrentWindow().toggleMaximize()}
                    onMouseEnter={() => setHovered("maximize")}
                    onMouseLeave={() => setHovered(null)}
                    className={THEME.combine(
                        "w-3 h-3 rounded-full relative",
                        THEME.controls.maximize,
                    )}
                    type="button"
                >
                    {hovered === "maximize" && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <Square size={6} color="black" strokeWidth={2} />
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
