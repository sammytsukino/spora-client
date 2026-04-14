import { useEffect, useId, useRef } from "react";

export type AlertModalTone = "default" | "warning" | "error";

interface AlertModalProps {
  open: boolean;
  title: string;
  description: string;
  okLabel?: string;
  tone?: AlertModalTone;
  onClose: () => void;
}

export default function AlertModal({
  open,
  title,
  description,
  okLabel = "OK",
  tone = "default",
  onClose,
}: AlertModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Esc") {
        event.stopPropagation();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!open) return null;

  const panelClass =
    tone === "error"
      ? "border-red-600/80 ring-1 ring-red-600/25"
      : tone === "warning"
        ? "border-amber-600/80 ring-1 ring-amber-600/20"
        : "border-spora-primary";

  const titleClass =
    tone === "error"
      ? "text-red-700"
      : tone === "warning"
        ? "text-amber-800"
        : "text-spora-primary";

  const buttonClass =
    tone === "error"
      ? "border-red-700 bg-red-700 text-white hover:bg-red-800"
      : tone === "warning"
        ? "border-amber-800 bg-amber-800 text-white hover:bg-amber-900"
        : "border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-black";

  return (
    <div
      className="fixed inset-0 z-[var(--z-spora-loader)] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 duration-normal"
      onClick={onClose}
      style={{ animation: "fadeIn var(--duration-fast) var(--ease-spora-out)" }}
    >
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className={`bg-spora-primary-light max-w-md w-full max-h-[min(85vh,32rem)] overflow-y-auto border shadow-spora-modal outline-none transition-transform duration-normal ${panelClass}`}
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp var(--duration-normal) var(--ease-spora-out)" }}
      >
        <div className="px-6 py-5">
          <h2
            id={titleId}
            className={`font-bizud-mincho-bold text-xl mb-3 ${titleClass}`}
          >
            {title}
          </h2>
          <p
            id={descriptionId}
            className="font-supply-mono text-caption-sm sm:text-xs mb-6 text-spora-primary leading-relaxed"
          >
            {description}
          </p>
          <div className="flex justify-end font-supply-mono text-caption-sm sm:text-xs">
            <button
              type="button"
              className={`px-4 py-2.5 border uppercase tracking-[0.2em] cursor-pointer shrink-0 ${buttonClass}`}
              onClick={onClose}
            >
              {okLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
