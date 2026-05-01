import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const LAB_TUTORIAL_KEY = "spora_lab_tutorial_done";

export function getLabTutorialDone(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(LAB_TUTORIAL_KEY) === "1";
}

export function setLabTutorialDone(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(LAB_TUTORIAL_KEY, "1");
}

const STEPS = [
  {
    title: "Welcome to the Laboratory",
    body: "Here you cultivate Floras, generative artworks grown from text. Write, adjust, and watch your creation blossom.",
  },
  {
    title: "Your text is the soil",
    body: "The text area is where you plant your ideas. Add at least 10 characters to begin. Your words (their length, rhythm, sentiment) are mapped into a unique, deterministic artwork. The same text always yields the same Flora.",
  },
  {
    title: "Generate your Flora",
    body: "When ready, generate your Flora. Its metrics will create a one-of-a-kind visual form. Then seal it, share it, or take cuttings to evolve it further.",
  },
];

interface LabTutorialOverlayProps {
  onClose: () => void;
}

export default function LabTutorialOverlay({ onClose }: LabTutorialOverlayProps) {
  const [step, setStep] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleFinish = useCallback(() => {
    setLabTutorialDone();
    onClose();
  }, [onClose]);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimeoutId = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        handleFinish();
        return;
      }
      if (event.key !== "Tab") return;
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
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimeoutId);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      previousFocusRef.current?.focus();
    };
  }, [handleFinish]);

  const overlay = (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      style={{ zIndex: 999_999 }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lab-tutorial-title"
        tabIndex={-1}
        className="bg-spora-primary-light border-2 border-spora-primary max-w-lg w-full p-6 shadow-lg"
      >
        <h2
          id="lab-tutorial-title"
          className="font-bizud-mincho-bold text-xl mb-2 text-spora-primary"
        >
          {current.title}
        </h2>
        <p className="font-supply-mono text-sm text-spora-primary mb-6 leading-relaxed">
          {current.body}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-1">
            {STEPS.map((_, stepIndex) => (
              <span
                key={stepIndex}
                className={`block w-2 h-2 rounded-full transition-colors ${
                  stepIndex === step
                    ? "bg-spora-primary"
                    : "bg-(--spora-primary)/30"
                }`}
                aria-hidden
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFinish}
              className="px-3 py-1.5 font-supply-mono text-[11px] uppercase border border-spora-primary text-spora-primary hover:bg-[#f5f5f5] cursor-pointer"
            >
              Skip
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={handleFinish}
                className="px-4 py-1.5 font-supply-mono text-[11px] uppercase border border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-black cursor-pointer"
              >
                Get started
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((previousStep) => previousStep + 1)}
                className="px-4 py-1.5 font-supply-mono text-[11px] uppercase border border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-black cursor-pointer"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(overlay, document.body);
}
