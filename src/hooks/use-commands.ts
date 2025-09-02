import { useCallback, useEffect } from "react";

import type { CommandHistory } from "@/commands/history";

import { useShortcutStore } from "./use-shortcut-indicator";

export const useCommands = (history: CommandHistory) => {
  const showShortcut = useShortcutStore((state) => state.showShortcut);

  const handleKeyboardShortcuts = useCallback(
    (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        history.undo();
        showShortcut({
          keys: [event.metaKey ? "⌘" : "Ctrl", "Z"]
        });
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        ((event.key === "z" && event.shiftKey) || event.key === "y")
      ) {
        event.preventDefault();
        history.redo();
        showShortcut({
          keys:
            event.key === "y"
              ? [event.metaKey ? "⌘" : "Ctrl", "Y"]
              : [event.metaKey ? "⌘" : "Ctrl", "Shift", "Z"]
        });
      }
    },
    [history, showShortcut]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);
};
