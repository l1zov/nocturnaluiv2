import { useCallback } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import type { UseHotkeyOptions } from '../types';

export type { UseHotkeyOptions };

export default function useHotkey(
  keys: string | string[],
  handler: (event?: KeyboardEvent) => void,
  deps: any[] = [],
  options: UseHotkeyOptions = {}
) {
  const {
    enabled = true,
    preventDefault,
    stopPropagation,
    filter,
  } = options;

  const wrappedHandler = useCallback(
    (event?: KeyboardEvent) => {
      if (!enabled) return;
      if (preventDefault && event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      if (stopPropagation && event && typeof event.stopPropagation === 'function') {
        event.stopPropagation();
      }
      handler(event);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enabled, preventDefault, stopPropagation, ...deps]
  );

  useHotkeys(
    keys,
    wrappedHandler,
    {
      enabled,
      ...(typeof filter === 'function' ? { filter: filter as any } : {}),
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );
}
