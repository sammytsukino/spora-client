import { useMemo, useState } from "react";
import FooterAlter from "@/components/layout/FooterAlter";
import SignUpForm from "@/components/home/SignUpForm";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import Section from "@/components/layout/Section";

const FORM_BACKGROUND_VIDEO_URL =
  "https://res.cloudinary.com/dsy30p7gf/video/upload/v1770320881/BACKGROUND-GRADIENT_bejhdr.mp4";

export default function SignUp() {
  const [videoRetry, setVideoRetry] = useState(0);
  const videoSrc = useMemo(() => {
    if (videoRetry === 0) return FORM_BACKGROUND_VIDEO_URL;
    const joiner = FORM_BACKGROUND_VIDEO_URL.includes("?") ? "&" : "?";
    return `${FORM_BACKGROUND_VIDEO_URL}${joiner}retry=${videoRetry}`;
  }, [videoRetry]);

  return (
    <div className="w-full overflow-x-hidden">
      <TransparentNavbar showScrollBackground />
      <main id="main-content">
        <h1 className="sr-only">Sign Up</h1>
        <Section
          variant="full"
          containerized={false}
          className="relative flex flex-col justify-between min-h-dvh"
        >
          <div className="fixed inset-0 w-full h-full z-0">
            <video
              className="fixed inset-0 h-full w-full object-cover"
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onError={() => {
                if (videoRetry >= 2) return;
                window.setTimeout(() => {
                  setVideoRetry((value) => value + 1);
                }, 250);
              }}
              aria-hidden="true"
            />
          </div>

          <div className="relative z-10 shrink-0 h-16 sm:h-20" aria-hidden />
          <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-4 sm:px-6">
            <SignUpForm />
          </div>

          <div className="relative z-10">
            <FooterAlter className="px-4 sm:px-6 md:px-12 lg:px-16" />
          </div>
        </Section>
      </main>
    </div>
  )
}