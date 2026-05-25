const CONSENT_KEY = "spora_consent_v1";

export function getConsentGiven(): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    if (!storedConsent) return false;
    const consentData = JSON.parse(storedConsent);
    return consentData?.terms === true;
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
