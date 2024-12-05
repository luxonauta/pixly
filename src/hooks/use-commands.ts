import { useCallback, useEffect } from "react";
import type { CommandHistory } from "@/commands/history";

export const useCommands = (history: CommandHistory) => {
  const handleKeyboardShortcuts = useCallback(
    (event: KeyboardEvent) => {
      // Handle Undo: Ctrl/Cmd + Z
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key === "z" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        history.undo();
      }

      // Handle Redo: Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y
      if (
        (event.ctrlKey || event.metaKey) &&
        ((event.key === "z" && event.shiftKey) || event.key === "y")
      ) {
        event.preventDefault();
        history.redo();
      }
    },
    [history]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardShortcuts);
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);
};
