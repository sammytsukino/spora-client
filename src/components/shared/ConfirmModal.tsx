import { useEffect, useId, useRef } from "react";

export type ConfirmModalVariant = "default" | "danger";
const FOCUS_DELAY_MS = 0;

const CONFIRM_VARIANT_STYLES: Record<
  ConfirmModalVariant,
  { panelClass: string; titleClass: string; confirmButtonClass: string }
> = {
  default: {
    panelClass: "border-spora-primary",
    titleClass: "text-spora-primary",
    confirmButtonClass: "border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-black",
  },
  danger: {
    panelClass: "border-rose-500/80 ring-1 ring-rose-500/25",
    titleClass: "text-rose-500",
    confirmButtonClass: "border-rose-500 bg-rose-500 text-white hover:bg-rose-600",
  },
};

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
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (pending) return;
      if (event.key === "Escape" || event.key === "Esc") {
        event.stopPropagation();
        onCancel();
      } else if (event.key === "Tab") {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = Array.from(
          panel.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, onCancel, pending]);

  useEffect(() => {
    if (!open) return;
    const focusTimeoutId = window.setTimeout(() => {
      panelRef.current?.focus();
    }, FOCUS_DELAY_MS);
    return () => window.clearTimeout(focusTimeoutId);
  }, [open]);

  if (!open) return null;

  const { panelClass, titleClass, confirmButtonClass } = CONFIRM_VARIANT_STYLES[variant];

  return (
    <div
      className="fixed inset-0 z-(--z-spora-loader) flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 duration-normal"
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
        className={`bg-spora-primary-light max-w-md w-full max-h-[min(85vh,32rem)] overflow-y-auto border shadow-spora-modal outline-none transition-transform duration-normal ${panelClass}`}
        onClick={(event) => event.stopPropagation()}
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
                confirmButtonClass
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
