import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { getConsentGiven, setConsentGiven } from "@/lib/consentStorage";

const BANNER_DISMISSED_KEY = "spora_desktop_banner_dismissed";

interface DesktopExperienceBannerProps {
  requiresConsent?: boolean;
  onConsentAccept?: () => void;
}

export default function DesktopExperienceBanner({
  requiresConsent = false,
  onConsentAccept,
}: DesktopExperienceBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
    if (!getConsentGiven() || !dismissed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const canDismiss = !requiresConsent || termsAccepted;

  const handleDismiss = () => {
    if (!canDismiss) return;
    if (requiresConsent) {
      setConsentGiven();
      onConsentAccept?.();
    }
    setIsVisible(false);
    if (!requiresConsent || termsAccepted) {
      localStorage.setItem(BANNER_DISMISSED_KEY, "true");
    }
  };

  return (
    <div
      className="fixed bottom-0 left-0 w-full z-10000 md:hidden bg-spora-primary text-spora-primary-light p-4 pr-12 shadow-spora-modal border-t border-spora-border/20 backdrop-blur-md bg-opacity-90"
      role={requiresConsent ? "dialog" : undefined}
      aria-labelledby={requiresConsent ? "mobile-banner-title" : undefined}
    >
      <button
        type="button"
        onClick={handleDismiss}
        disabled={!canDismiss}
        className="absolute top-3 right-3 p-2 rounded-full transition-colors enabled:hover:text-spora-accent-secondary disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label={requiresConsent ? "Accept and close" : "Dismiss notice"}
      >
        <X size={18} />
      </button>

      <div className="space-y-3 font-bizud-mincho text-xs leading-relaxed">
        <p id="mobile-banner-title">
          SPORA is designed to be experienced on desktop. We recommend using a computer for the
          full experience.
        </p>

        {requiresConsent && (
          <label
            htmlFor="mobile-consent-terms"
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              id="mobile-consent-terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="w-3.5 h-3.5 shrink-0 border border-spora-primary-light accent-spora-accent-secondary cursor-pointer"
            />
            <span>
              I agree to the{" "}
              <Link to={ROUTES.TERMS} className="underline hover:no-underline">
                Terms & Conditions
              </Link>
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
