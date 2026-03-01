import { useState } from "react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "spora_consent_v1";

export function getConsentGiven(): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return data?.terms === true && data?.cookies === true;
  } catch {
    return false;
  }
}

export function setConsentGiven(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ terms: true, cookies: true, timestamp: Date.now() })
  );
}

interface ConsentModalProps {
  onAccept: () => void;
}

export default function ConsentModal({ onAccept }: ConsentModalProps) {
  const [terms, setTerms] = useState(false);
  const [cookies, setCookies] = useState(false);

  const handleAccept = () => {
    setConsentGiven();
    onAccept();
  };

  const canAccept = terms && cookies;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
    >
      <div className="bg-[var(--spora-primary-light)] border-2 border-[var(--spora-primary)] max-w-lg w-[90%] mx-4 p-6 shadow-lg">
        <h2
          id="consent-title"
          className="font-bizud-mincho-bold text-xl mb-4 text-[var(--spora-primary)]"
        >
          Welcome to SPORA
        </h2>
        <p className="font-supply-mono text-xs text-[var(--spora-primary)] mb-6 leading-relaxed">
          To use SPORA, please read and accept our Terms & Conditions and Cookie
          Policy. We use cookies to provide core functionality and improve your
          experience.
        </p>

        <div className="space-y-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-1 w-4 h-4 border-2 border-[var(--spora-primary)] accent-[var(--spora-primary)] cursor-pointer"
            />
            <span className="font-supply-mono text-[11px] sm:text-xs text-[var(--spora-primary)] group-hover:underline">
              I accept the{" "}
              <Link to="/terms" className="underline hover:no-underline">
                Terms & Conditions
              </Link>
            </span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={cookies}
              onChange={(e) => setCookies(e.target.checked)}
              className="mt-1 w-4 h-4 border-2 border-[var(--spora-primary)] accent-[var(--spora-primary)] cursor-pointer"
            />
            <span className="font-supply-mono text-[11px] sm:text-xs text-[var(--spora-primary)] group-hover:underline">
              I accept the use of{" "}
              <Link to="/terms#cookies" className="underline hover:no-underline">
                cookies
              </Link>{" "}
              as described in our data protection policy
            </span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="px-4 py-2 border border-[var(--spora-primary)] bg-transparent text-[var(--spora-primary)] font-supply-mono text-[11px] uppercase tracking-[0.25em] hover:bg-[#f5f5f5] cursor-pointer"
            onClick={() => window.close()}
          >
            Reject
          </button>
          <button
            type="button"
            disabled={!canAccept}
            onClick={handleAccept}
            className="px-4 py-2 border border-[var(--spora-primary)] bg-[var(--spora-primary)] text-[var(--spora-primary-light)] font-supply-mono text-[11px] uppercase tracking-[0.25em] hover:bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
