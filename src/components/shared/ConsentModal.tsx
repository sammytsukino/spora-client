import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "spora_consent_v1";
const IGNORE_SECONDS = 8;

export function getConsentGiven(): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return data?.terms === true;
  } catch {
    return false;
  }
}

export function setConsentGiven(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ terms: true, timestamp: Date.now() })
  );
}

interface ConsentModalProps {
  onAccept: () => void;
}

export default function ConsentModal({ onAccept }: ConsentModalProps) {
  const [terms, setTerms] = useState(false);
  const [visible, setVisible] = useState(true);

  const dismiss = (markConsent: boolean) => {
    if (markConsent) {
      setConsentGiven();
      onAccept();
    }
    setVisible(false);
  };

  const handleAccept = () => {
    if (!terms) return;
    setConsentGiven();
    onAccept();
    setVisible(false);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      dismiss(true);
    }, IGNORE_SECONDS * 1000);
    return () => clearTimeout(t);
  }, [onAccept]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] w-[calc(100%-2rem)] max-w-sm"
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
    >
      <div className="bg-[var(--spora-primary-light)] border-2 border-[var(--spora-primary)] p-4 shadow-lg relative">
        <button
          type="button"
          onClick={() => dismiss(true)}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[var(--spora-primary)] hover:bg-[#f0f0f0] font-supply-mono text-sm leading-none"
          aria-label="Cerrar"
        >
          ×
        </button>

        <h2
          id="consent-title"
          className="font-bizud-mincho-bold text-lg mb-2 pr-6 text-[var(--spora-primary)]"
        >
          Terms & Conditions
        </h2>
        <p className="font-supply-mono text-[11px] text-[var(--spora-primary)] mb-4 leading-relaxed">
          By using SPORA you agree to our{" "}
          <Link to="/terms" className="underline hover:no-underline">
            Terms & Conditions
          </Link>
          . You can dismiss this to continue.
        </p>

        <label className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-0.5 w-4 h-4 border-2 border-[var(--spora-primary)] accent-[var(--spora-primary)] cursor-pointer"
          />
          <span className="font-supply-mono text-[11px] text-[var(--spora-primary)] group-hover:underline">
            I accept the{" "}
            <Link to="/terms" className="underline hover:no-underline">
              Terms & Conditions
            </Link>
          </span>
        </label>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => dismiss(true)}
            className="px-3 py-1.5 border border-[var(--spora-primary)] bg-transparent text-[var(--spora-primary)] font-supply-mono text-[10px] uppercase tracking-[0.2em] hover:bg-[#f5f5f5] cursor-pointer"
          >
            Dismiss
          </button>
          <button
            type="button"
            disabled={!terms}
            onClick={handleAccept}
            className="px-3 py-1.5 border border-[var(--spora-primary)] bg-[var(--spora-primary)] text-[var(--spora-primary-light)] font-supply-mono text-[10px] uppercase tracking-[0.2em] hover:bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
