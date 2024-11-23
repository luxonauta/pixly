"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle
} from "@headlessui/react";
import { CustomButton } from "./button";

interface AlertProps {
  confirmLabel?: string;
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
}

export const Alert: React.FC<AlertProps> = ({
  confirmLabel = "Got it, thanks!",
  isOpen,
  message,
  onClose,
  onConfirm,
  title
}) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      transition
      className="relative z-[3] transition duration-300 ease-out focus:outline-none data-[closed]:opacity-0"
      onClose={onClose}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/60 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
        <DialogPanel
          transition
          className="flex w-80 max-w-md flex-col gap-2 rounded-md bg-[#EBEBE6] px-3.5 pb-4 pt-5 shadow-sm duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <DialogTitle as="h3" className="font-bold uppercase">
            {title}
          </DialogTitle>
          <p className="mt-[.125rem]">{message}</p>
          <CustomButton
            label={confirmLabel}
            onClick={handleConfirm}
            className="mt-3 self-end"
          />
        </DialogPanel>
      </div>
    </Dialog>
  );
};
