import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { setReaderTutorialDone } from "@/components/reader/readerTutorialStorage";

type StepTarget = "flora" | "details" | "cuttings" | "options";

interface ReaderTutorialOverlayProps {
  floraRef: RefObject<HTMLElement | null>;
  detailsRef: RefObject<HTMLElement | null>;
  cuttingsRef: RefObject<HTMLElement | null>;
  optionsRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

const STEPS: Array<{ title: string; body: string; target: StepTarget }> = [
  {
    title: "Reader view",
    body: "This is where you see the full Flora: live visual background, title, authorship and full text in one place.",
    target: "flora",
  },
  {
    title: "Flora data and analysis",
    body: "Open Details to inspect lineage, generation, mood and morphology metrics extracted from the text.",
    target: "details",
  },
  {
    title: "Cuttings availability",
    body: "Here you can see whether this Flora allows cuttings. If it's blossoming, you can open the Laboratory and continue its evolution.",
    target: "cuttings",
  },
  {
    title: "Reader options",
    body: "Use Reader options to shuffle layout, capture image, adjust wind, toggle ambience, vellum, and control listen playback speed.",
    target: "options",
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function ReaderTutorialOverlay({
  floraRef,
  detailsRef,
  cuttingsRef,
  optionsRef,
  onClose,
}: ReaderTutorialOverlayProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const targetMap = useMemo(
    () => ({
      flora: floraRef,
      details: detailsRef,
      cuttings: cuttingsRef,
      options: optionsRef,
    }),
    [floraRef, detailsRef, cuttingsRef, optionsRef]
  );

  const currentStep = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const currentTarget = targetMap[currentStep.target].current;
  const targetRect = currentTarget?.getBoundingClientRect() ?? null;

  const handleFinish = useCallback(() => {
    setReaderTutorialDone();
    onClose();
  }, [onClose]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimeoutId = window.setTimeout(() => panelRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleFinish();
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

  useEffect(() => {
    const update = () => setTick((value) => value + 1);
    const onResize = () => update();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    const intervalId = window.setInterval(update, 250);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
      window.clearInterval(intervalId);
    };
  }, []);

  void tick;

  const panelWidth = 360;
  const panelHeight = 248;
  const margin = 16;
  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1280;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 720;

  let panelLeft = (viewportW - panelWidth) / 2;
  let panelTop = 96;
  if (targetRect) {
    const rightFit = targetRect.right + margin + panelWidth < viewportW - margin;
    const leftFit = targetRect.left - margin - panelWidth > margin;
    let usingSidePlacement = false;
    if (rightFit) {
      panelLeft = targetRect.right + margin;
      usingSidePlacement = true;
    } else if (leftFit) {
      panelLeft = targetRect.left - panelWidth - margin;
      usingSidePlacement = true;
    } else {
      panelLeft = clamp(targetRect.left, margin, viewportW - panelWidth - margin);
    }
    if (usingSidePlacement) {
      panelTop = clamp(
        targetRect.top + targetRect.height * 0.5 - panelHeight / 2,
        margin,
        viewportH - panelHeight - margin
      );
    } else {
      const belowY = targetRect.bottom + margin;
      const aboveY = targetRect.top - panelHeight - margin;
      const belowFits = belowY + panelHeight < viewportH - margin;
      const aboveFits = aboveY > margin;
      if (belowFits) {
        panelTop = belowY;
      } else if (aboveFits) {
        panelTop = aboveY;
      } else {
        panelTop = clamp(viewportH - panelHeight - margin, margin, viewportH - panelHeight - margin);
      }
    }
  }

  const overlay = (
    <div className="fixed inset-0 z-100000">
      <div className="absolute inset-0 bg-black/45" />
      {targetRect ? (
        <div
          aria-hidden
          className="absolute rounded-sm border-2 border-spora-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.35)] pointer-events-none"
          style={{
            left: targetRect.left - 6,
            top: targetRect.top - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
          }}
        />
      ) : null}

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reader-tutorial-title"
        tabIndex={-1}
        className="absolute w-[min(360px,calc(100vw-24px))] border-2 border-spora-primary bg-spora-primary-light p-4 shadow-xl"
        style={{ left: clamp(panelLeft, 12, viewportW - Math.min(panelWidth, viewportW - 24) - 12), top: panelTop }}
      >
        <h2
          id="reader-tutorial-title"
          className="font-bizud-mincho-bold text-lg text-spora-primary mb-2"
        >
          {currentStep.title}
        </h2>
        <p className="font-supply-mono text-xs leading-relaxed text-spora-primary mb-4">
          {currentStep.body}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <span
                key={`reader-step-${i}`}
                className={`h-2 w-2 rounded-full ${i === stepIndex ? "bg-spora-primary" : "bg-spora-primary/30"}`}
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
                Done
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStepIndex((value) => value + 1)}
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

