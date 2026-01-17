export interface Settings {
  theme: string;
  fontFamily: string;
  fontSize: number;
  autosave: boolean;
  autosaveIntervalSec: number;
  showLineNumbers: boolean;
  [key: string]: unknown;
}

export type SettingsListener = (settings: Settings) => void;

export type SettingsKey = keyof Settings;
