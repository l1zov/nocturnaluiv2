import { create } from 'zustand';

interface TitlebarStore {
  hoveredButton: string | null;
  setHoveredButton: (button: string | null) => void;
  pressedButton: string | null;
  setPressedButton: (button: string | null) => void;
}

export const useTitlebarStore = create<TitlebarStore>((set) => ({
  hoveredButton: null,
  setHoveredButton: (button: string | null) => set({ hoveredButton: button }),
  pressedButton: null,
  setPressedButton: (button: string | null) => set({ pressedButton: button }),
}));
