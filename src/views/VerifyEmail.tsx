import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail, resendVerificationEmail } from "@/lib/auth";
import { ROUTES } from "@/constants/routes";
import MainButton from "@/components/ui/MainButton";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";

export default function VerifyEmail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "alreadyVerified">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const hasVerified = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      if (!hasVerified.current) {
        setStatus("error");
        setErrorMessage("No verification link found. Request a new one below.");
      }
      return;
    }

    if (hasVerified.current) return;
    hasVerified.current = true;

    setSearchParams({}, { replace: true });

    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate(ROUTES.GARDEN), 2000);
      })
      .catch((err) => {
        setStatus((prev) => (prev === "success" ? prev : "error"));
        setErrorMessage(
          err?.response?.data?.error || "This link has expired or already been used."
        );
      });
  }, [searchParams, navigate, setSearchParams]);

  return (
    <div className="min-h-screen bg-spora-primary-light flex flex-col">
      <TransparentNavbar showScrollBackground />
      <main className="flex-1 flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-md w-full border border-spora-primary bg-spora-primary-light p-8 text-center">
          {status === "loading" && (
            <p className="font-supply-mono text-sm uppercase tracking-[0.25em] text-spora-primary">
              Verifying your email…
            </p>
          )}
          {status === "success" && (
            <div>
              <h1 className="font-bizud-mincho-bold text-2xl mb-4 text-spora-primary">
                Email verified
              </h1>
              <p className="font-supply-mono text-sm text-spora-primary mb-6">
                Your account is now active. Redirecting to the garden…
              </p>
              <button
                type="button"
                onClick={() => navigate(ROUTES.GARDEN)}
                className="px-4 py-2 border border-spora-primary bg-spora-primary text-spora-primary-light font-supply-mono text-xs uppercase tracking-[0.25em] hover:bg-black cursor-pointer"
              >
                Go to garden
              </button>
            </div>
          )}
          {status === "alreadyVerified" && (
            <div>
              <h1 className="font-bizud-mincho-bold text-2xl mb-4 text-spora-primary">
                Already verified
              </h1>
              <p className="font-supply-mono text-sm text-spora-primary mb-6">
                Your account is already verified. You can sign in.
              </p>
              <MainButton
                type="button"
                variant="compact"
                size="sm"
                onClick={() => navigate(ROUTES.SIGN_IN)}
                className="border-spora-primary bg-spora-primary text-spora-primary-light hover:bg-spora-primary hover:text-spora-primary-light"
              >
                Sign in
              </MainButton>
            </div>
          )}
          {status === "error" && (
            <div>
              <h1 className="font-bizud-mincho-bold text-2xl mb-4 text-spora-primary">
                Verification failed
              </h1>
              <p className="font-supply-mono text-sm text-spora-primary mb-6">
                {errorMessage}
              </p>
              <div className="flex flex-col gap-3 mb-6">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-spora-primary bg-transparent font-supply-mono text-sm"
                />
                <button
                  type="button"
                  disabled={!resendEmail.trim() || resending}
                  onClick={async () => {
                    setResending(true);
                    setResendMessage(null);
                    try {
                      await resendVerificationEmail(resendEmail.trim());
                      setResendMessage("New verification email sent. Check your inbox and spam.");
                    } catch (err: unknown) {
                      const e = err as { response?: { data?: { error?: string } } };
                      const msg = e?.response?.data?.error || "Could not send email.";
                      setResendMessage(msg);
                      if (msg.toLowerCase().includes("already verified")) {
                        setStatus("alreadyVerified");
                        setResendMessage(null);
                      }
                    } finally {
                      setResending(false);
                    }
                  }}
                  className="px-4 py-2 border border-spora-primary bg-spora-primary text-spora-primary-light font-supply-mono text-xs uppercase tracking-[0.25em] hover:bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resending ? "Sending…" : "Resend verification email"}
                </button>
                {resendMessage && (
                  <p className="font-supply-mono text-xs text-spora-primary">
                    {resendMessage}
                  </p>
                )}
              </div>
              <MainButton
                type="button"
                variant="compact"
                size="sm"
                onClick={() => navigate(ROUTES.SIGN_IN)}
                className="mt-2"
              >
                Sign in
              </MainButton>
            </div>
          )}
        </div>
      </main>
      <FooterAlter />
    </div>
  );
}
