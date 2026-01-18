import { useState } from 'react';
import { useThemeClasses } from '../../hooks/useThemeClasses';
import type { EditorToolbarProps } from '../../types';

export function EditorToolbar({
  isConnected,
  theme,
  onClear,
  onExecute,
}: EditorToolbarProps) {
  const themeClasses = useThemeClasses();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={themeClasses.combine(
        "flex items-center justify-between p-2 border-t",
        themeClasses.border.primary
      )}
    >
      <button
        onClick={onClear}
        style={{
          backgroundColor: theme.colors.background.tertiary,
          color: theme.colors.text.secondary,
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 500,
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          marginRight: '8px'
        }}
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
          backgroundColor:
            isConnected
              ? isPressed
                ? theme.colors.background.active
                : theme.colors.accent.primary
              : theme.colors.background.tertiary,
          color: isConnected ? theme.colors.text.primary : theme.colors.text.muted,
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: 500,
          border: 'none',
          cursor: isConnected ? 'pointer' : 'not-allowed',
          opacity: isConnected ? 1 : 0.5,
          transform: isPressed && isConnected ? 'scale(0.92)' : 'scale(1)',
          transition: 'transform 0.1s ease, background-color 0.2s ease',
        }}
      >
        Execute
      </button>
    </div>
  );
}
