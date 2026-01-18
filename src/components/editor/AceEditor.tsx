import { useRef, useEffect, useCallback, memo } from 'react';
import ReactAceEditor from 'react-ace';
import ace from 'ace-builds';
import { useThemeRawColors } from '../../hooks/useThemeRawColors';
import { suggestionService } from '../../services';
import type { AceCompletion, AceCompleter, AceLangTools, AceEditorComponentProps } from '../../types';

import 'ace-builds/src-noconflict/mode-lua';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-nord_dark';
import 'ace-builds/src-noconflict/theme-gruvbox';
import 'ayu-ace/light';
import '../../themes/ace-default';
import '../../themes/ace-frappe-mist';
import 'ace-builds/src-noconflict/ext-language_tools';

ace.config.set('basePath', '/node_modules/ace-builds/src-noconflict');

type AceEditorInstance = Parameters<NonNullable<React.ComponentProps<typeof ReactAceEditor>['onLoad']>>[0];


const SCROLLBAR_STYLES = `
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

const suggestionCache = {
  data: [] as AceCompletion[],
  fetched: false,
};

const fetchSuggestions = async (): Promise<AceCompletion[]> => {
  if (suggestionCache.fetched) {
    return suggestionCache.data;
  }
  try {
    await suggestionService.loadSuggestions();
    const data = suggestionService.getSuggestions();
    suggestionCache.data = Array.isArray(data) ? data : [];
    suggestionCache.fetched = true;
    return suggestionCache.data;
  } catch (error) {
    console.error('[AceEditor.fetchSuggestions]', error);
    suggestionCache.fetched = true;
    suggestionCache.data = [];
    return [];
  }
};

export const AceEditor = memo(function AceEditor({
  content,
  editorTheme,
  fontFamily,
  fontSize,
  showLineNumbers,
  onContentChange,
  onExecute,
}: AceEditorComponentProps) {
  const rawColors = useThemeRawColors();
  const editorRef = useRef<AceEditorInstance | null>(null);
  const onExecuteRef = useRef(onExecute);

  useEffect(() => {
    onExecuteRef.current = onExecute;
  }, [onExecute]);

  useEffect(() => {
    const styleId = 'ace-scrollbar-styles';
    if (document.getElementById(styleId)) return;

    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = SCROLLBAR_STYLES;
    document.head.appendChild(styleElement);

    return () => {
      styleElement.remove();
    };
  }, []);

  // Inject autocomplete styles based on theme colors
  useEffect(() => {
    const styleId = 'ace-autocomplete-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
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
  }, [rawColors.background.secondary, rawColors.background.tertiary, rawColors.border.primary, rawColors.border.accent, rawColors.text.primary, rawColors.text.accent]);

  // Setup Lua completer once
  useEffect(() => {
    const langTools = ace.require('ace/ext/language_tools') as AceLangTools;

    const luaCompleter: AceCompleter = {
      getCompletions: async (_editor, _session, _pos, _prefix, callback) => {
        const allSuggestions = await fetchSuggestions();
        callback(null, allSuggestions);
      },
    };

    langTools.addCompleter(luaCompleter);
    langTools.setCompleters([luaCompleter]);
  }, []);

  const handleEditorLoad = useCallback((editor: AceEditorInstance) => {
    editorRef.current = editor;
    editor.commands.addCommand({
      name: 'executeScript',
      bindKey: { mac: 'Command-Enter' },
      exec: () => onExecuteRef.current(),
    });
  }, []);

  return (
    <div className="flex-1 w-full h-full overflow-hidden">
      <ReactAceEditor
        mode="lua"
        theme={editorTheme}
        onChange={onContentChange}
        onLoad={handleEditorLoad}
        value={content}
        name="nocturnal_ace_editor"
        height="100%"
        width="100%"
        showPrintMargin={false}
        showGutter={showLineNumbers}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          fontFamily,
          fontSize,
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          liveAutocompletionDelay: 100,
          liveAutocompletionThreshold: 2,
          highlightActiveLine: false,
          wrap: true,
          showPrintMargin: false,
        }}
      />
    </div>
  );
});
