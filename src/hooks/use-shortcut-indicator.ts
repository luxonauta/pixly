import { create } from "zustand";

interface Shortcut {
  keys: string[];
}

interface ShortcutStore {
  isVisible: boolean;
  currentShortcut: Shortcut;
  showShortcut: (shortcut: Shortcut) => void;
}

export const useShortcutStore = create<ShortcutStore>((set) => ({
  isVisible: false,
  currentShortcut: { keys: [] },
  showShortcut: (shortcut: Shortcut) => {
    set({ currentShortcut: shortcut, isVisible: true });
    setTimeout(() => {
      set({ isVisible: false });
    }, 1000);
  }
}));
