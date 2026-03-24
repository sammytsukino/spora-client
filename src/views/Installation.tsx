import { useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import LabTutorialOverlay, { getLabTutorialDone } from "@/components/laboratory/LabTutorialOverlay";

interface InstallationProps {
  fullLab?: boolean;
}

export default function Installation({ fullLab = false }: InstallationProps) {
  const location = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [canReveal, setCanReveal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !getLabTutorialDone());
  const params = new URLSearchParams(location.search || "");
  const floraId = params.get("floraId");
  const search = new URLSearchParams(location.search || "");
  search.delete("from");
  if (fullLab) search.set("full", "1");
  const src = `/Installation.html${search.toString() ? "?" + search.toString() : ""}`;

  useEffect(() => {
    setCanReveal(false);
    const t = setTimeout(() => setCanReveal(true), 1000);
    return () => clearTimeout(t);
  }, [src]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!floraId || !iframe?.contentWindow) return;
    const send = () => {
      try {
        iframe.contentWindow?.postMessage({ type: "SPORA_LOAD_FLORA", floraId }, "*");
      } catch {
        void 0;
      }
    };
    iframe.addEventListener("load", send);
    send();
    return () => iframe.removeEventListener("load", send);
  }, [floraId]);

  return (
    <>
      {showTutorial && (
        <LabTutorialOverlay onClose={() => setShowTutorial(false)} />
      )}
      <div
        style={{
          opacity: canReveal ? 1 : 0,
          transition: "opacity 300ms",
          position: "fixed",
          inset: 0,
          zIndex: showTutorial ? 9998 : 9999,
          pointerEvents: showTutorial ? "none" : "auto",
        }}
      >
        <iframe
          ref={iframeRef}
          src={src}
          style={{ width: "100vw", height: "100vh", border: "none" }}
          title="Bouquet Generativo Installation"
          allowFullScreen
        />
      </div>
      {!canReveal && (
        <div
          className="fixed inset-0 z-spora-loader flex items-center justify-center bg-spora-primary-light"
          aria-hidden
        >
          <p className="font-supply-mono text-overline-xs sm:text-xs uppercase tracking-[0.25em] text-spora-primary">
            Loading...
          </p>
        </div>
      )}
    </>
  );
}
