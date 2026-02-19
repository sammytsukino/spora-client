import { useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";

export default function Installation() {
  const location = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const params = new URLSearchParams(location.search || "");
  const floraId = params.get("floraId");
  const src = `/Installation.html${location.search || ""}`;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!floraId || !iframe?.contentWindow) return;
    const send = () => {
      try {
        iframe.contentWindow?.postMessage({ type: "SPORA_LOAD_FLORA", floraId }, "*");
      } catch {}
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
