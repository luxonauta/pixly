import { create } from "zustand";

interface Shortcut {
  keys: string[];
}

interface ShortcutStore {
  isVisible: boolean;
  currentShortcut: Shortcut;
  timeoutId: NodeJS.Timeout | undefined;
  timeoutDuration: number;
  showShortcut: (shortcut: Shortcut) => void;
  setTimeoutDuration: (duration: number) => void;
}

export const useShortcutStore = create<ShortcutStore>((set, get) => ({
  isVisible: false,
  currentShortcut: { keys: [] },
  timeoutId: undefined,
  timeoutDuration: 1000,

  showShortcut: (shortcut: Shortcut) => {
    const state = get();

    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
    }

    const timeoutId = setTimeout(() => {
      set({ isVisible: false });
    }, state.timeoutDuration);

    set({
      currentShortcut: shortcut,
      isVisible: true,
      timeoutId
    });
  },

  setTimeoutDuration: (duration: number) => {
    set({ timeoutDuration: duration });
  }
}));
