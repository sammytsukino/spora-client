import { useState } from "react";

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
    body: "Here you cultivate Floras—generative artworks grown from text. Write, adjust, and watch your creation blossom.",
  },
  {
    title: "Your text is the soil",
    body: "The text area is where you plant your ideas. Add at least 10 characters to begin. Your words—their length, rhythm, sentiment—are mapped into a unique, deterministic artwork. The same text always yields the same Flora.",
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

  const handleFinish = () => {
    setLabTutorialDone();
    onClose();
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--spora-primary-light)] border-2 border-[var(--spora-primary)] max-w-lg w-full p-6 shadow-lg">
        <h2 className="font-bizud-mincho-bold text-xl mb-2 text-[var(--spora-primary)]">
          {current.title}
        </h2>
        <p className="font-supply-mono text-sm text-[var(--spora-primary)] mb-6 leading-relaxed">
          {current.body}
        </p>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`block w-2 h-2 rounded-full transition-colors ${
                  i === step
                    ? "bg-[var(--spora-primary)]"
                    : "bg-[var(--spora-primary)]/30"
                }`}
                aria-hidden
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleFinish}
              className="px-3 py-1.5 font-supply-mono text-[11px] uppercase border border-[var(--spora-primary)] text-[var(--spora-primary)] hover:bg-[#f5f5f5] cursor-pointer"
            >
              Skip
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={handleFinish}
                className="px-4 py-1.5 font-supply-mono text-[11px] uppercase border border-[var(--spora-primary)] bg-[var(--spora-primary)] text-[var(--spora-primary-light)] hover:bg-black cursor-pointer"
              >
                Get started
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-4 py-1.5 font-supply-mono text-[11px] uppercase border border-[var(--spora-primary)] bg-[var(--spora-primary)] text-[var(--spora-primary-light)] hover:bg-black cursor-pointer"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
