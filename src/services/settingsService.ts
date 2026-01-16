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
  theme: 'system',
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

  constructor() {
    this.settings = { ...DEFAULTS }
    this.load()
  }

  private save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (error) {
      console.error('[SettingsService.save]', error);
    }
  }

  private load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<Settings>;
      this.settings = { ...DEFAULTS, ...parsed };
    } catch (error) {
      console.error('[SettingsService.load]', error);
      this.settings = { ...DEFAULTS };
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
    fn(this.get())
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn)
    }
  }

  private emit() {
    const snapshot = this.get()
    this.listeners.forEach((l) => l(snapshot))
  }

  clearStorage() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('[SettingsService.clearStorage]', error);
    }
  }
}

export const settingsService = new SettingsServiceClass()

export const DEFAULT_SETTINGS = DEFAULTS
