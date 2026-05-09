import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { setLabTutorialDone } from "@/lib/labTutorialStorage";

type TutorialStep = {
  title: string;
  content: ReactNode;
};

const STEP_PROSE =
  "m-0 font-supply-mono text-caption-sm sm:text-xs leading-relaxed text-spora-primary";

interface LabTutorialOverlayProps {
  onClose: () => void;
}

export default function LabTutorialOverlay({
  onClose,
}: LabTutorialOverlayProps) {
  const steps = useMemo((): TutorialStep[] => {
    return [
      {
        title: "Welcome to the Laboratory",
        content: (
          <p className={STEP_PROSE}>
            Here you cultivate Floras, generative artworks grown from text.
            Write, adjust, and watch your creation blossom.
          </p>
        ),
      },
      {
        title: "Your text is the soil",
        content: (
          <p className={STEP_PROSE}>
            The text area is where you plant your ideas. Add at least 10
            characters to begin. Your words (their length, rhythm, sentiment)
            are mapped into a unique, deterministic artwork. The same text
            always yields the same Flora.
          </p>
        ),
      },
      {
        title: "Generate your Flora",
        content: (
          <p className={STEP_PROSE}>
            When ready, generate your Flora. Its metrics create a one-of-a-kind
            visual form. In the next step you will pick how it goes public once
            you are ready to publish.
          </p>
        ),
      },
      {
        title: "Publishing: Blossoming vs Sealed",
        content: (
          <div className="space-y-10 pb-1">
            <p className={STEP_PROSE}>
              Under{" "}
              <span className="font-semibold uppercase tracking-wide">
                SYSTEM_EXPORT
              </span>{" "}
              you choose how your Flora ships. Hover each publish icon in the
              Lab whenever you want a fast reminder.
            </p>

            <section className="space-y-5">
              <h3 className="m-0 font-bizud-mincho-bold text-lg leading-snug text-spora-primary">
                Blossoming · open lineage
              </h3>
              <p className={`${STEP_PROSE} mb-0`}>
                Others can open your Flora in their Lab, keep writing, and run
                the layout engines again; the specimen on screen may drift across
                those sessions.
              </p>
              <p className={`${STEP_PROSE} mb-0 text-spora-primary/85`}>
                The genetic fingerprint of the Flora (its seed lineage) stays
                tied to you. Rendering and wording fork in the Lab, but the
                identity does not. Cuttings stay on.
              </p>
            </section>

            <section className="space-y-5 border-t border-spora-primary/20 pt-10">
              <h3 className="m-0 font-bizud-mincho-bold text-lg leading-snug text-spora-primary">
                Sealed · final specimen
              </h3>
              <p className={`${STEP_PROSE} mb-0`}>
                You are placing one finished piece in the greenhouse. There is
                no SPORA Lab continuation path from it: the file is closed, and
                cuttings are off.
              </p>
              <p className={`${STEP_PROSE} mb-0 text-spora-primary/85`}>
                Choose this when you want a stable record of the work, not a
                living branch for others to extend.
              </p>
            </section>
          </div>
        ),
      },
    ];
  }, []);

  const [step, setStep] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyScrollRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleFinish = useCallback(() => {
    setLabTutorialDone();
    onClose();
  }, [onClose]);

  const current = steps[step];
  const isLast = step === steps.length - 1;

  useEffect(() => {
    const region = bodyScrollRef.current;
    if (region) region.scrollTop = 0;
  }, [step]);

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

  const panelMaxWidth =
    step === steps.length - 1 ? "max-w-lg" : "max-w-md";
  const panelMaxHeight =
    step === steps.length - 1
      ? "max-h-[min(92vh,44rem)]"
      : "max-h-[min(90vh,40rem)]";

  const overlay = (
    <div
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/50 p-5 backdrop-blur-sm duration-normal"
      style={{ animation: "fadeIn var(--duration-fast) var(--ease-spora-out)" }}
    >
      <div
        ref={panelRef}
        aria-labelledby="lab-tutorial-title"
        aria-modal="true"
        className={`relative flex ${panelMaxHeight} w-full ${panelMaxWidth} flex-col overflow-hidden border border-spora-primary bg-spora-primary-light shadow-spora-modal outline-none transition-transform duration-normal`}
        role="dialog"
        style={{
          animation: "slideUp var(--duration-normal) var(--ease-spora-out)",
        }}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-6 pt-6 sm:px-7">
          <h2
            className="mb-1 font-bizud-mincho-bold text-xl text-spora-primary sm:text-[1.35rem]"
            id="lab-tutorial-title"
          >
            {current.title}
          </h2>
        </div>

        <div
          ref={bodyScrollRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-3 pt-5 text-spora-primary [scrollbar-gutter:stable] sm:px-7"
        >
          {current.content}
        </div>

        <div className="relative z-10 flex shrink-0 flex-col gap-4 border-t border-spora-primary/15 bg-spora-primary-light px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div aria-hidden className="flex gap-1">
            {steps.map((_, stepIndex) => (
              <span
                className={`block h-2 w-2 rounded-full transition-colors ${
                  stepIndex === step
                    ? "bg-spora-primary"
                    : "bg-(--spora-primary)/30"
                }`}
                key={stepIndex}
              />
            ))}
          </div>
          <div className="flex flex-col-reverse gap-3 font-supply-mono text-caption-sm sm:flex-row sm:justify-end sm:text-xs">
            <button
              className="shrink-0 cursor-pointer border border-spora-primary bg-spora-primary-light px-4 py-2.5 uppercase tracking-[0.2em] text-spora-primary hover:bg-spora-primary-lighter"
              type="button"
              onClick={handleFinish}
            >
              Skip
            </button>
            {isLast ? (
              <button
                className="shrink-0 cursor-pointer border border-spora-primary bg-spora-primary px-4 py-2.5 uppercase tracking-[0.2em] text-spora-primary-light hover:bg-black"
                type="button"
                onClick={handleFinish}
              >
                Get started
              </button>
            ) : (
              <button
                className="shrink-0 cursor-pointer border border-spora-primary bg-spora-primary px-4 py-2.5 uppercase tracking-[0.2em] text-spora-primary-light hover:bg-black"
                type="button"
                onClick={() => setStep((s) => s + 1)}
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
