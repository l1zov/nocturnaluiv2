import { getCurrentWindow } from '@tauri-apps/api/window';
import { invokeRequired, BaseService, type Unsubscribe } from './base';
import type { WindowControlButton } from '../types';

// window focus state for subscribers
export interface WindowFocusState {
  focused: boolean;
}

class WindowServiceClass extends BaseService<WindowFocusState> {
  private focusState: WindowFocusState = { focused: true };
  private cleanupFns: (() => void)[] = [];

  constructor() {
    super();
  }

  protected getSnapshot(): WindowFocusState {
    return { ...this.focusState };
  }

  // initialize window focus listeners
  // should be called once when app starts
  async initializeFocusListeners(): Promise<Unsubscribe> {
    const appWindow = getCurrentWindow();

    const unlistenFocus = await appWindow.onFocusChanged(({ payload: focused }) => {
      this.setFocused(focused);
    });

    const handleFocus = () => this.setFocused(true);
    const handleBlur = () => this.setFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    const cleanup = () => {
      unlistenFocus();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };

    this.cleanupFns.push(cleanup);
    this.markInitialized();

    return cleanup;
  }

  private setFocused(focused: boolean): void {
    this.focusState = { focused };
    this.notify();
  }

  isFocused(): boolean {
    return this.focusState.focused;
  }

  async close(): Promise<void> {
    await invokeRequired<void>('close_window', undefined, 'WindowService.close');
  }

  async minimize(): Promise<void> {
    await invokeRequired<void>('minimize_window', undefined, 'WindowService.minimize');
  }

  async toggleMaximize(): Promise<void> {
    await invokeRequired<void>('toggle_maximize_window', undefined, 'WindowService.toggleMaximize');
  }

  async executeControl(button: WindowControlButton): Promise<void> {
    switch (button) {
      case 'close':
        return this.close();
      case 'minimize':
        return this.minimize();
      case 'maximize':
        return this.toggleMaximize();
    }
  }

  // cleanup all listeners
  destroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}

// export singleton instance
export const windowService = new WindowServiceClass();
