import { invoke } from "@tauri-apps/api/core";
import ace from "ace-builds";
import { useEffect, useRef } from "react";
import AceEditor from "react-ace";
import { useTheme } from "../../context/themeContext";
import type { EditorContentProps } from "../../types/editor";

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

export function EditorContent({
    activeTab,
    onContentChange,
    onExecute,
}: EditorContentProps) {
    const { currentTheme } = useTheme();
    const editorRef = useRef<any>(null);
    const handleExecuteRef = useRef<() => void>(() => {});

    useEffect(() => {
        const langTools = ace.require("ace/ext/language_tools");

        const luaCompleter = {
            getCompletions: async (
                _editor: any,
                _session: any,
                _pos: any,
                _prefix: any,
                callback: any,
            ) => {
                const suggestions = await fetchSuggestions();
                callback(
                    null,
                    suggestions.map((s: any) => ({
                        caption: s.label,
                        value: s.label,
                        meta: s.detail || "keyword",
                        docHTML: s.documentation,
                    })),
                );
            },
        };

        langTools.addCompleter(luaCompleter);
    }, []);

    useEffect(() => {
        handleExecuteRef.current = onExecute;
    }, [onExecute]);

    return (
        <div className="flex-1 w-full h-full overflow-hidden">
            <AceEditor
                mode="lua"
                theme={currentTheme.editorTheme}
                onChange={onContentChange}
                onLoad={(editor) => {
                    editorRef.current = editor;
                    editor.commands.addCommand({
                        name: "executeScript",
                        bindKey: { mac: "Command-Enter" },
                        exec: () => handleExecuteRef.current(),
                    });
                }}
                value={activeTab?.content || ""}
                name="nocturnal_ace_editor"
                height="100%"
                width="100%"
                showPrintMargin={false}
                editorProps={{ $blockScrolling: true }}
                setOptions={{
                    fontFamily: "Fira Code",
                    fontSize: 16,
                    enableBasicAutocompletion: true,
                    enableLiveAutocompletion: true,
                    highlightActiveLine: false,
                    wrap: true,
                    showPrintMargin: false,
                }}
            />
        </div>
    );
}
