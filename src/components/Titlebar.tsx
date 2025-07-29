import { getCurrentWindow } from '@tauri-apps/api/window';
import { useState } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { useThemeClasses } from '../hooks/useThemeClasses';

export function Titlebar() {
  const [hovered, setHovered] = useState<string | null>(null);
  const theme = useThemeClasses();

  return (
    <div data-tauri-drag-region className={theme.combine(
      "h-10 flex justify-between items-center px-4 border-b",
      theme.border.primary
    )}>
      <div className="flex items-center">
        <span className={theme.combine("text-sm font-medium", theme.text.primary)}>Nocturnal UI</span>
        <span className={theme.combine("text-xs mx-2", theme.text.tertiary)}>|</span>
        <span className={theme.combine("text-xs", theme.text.secondary)}>Not connected</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => getCurrentWindow().close()}
          onMouseEnter={() => setHovered('close')}
          onMouseLeave={() => setHovered(null)}
          className={theme.combine("w-3 h-3 rounded-full relative", theme.controls.close)}
        >
          {hovered === 'close' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <X size={7} color="black" strokeWidth={2} />
            </div>
          )}
        </button>
        <button
          onClick={() => getCurrentWindow().minimize()}
          onMouseEnter={() => setHovered('minimize')}
          onMouseLeave={() => setHovered(null)}
          className={theme.combine("w-3 h-3 rounded-full relative", theme.controls.minimize)}
        >
          {hovered === 'minimize' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Minus size={7} color="black" strokeWidth={2} />
            </div>
          )}
        </button>
        <button
          onClick={() => getCurrentWindow().toggleMaximize()}
          onMouseEnter={() => setHovered('maximize')}
          onMouseLeave={() => setHovered(null)}
          className={theme.combine("w-3 h-3 rounded-full relative", theme.controls.maximize)}
        >
          {hovered === 'maximize' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Square size={6} color="black" strokeWidth={2} />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
