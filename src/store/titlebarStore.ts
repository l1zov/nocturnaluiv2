import { create } from 'zustand';
import type { TitlebarStore } from '../types';

export const useTitlebarStore = create<TitlebarStore>((set) => ({
  hoveredButton: null,
  setHoveredButton: (button) => set({ hoveredButton: button }),
  pressedButton: null,
  setPressedButton: (button) => set({ pressedButton: button }),
}));
