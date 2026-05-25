import { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { setConsentGiven } from "@/lib/consentStorage";

interface ConsentModalProps {
  onAccept: () => void;
}

export default function ConsentModal({ onAccept }: ConsentModalProps) {
  const [terms, setTerms] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    if (!terms) return;
    setConsentGiven();
    onAccept();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-(--z-spora-consent) w-[calc(100%-3rem)] max-w-sm"
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-description"
    >
      <div className="bg-spora-primary-light border-2 border-spora-primary p-6 shadow-lg relative">
        <h2
          id="consent-title"
          className="font-bizud-mincho-bold text-lg mb-2 text-spora-primary"
        >
          Terms & Conditions
        </h2>
        <p
          id="consent-description"
          className="font-supply-mono text-[11px] text-spora-primary mb-4 leading-relaxed"
        >
          By using SPORA you agree to our{" "}
          <Link to={ROUTES.TERMS} className="underline hover:no-underline">
            Terms & Conditions
          </Link>
          .
        </p>

        <label htmlFor="consent-terms" className="flex items-start gap-3 cursor-pointer group mb-4">
          <input
            id="consent-terms"
            type="checkbox"
            checked={terms}
            onChange={(event) => setTerms(event.target.checked)}
            className="mt-0.5 w-4 h-4 border-2 border-spora-primary accent-spora-primary cursor-pointer"
          />
          <span className="font-supply-mono text-[11px] text-spora-primary group-hover:underline">
            I accept the{" "}
            <Link to={ROUTES.TERMS} className="underline hover:no-underline">
              Terms & Conditions
            </Link>
          </span>
        </label>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={!terms}
            onClick={handleAccept}
            className="px-3 py-1.5 border border-spora-primary bg-spora-primary text-spora-primary-light font-supply-mono text-[10px] uppercase tracking-[0.2em] hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
