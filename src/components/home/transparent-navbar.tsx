import { useEffect, useState } from "react";
import MainButton from "@/components/ui/main-button";
import { useNavigate } from "react-router-dom";

interface TransparentNavbarProps {
  showScrollBackground?: boolean;
  showScrollProgress?: boolean;
  className?: string;
}

export default function TransparentNavbar({
  showScrollBackground = false,
  showScrollProgress = false,
  className = "",
}: TransparentNavbarProps = {}) {
  const navigate = useNavigate();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(height > 0 ? (winScroll / height) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-transparent text-neutral-800 font-jetbrains-mono ${className}`}
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
          <ul className="flex items-center justify-center gap-8 text-[10px] sm:text-xs tracking-[0.3em] uppercase">
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
          >
            SIGN IN
          </MainButton>
        </div>
      </div>
    </header>
  );
}
