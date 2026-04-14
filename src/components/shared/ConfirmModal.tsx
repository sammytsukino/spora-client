import { useEffect, useId, useRef } from "react";

export type ConfirmModalVariant = "default" | "danger";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmModalVariant;
  pending?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "CONFIRM",
  cancelLabel = "CANCEL",
  variant = "default",
  pending = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (pending) return;
      if (event.key === "Escape" || event.key === "Esc") {
        event.stopPropagation();
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel, pending]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-[var(--z-spora-loader)] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 duration-normal"
      onClick={() => {
        if (!pending) onCancel();
      }}
      style={{ animation: "fadeIn var(--duration-fast) var(--ease-spora-out)" }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`bg-spora-primary-light max-w-md w-full max-h-[min(85vh,32rem)] overflow-y-auto border shadow-spora-modal outline-none transition-transform duration-normal ${
          isDanger
            ? "border-red-600/80 ring-1 ring-red-600/25"
            : "border-spora-primary"
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp var(--duration-normal) var(--ease-spora-out)" }}
      >
        <div className="px-6 py-5">
          <h2
            id={titleId}
            className={`font-bizud-mincho-bold text-xl mb-3 ${
              isDanger ? "text-red-700" : "text-spora-primary"
            }`}
          >
            {title}
          </h2>
          <p
            id={descriptionId}
            className="font-supply-mono text-caption-sm sm:text-xs mb-6 text-spora-primary leading-relaxed"
          >
            {description}
          </p>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 font-supply-mono text-caption-sm sm:text-xs">
            <button
              type="button"
              disabled={pending}
              className="px-4 py-2.5 border border-spora-primary bg-spora-primary-light text-spora-primary uppercase tracking-[0.2em] hover:bg-spora-primary-lighter cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={pending}
              className={`px-4 py-2.5 border uppercase tracking-[0.2em] cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed ${
                isDanger
                  ? "border-red-700 bg-red-700 text-white hover:bg-red-800"
                  : "border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-black"
              }`}
              onClick={() => void onConfirm()}
            >
              {pending ? "…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
