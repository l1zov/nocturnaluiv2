import { getCurrentWindow } from '@tauri-apps/api/window';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { X, Minus, Square, Plug, Unplug, LogOut } from 'lucide-react';
import { useThemeClasses } from '../hooks/useThemeClasses';

interface Props {
  onLogout?: () => void;
}

export function Titlebar({ onLogout }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [port, setPort] = useState<number | null>(null);
  const theme = useThemeClasses();

  useEffect(() => {
    const check = async () => {
      try {
        const status = await invoke<boolean>('check_connection_command');
        setConnected(status);
        
        if (status) {
          const p = await invoke<number | null>('get_connected_port_command');
          setPort(p);
        } else {
          setPort(null);
        }
      } catch (error) {
        console.error('Connection error:', error);
        setConnected(false);
        setPort(null);
      }
    };

    check();
    const interval = setInterval(check, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatus = () => {
    if (!connected) {
      return "Not connected";
    }
    if (port) {
      return `Connected (Port: ${port})`;
    }
    return "Connected";
  };

  return (
    <div data-tauri-drag-region className={theme.combine(
      "h-10 flex justify-between items-center px-4 border-b",
      theme.border.primary
    )}>
      <div className="flex items-center">
        <img 
          src="/mask.png" 
          alt="Nocturnal UI Logo" 
          className="w-6 h-6 mr-2"
        />
        <span className={theme.combine("text-sm font-medium", theme.text.primary)}>Nocturnal UI</span>
        <span className={theme.combine("text-xs mx-2", theme.text.tertiary)}>|</span>
        <div className="flex items-center space-x-1">
          <span className={theme.combine("text-xs", connected ? theme.text.accent : theme.text.secondary)}>
            {getStatus()}
          </span>
          {connected ? (
            <Plug size={12} className={theme.text.accent} />
          ) : (
            <Unplug size={12} className={theme.text.secondary} />
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {onLogout && (
          <button
            onClick={onLogout}
            onMouseEnter={() => setHovered('logout')}
            onMouseLeave={() => setHovered(null)}
            className={theme.combine(
              "p-1 rounded hover:bg-opacity-20 transition-colors",
              theme.text.secondary,
              "hover:bg-red-500"
            )}
            title="Logout"
          >
            <LogOut size={14} />
          </button>
        )}
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
