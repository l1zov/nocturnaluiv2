import { useEffect } from "react";
import { useThemeRawColors } from "../../hooks/useThemeRawColors";
import type { EditorStyles } from "../../types/editor";

export function useEditorStyles(): EditorStyles {
    const rawColors = useThemeRawColors();

    useEffect(() => {
        const styleId = "dynamic-scrollbar-styles";
        let styleElement = document.getElementById(
            styleId,
        ) as HTMLStyleElement | null;

        if (!styleElement) {
            styleElement = document.createElement("style");
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
    }, []);

    useEffect(() => {
        const styleId = "dynamic-suggestion-styles";
        let styleElement = document.getElementById(
            styleId,
        ) as HTMLStyleElement | null;

        if (!styleElement) {
            styleElement = document.createElement("style");
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

    return {
        scrollbar: "ace_scrollbar",
        suggestions: "ace_editor ace_autocomplete",
    };
}
