import React from "react";

import { useShortcutStore } from "@/hooks/use-shortcut-indicator";

export const ShortcutIndicator = () => {
  const { isVisible, currentShortcut } = useShortcutStore();

  if (!isVisible || !currentShortcut?.keys) {
    return null;
  }

  const combinedKeys = currentShortcut.keys.join(" plus ");

  return (
    <div aria-label={`Keyboard shortcut: ${combinedKeys}`}>
      {currentShortcut.keys.map((key: string, index: number) => (
        <React.Fragment key={key}>
          <kbd aria-label={key}>{key}</kbd>
          {index < currentShortcut.keys.length - 1 && <span>+</span>}
        </React.Fragment>
      ))}
    </div>
  );
};
