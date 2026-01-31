import { useEffect, useState, useCallback } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";

export default function Greenhouse() {
  // Infinite scroll logic (preserved for reuse)
  const [visibleItems, setVisibleItems] = useState(6);
  const totalItems = 36;

  const loadMore = useCallback(() => {
    if (visibleItems < totalItems) {
      setVisibleItems((prev) => Math.min(prev + 6, totalItems));
    }
  }, [visibleItems]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 200) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1">
        {/* ========================================
            GREENHOUSE PAGE
            - Curated/timeless artworks
            - Featured flora hero
            - Mini cards grid
            ======================================== */}
        {/* TODO: Greenhouse content */}
      </main>

      <FooterAlter />
    </div>
  )
}
