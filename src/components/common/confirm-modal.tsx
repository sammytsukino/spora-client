import React, { useEffect } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "CONFIRM",
  cancelLabel = "CANCEL",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Esc") {
        event.stopPropagation();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="bg-[#E9E9E9] border-2 border-[#262626] max-w-md w-[90%] px-6 py-5 shadow-[0_0_0_4px_#262626]">
        <h2 className="font-bizud-mincho-bold text-xl mb-3 text-[#262626]">
          {title}
        </h2>
        <p className="font-supply-mono text-[11px] sm:text-xs mb-5 text-[#262626]">
          {description}
        </p>
        <div className="flex justify-end gap-3 font-supply-mono text-[11px] sm:text-xs">
          <button
            type="button"
            className="px-4 py-2 border-2 border-[#262626] bg-[#E9E9E9] text-[#262626] uppercase tracking-[0.25em] hover:bg-[#f5f5f5] cursor-pointer"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="px-4 py-2 border-2 border-[#262626] bg-[#262626] text-[#E9E9E9] uppercase tracking-[0.25em] hover:bg-black cursor-pointer"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

