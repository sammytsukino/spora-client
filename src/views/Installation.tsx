
import { useLocation } from "react-router-dom";

export default function Installation() {
  const location = useLocation();
  const src = `/Installation.html${location.search || ""}`;

  return (
    <iframe
      src={src}
      style={{ width: '100vw', height: '100vh', border: 'none', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
      title="Bouquet Generativo Installation"
      allowFullScreen
    />
  );
}
