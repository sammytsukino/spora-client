import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function DesktopExperienceBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if it hasn't been dismissed in this session
    const dismissed = sessionStorage.getItem("spora_desktop_banner_dismissed");
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("spora_desktop_banner_dismissed", "true");
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[10000] md:hidden bg-spora-primary text-spora-primary-light p-4 flex items-center justify-between shadow-spora-modal font-bizud-mincho text-xs border-t border-spora-border/20 backdrop-blur-md bg-opacity-90">
      <div className="flex-1 pr-4 leading-relaxed">
        SPORA is designed to be experienced on desktop. We recommend using a computer for the full experience.
      </div>
      <button 
        onClick={handleDismiss}
        className="p-2 -mr-2 hover:text-spora-accent transition-colors rounded-full"
        aria-label="Cerrar aviso"
      >
        <X size={18} />
      </button>
    </div>
  );
}
