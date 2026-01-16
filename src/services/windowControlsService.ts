import { invoke } from '@tauri-apps/api/core';

export const windowControlsService = {
  async closeWindow(): Promise<void> {
    try {
      await invoke('close_window');
    } catch (error) {
      console.error('close window:', error);
      throw error;
    }
  },

  async minimizeWindow(): Promise<void> {
    try {
      await invoke('minimize_window');
    } catch (error) {
      console.error('minimize window:', error);
      throw error;
    }
  },

  async toggleMaximize(): Promise<void> {
    try {
      await invoke('toggle_maximize_window');
    } catch (error) {
      console.error('maximize window:', error);
      throw error;
    }
  },
};
