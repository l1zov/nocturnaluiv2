import type { WindowControlButton } from './window';

export interface TitlebarStore {
  hoveredButton: WindowControlButton | null;
  setHoveredButton: (button: WindowControlButton | null) => void;
  pressedButton: WindowControlButton | null;
  setPressedButton: (button: WindowControlButton | null) => void;
}

export interface EditorStore {
  content: string;
  setContent: (content: string) => void;
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
}
