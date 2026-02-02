import MainButton from "@/components/ui/main-button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type TransparentNavbarProps = {
  position?: "fixed" | "sticky";
  className?: string;
  showScrollProgress?: boolean;
  showScrollBackground?: boolean;
};

export default function TransparentNavbar({
  position = "fixed",
  className = "",
  showScrollProgress = false,
  showScrollBackground = false,
}: TransparentNavbarProps) {
  const navigate = useNavigate();
  const positionClass = position === "sticky" ? "sticky top-0" : "fixed top-0";
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!showScrollProgress && !showScrollBackground) return;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.max(0, Math.min(100, progress)));
      setHasScrolled(scrollTop > 10);
    };

    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress);

    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [showScrollProgress, showScrollBackground]);

  return (
    <header
      className={`${positionClass} w-full z-50 text-[#262626] font-supply-mono ${className}`}
    >
      {showScrollBackground && (
        <div
          className="absolute inset-0 -z-10 transition-opacity duration-500 ease-in-out"
          style={{
            opacity: hasScrolled ? 1 : 0,
            background: "oklch(89.7% 0.196 126.665)",
            borderBottom: "2px solid #242424"
          }}
        />
      )}
      {showScrollProgress && (
        <div className="w-full h-[2px] bg-transparent">
          <div
            className="h-full"
            style={{ width: `${scrollProgress}%`, backgroundColor: "oklch(65.6% 0.241 354.308)" }}
          />
        </div>
      )}
      <div className="mx-auto flex items-center justify-between px-6 py-3 md:px-12 lg:px-16 md:py-4">
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1769075853/logo-grey_j6myjj.svg"
            alt="Spora logo"
            className="h-9 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <nav className="flex-1">
          <ul className="flex items-center justify-center gap-8 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold">
            <li>
              <button
                type="button"
                className="hover:underline cursor-pointer"
                onClick={() => navigate("/garden")}
              >
                (01)GARDEN
              </button>
            </li>
            <li>|</li>
            <li>
              <button
                type="button"
                className="hover:underline cursor-pointer"
                onClick={() => navigate("/greenhouse")}
              >
                (02)GREENHOUSE
              </button>
            </li>
            <li>|</li>
            <li>
              <button
                type="button"
                className="hover:underline cursor-pointer"
                onClick={() => navigate("/laboratory")}
              >
                (03)LABORATORY
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex items-center">
          <MainButton
            variant="compact"
            size="sm"
            type="button"
            onClick={() => navigate("/signin")}
            className="bg-stone-200"
          >
            SIGN IN
          </MainButton >
        </div>
      </div>
    </header>
  );
}
