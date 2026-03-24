import { useEffect } from "react";

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-normal"
      onClick={onCancel}
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div 
        className="bg-[var(--spora-primary-light)] border border-[var(--spora-primary)] max-w-md w-[90%] px-6 py-5 shadow-spora-modal transition-transform duration-normal"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        <h2 className="font-bizud-mincho-bold text-xl mb-3 text-[var(--spora-primary)]">
          {title}
        </h2>
        <p className="font-supply-mono text-caption-sm sm:text-xs mb-5 text-[var(--spora-primary)]">
          {description}
        </p>
        <div className="flex justify-end gap-3 font-supply-mono text-caption-sm sm:text-xs">
          <button
            type="button"
            className="px-4 py-2 border border-[var(--spora-primary)] bg-[var(--spora-primary-light)] text-[var(--spora-primary)] uppercase tracking-[0.25em] hover:bg-[#f5f5f5] cursor-pointer"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-[var(--spora-primary)] bg-[var(--spora-primary)] text-[var(--spora-primary-light)] uppercase tracking-[0.25em] hover:bg-black cursor-pointer"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
