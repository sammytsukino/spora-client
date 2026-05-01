import { useEffect, useId, useRef } from "react";

export type AlertModalTone = "default" | "warning" | "error";
const FOCUS_DELAY_MS = 0;

const ALERT_TONE_STYLES: Record<
  AlertModalTone,
  { panelClass: string; titleClass: string; buttonClass: string }
> = {
  default: {
    panelClass: "border-spora-primary",
    titleClass: "text-spora-primary",
    buttonClass: "border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-black",
  },
  warning: {
    panelClass: "border-amber-600/80 ring-1 ring-amber-600/20",
    titleClass: "text-amber-800",
    buttonClass: "border-amber-800 bg-amber-800 text-white hover:bg-amber-900",
  },
  error: {
    panelClass: "border-rose-500/80 ring-1 ring-rose-500/25",
    titleClass: "text-rose-500",
    buttonClass: "border-rose-500 bg-rose-500 text-white hover:bg-rose-600",
  },
};

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
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Esc") {
        event.stopPropagation();
        onClose();
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
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const focusTimeoutId = window.setTimeout(() => {
      panelRef.current?.focus();
    }, FOCUS_DELAY_MS);
    return () => window.clearTimeout(focusTimeoutId);
  }, [open]);

  if (!open) return null;

  const { panelClass, titleClass, buttonClass } = ALERT_TONE_STYLES[tone];

  return (
    <div
      className="fixed inset-0 z-(--z-spora-loader) flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 duration-normal"
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
