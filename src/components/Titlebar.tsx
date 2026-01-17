import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useThemeClasses } from '../hooks/useThemeClasses';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { windowService } from '../services';
import { useTitlebarStore } from '../store/titlebarStore';
import type { ConnectionStatusPayload, WindowControlButton } from '../types';
import {
  TrafficLightUnfocusedSVG,
  CloseNormalSVG,
  CloseHoverSVG,
  ClosePressedSVG,
  MinimizeNormalSVG,
  MinimizeHoverSVG,
  MinimizePressedSVG,
  MaximizeNormalSVG,
  MaximizeHoverSVG,
  MaximizePressedSVG,
} from './TrafficLightIcons';

export function Titlebar() {
  const [isConnected, setIsConnected] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const { hoveredButton, setHoveredButton, pressedButton, setPressedButton } = useTitlebarStore();
  const theme = useThemeClasses();

  useEffect(() => {
    let unlistenFn: (() => void) | undefined;
    let cleanupFocusListener: (() => void) | undefined;

    const setup = async () => {
      try {
        const initialStatus = await invoke<boolean>('check_connection_command');
        setIsConnected(initialStatus);
      } catch (error) {
        console.error(error);
      }

      const unlisten = await listen<ConnectionStatusPayload>('connection-status-changed', (event) => {
        setIsConnected(event.payload.connected);
      });
      unlistenFn = unlisten;

      cleanupFocusListener = windowService.subscribe((state) => {
        setIsWindowFocused(state.focused);
      });

      if (!windowService.isInitialized()) {
        await windowService.initializeFocusListeners();
      }
    };

    setup();

    return () => {
      if (unlistenFn) {
        unlistenFn();
      }
      if (cleanupFocusListener) {
        cleanupFocusListener();
      }
    };
  }, []);

  const renderTrafficLight = (
    isFocused: boolean,
    pressedState: WindowControlButton | null,
    hoveredState: WindowControlButton | null,
    normalComponent: ReactNode,
    hoverComponent: ReactNode,
    pressedComponent: ReactNode
  ): ReactNode => {
    if (!isFocused) {
      return <TrafficLightUnfocusedSVG />;
    }
    return pressedState ? pressedComponent : hoveredState ? hoverComponent : normalComponent;
  };

  return (
    <div data-tauri-drag-region className={theme.combine(
      "h-10 flex justify-between items-center px-4 border-b select-none",
      theme.border.primary
    )}>
      <div className="flex items-center">
        <span className={theme.combine("text-sm font-medium", theme.text.primary)}>Nocturnal UI</span>
        <span className={theme.combine("text-xs mx-2", theme.text.tertiary)}>|</span>
        <span className={theme.combine("text-xs", theme.text.secondary)}>
          {isConnected ? 'Connected' : 'Not connected'}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => windowService.close()}
          onMouseEnter={() => setHoveredButton('close')}
          onMouseLeave={() => setHoveredButton(null)}
          onMouseDown={() => setPressedButton('close')}
          onMouseUp={() => setPressedButton(null)}
          className="w-3 h-3 relative flex items-center justify-center"
        >
          {renderTrafficLight(
            isWindowFocused,
            pressedButton === 'close' ? 'close' : null,
            hoveredButton === 'close' ? 'close' : null,
            <CloseNormalSVG />,
            <CloseHoverSVG />,
            <ClosePressedSVG />
          )}
        </button>
        <button
          onClick={() => windowService.minimize()}
          onMouseEnter={() => setHoveredButton('minimize')}
          onMouseLeave={() => setHoveredButton(null)}
          onMouseDown={() => setPressedButton('minimize')}
          onMouseUp={() => setPressedButton(null)}
          className="w-3 h-3 relative flex items-center justify-center"
        >
          {renderTrafficLight(
            isWindowFocused,
            pressedButton === 'minimize' ? 'minimize' : null,
            hoveredButton === 'minimize' ? 'minimize' : null,
            <MinimizeNormalSVG />,
            <MinimizeHoverSVG />,
            <MinimizePressedSVG />
          )}
        </button>
        <button
          onClick={() => windowService.toggleMaximize()}
          onMouseEnter={() => setHoveredButton('maximize')}
          onMouseLeave={() => setHoveredButton(null)}
          onMouseDown={() => setPressedButton('maximize')}
          onMouseUp={() => setPressedButton(null)}
          className="w-3 h-3 relative flex items-center justify-center"
        >
          {renderTrafficLight(
            isWindowFocused,
            pressedButton === 'maximize' ? 'maximize' : null,
            hoveredButton === 'maximize' ? 'maximize' : null,
            <MaximizeNormalSVG />,
            <MaximizeHoverSVG />,
            <MaximizePressedSVG />
          )}
        </button>
      </div>
    </div>
  );
}
