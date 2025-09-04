"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  confirmLabel?: string;
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
}

export const Dialog = ({
  confirmLabel = "Got it!",
  isOpen,
  message,
  onClose,
  onConfirm,
  title
}: DialogProps) => {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    if (onConfirm) {
      onConfirm();
    }

    closeDialog();
  }, [onConfirm, closeDialog]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        event.preventDefault();
        closeDialog();
      }
    },
    [isOpen, closeDialog]
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!dialogRef.current) return;

      const rect = dialogRef.current.getBoundingClientRect();

      if (
        rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY
      ) {
        closeDialog();
      }
    },
    [closeDialog]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("block-overflow");
      dialogRef.current?.showModal();
      document.addEventListener("click", handleClickOutside);
    } else {
      document.body.classList.remove("block-overflow");
      dialogRef.current?.close();
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.body.classList.remove("block-overflow");
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  if (!mounted) return null;

  const dialogContent = (
    <dialog ref={dialogRef} onClose={closeDialog}>
      <div>
        <div>
          <h3>{title}</h3>
          <p>{message}</p>
          <form method="dialog">
            <button type="submit" onClick={handleConfirm}>
              {confirmLabel}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );

  return createPortal(dialogContent, document.body);
};
