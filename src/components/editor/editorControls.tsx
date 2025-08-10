import { useState } from "react";
import { useTheme } from "../../context/themeContext";
import { useThemeClasses } from "../../hooks/useThemeClasses";
import type { EditorControlsProps } from "../../types/editor";

export function EditorControls({
    onClear,
    onExecute,
    isConnected,
}: EditorControlsProps) {
    const { currentTheme } = useTheme();
    const theme = useThemeClasses();
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div
            className={theme.combine(
                "flex items-center justify-between p-2 border-t",
                theme.border.primary,
            )}
        >
            <button
                onClick={onClear}
                style={{
                    backgroundColor: currentTheme.colors.background.tertiary,
                    color: currentTheme.colors.text.secondary,
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    transition: "background-color 0.2s ease",
                    marginRight: "8px",
                }}
                type="button"
            >
                Clear
            </button>
            <button
                onClick={onExecute}
                onMouseDown={() => setIsPressed(true)}
                onMouseUp={() => setIsPressed(false)}
                onMouseLeave={() => setIsPressed(false)}
                disabled={!isConnected}
                style={{
                    backgroundColor: isConnected
                        ? isPressed
                            ? currentTheme.colors.background.active
                            : currentTheme.colors.accent.primary
                        : currentTheme.colors.background.tertiary,
                    color: isConnected
                        ? currentTheme.colors.text.primary
                        : currentTheme.colors.text.muted,
                    padding: "4px 12px",
                    borderRadius: "4px",
                    fontSize: "16px",
                    fontWeight: 500,
                    border: "none",
                    cursor: isConnected ? "pointer" : "not-allowed",
                    opacity: isConnected ? 1 : 0.5,
                    transform:
                        isPressed && isConnected ? "scale(0.92)" : "scale(1)",
                    transition:
                        "transform 0.1s ease, background-color 0.2s ease",
                }}
                type="button"
            >
                Execute
            </button>
        </div>
    );
}
