import { invoke } from '@tauri-apps/api/core';

export type Settings = {
  theme: string
  fontFamily: string
  fontSize: number
  autosave: boolean
  autosaveIntervalSec: number
  showLineNumbers: boolean
  [key: string]: unknown
}

const DEFAULTS: Settings = {
  theme: 'default',
  fontFamily: 'Fira Code',
  fontSize: 16,
  autosave: true,
  autosaveIntervalSec: 5,
  showLineNumbers: true,
}

type Listener = (s: Settings) => void

class SettingsServiceClass {
  private storageKey = 'settings'
  private settings: Settings
  private listeners: Listener[] = []
  private initialized = false

  constructor() {
    this.settings = { ...DEFAULTS }
    this.load()
  }

  private async save() {
    try {
      await invoke('save_settings', {
        key: this.storageKey,
        value: JSON.stringify(this.settings)
      });
    } catch (error) {
      console.error('[SettingsService.save]', error);
    }
  }

  private async load() {
    try {
      const raw = await invoke<string | null>('load_settings', {
        key: this.storageKey
      });
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Settings>;
        this.settings = { ...DEFAULTS, ...parsed };
      }
    } catch (error) {
      console.error('[SettingsService.load]', error);
      this.settings = { ...DEFAULTS };
    } finally {
      this.initialized = true;
      this.emit();
    }
  }

  get() {
    return { ...this.settings }
  }

  getKey<K extends keyof Settings>(key: K) {
    return this.settings[key]
  }

  set(patch: Partial<Settings>) {
    this.settings = { ...this.settings, ...patch }
    this.save()
    this.emit()
  }

  setKey<K extends keyof Settings>(key: K, value: Settings[K]) {
    this.settings[key] = value
    this.save()
    this.emit()
  }

  reset() {
    this.settings = { ...DEFAULTS }
    this.save()
    this.emit()
  }

  subscribe(fn: Listener) {
    this.listeners.push(fn)
    if (this.initialized) {
      fn(this.get())
    }
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn)
    }
  }

  private emit() {
    const snapshot = this.get()
    this.listeners.forEach((l) => l(snapshot))
  }
}

export const settingsService = new SettingsServiceClass()

export const DEFAULT_SETTINGS = DEFAULTS
