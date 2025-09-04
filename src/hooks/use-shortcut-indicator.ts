import { create } from "zustand";

interface Shortcut {
  keys: string[];
}

interface ShortcutStore {
  isVisible: boolean;
  currentShortcut: Shortcut;
  timeoutId: ReturnType<typeof setTimeout> | undefined;
  timeoutDuration: number;
  showShortcut: (shortcut: Shortcut) => void;
  setTimeoutDuration: (duration: number) => void;
}

export const useShortcutStore = create<ShortcutStore>((set, get) => ({
  isVisible: false,
  currentShortcut: { keys: [] },
  timeoutId: undefined,
  timeoutDuration: 1200,
  showShortcut: (shortcut) => {
    const state = get();

    if (state.timeoutId) clearTimeout(state.timeoutId);

    const timeoutId = setTimeout(() => {
      set({ isVisible: false });
    }, state.timeoutDuration);

    set({
      currentShortcut: shortcut,
      isVisible: true,
      timeoutId
    });
  },
  setTimeoutDuration: (duration) => set({ timeoutDuration: duration })
}));
