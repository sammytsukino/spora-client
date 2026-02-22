import { useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";

interface InstallationProps {
  fullLab?: boolean;
}

export default function Installation({ fullLab = false }: InstallationProps) {
  const location = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const params = new URLSearchParams(location.search || "");
  const floraId = params.get("floraId");
  const search = new URLSearchParams(location.search || "");
  if (fullLab) search.set("full", "1");
  const src = `/Installation.html${search.toString() ? "?" + search.toString() : ""}`;

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
    <iframe
      ref={iframeRef}
      src={src}
      style={{ width: '100vw', height: '100vh', border: 'none', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
      title="Bouquet Generativo Installation"
      allowFullScreen
    />
  );
}
