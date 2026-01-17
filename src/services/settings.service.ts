import { invoke, BaseService, debounce } from './base';
import type { Settings } from '../types';

export type { Settings };

const DEFAULTS: Settings = {
    theme: 'default',
    fontFamily: 'Fira Code',
    fontSize: 16,
    autosave: true,
    autosaveIntervalSec: 5,
    showLineNumbers: true,
};

class SettingsServiceClass extends BaseService<Settings> {
    private storageKey = 'settings';
    private settings: Settings;

    private debouncedSave = debounce(() => this.persistSettings(), 300);

    constructor() {
        super();
        this.settings = { ...DEFAULTS };
        this.load();
    }

    protected getSnapshot(): Settings {
        return { ...this.settings };
    }

    private async persistSettings(): Promise<void> {
        await invoke('save_settings', {
            key: this.storageKey,
            value: JSON.stringify(this.settings)
        }, { context: 'SettingsService.save' });
    }

    private async load(): Promise<void> {
        try {
            const raw = await invoke<string | null>('load_settings', {
                key: this.storageKey
            }, { context: 'SettingsService.load' });

            if (raw) {
                const parsed = JSON.parse(raw) as Partial<Settings>;
                this.settings = { ...DEFAULTS, ...parsed };
            }
        } catch (error) {
            this.settings = { ...DEFAULTS };
        } finally {
            this.markInitialized();
        }
    }

    // get all settings
    get(): Settings {
        return this.getSnapshot();
    }

    // get a specific setting value
    getKey<K extends keyof Settings>(key: K): Settings[K] {
        return this.settings[key];
    }

    // update multiple settings at once
    set(patch: Partial<Settings>): void {
        this.settings = { ...this.settings, ...patch };
        this.debouncedSave();
        this.notify();
    }

    // update a single setting
    setKey<K extends keyof Settings>(key: K, value: Settings[K]): void {
        this.settings[key] = value;
        this.debouncedSave();
        this.notify();
    }

    // reset all settings to defaults
    reset(): void {
        this.settings = { ...DEFAULTS };
        this.debouncedSave();
        this.notify();
    }

    // force immediate save (bypasses debounce)
    async saveNow(): Promise<void> {
        this.debouncedSave.cancel();
        await this.persistSettings();
    }
}

export const settingsService = new SettingsServiceClass();
export const DEFAULT_SETTINGS = DEFAULTS;
