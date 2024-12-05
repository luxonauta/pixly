import { Transition, TransitionChild } from "@headlessui/react";
import React from "react";
import { useShortcutStore } from "@/hooks/use-shortcut-indicator";

export const ShortcutIndicator: React.FC = () => {
  const { isVisible, currentShortcut } = useShortcutStore();
  const combinedKeys = currentShortcut.keys.join(" plus ");

  return (
    <Transition appear show={isVisible}>
      <div
        className="fixed bottom-4 right-4 z-50"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <TransitionChild
          enter="transition duration-300 ease-out"
          enterFrom="transform translate-y-4 opacity-0"
          enterTo="transform translate-y-0 opacity-100"
          leave="transition duration-200 ease-in"
          leaveFrom="transform translate-y-0 opacity-100"
          leaveTo="transform translate-y-4 opacity-0"
        >
          <div
            className="flex items-center gap-2 rounded-lg bg-black/90 px-3 py-2 text-sm text-white backdrop-blur-sm"
            role="alert"
            aria-label={`Active shortcut: ${combinedKeys}`}
          >
            {currentShortcut.keys.map((key, index) => (
              <React.Fragment key={key}>
                <span
                  className="inline-block rounded border border-white/20 bg-white/10 px-2 py-0.5 font-medium"
                  role="presentation"
                >
                  {key}
                </span>
                {index < currentShortcut.keys.length - 1 && (
                  <span
                    className="text-white/60"
                    role="presentation"
                    aria-hidden="true"
                  >
                    +
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </TransitionChild>
      </div>
    </Transition>
  );
};
