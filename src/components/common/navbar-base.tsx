import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MainButton from "@/components/ui/main-button";
import CyclingLogo from "@/components/home/cycling-logo";

type NavbarVariant = "default" | "transparent" | "laboratory" | "team";
type NavbarPosition = "fixed" | "sticky";

interface NavbarBaseProps {
  variant?: NavbarVariant;
  position?: NavbarPosition;
  showScrollProgress?: boolean;
  showScrollBackground?: boolean;
  onNavigateRequest?: (path: "/garden" | "/greenhouse" | "/laboratory") => void;
  className?: string;
}

export default function NavbarBase({
  variant = "default",
  position = "fixed",
  showScrollProgress = false,
  showScrollBackground = false,
  onNavigateRequest,
  className = "",
}: NavbarBaseProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const positionClass = position === "sticky" ? "sticky top-0" : "fixed top-0";
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);

  const isDark = variant === "default";
  const isTransparent = variant === "transparent";
  const isLaboratory = variant === "laboratory";
  const isTeam = variant === "team";

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

  const handleClick = (path: "/garden" | "/greenhouse" | "/laboratory") => {
    if (onNavigateRequest) {
      onNavigateRequest(path);
    } else {
      navigate(path);
    }
  };

  const pathname = location.pathname.toLowerCase();
  const isGarden = pathname.startsWith("/garden");
  const isGreenhouse = pathname.startsWith("/greenhouse");
  const isLaboratoryPath = pathname.startsWith("/laboratory");

  const textColor = isDark
    ? "text-[var(--spora-text-secondary)]"
    : "text-[var(--spora-primary)]";
  const bgColor = isDark
    ? "bg-[var(--spora-primary)]"
    : isTransparent
    ? ""
    : "bg-transparent";

  const justifyNav = isTeam ? "justify-start" : isLaboratory ? "justify-end" : "justify-center";
  const justifyHeader = isTeam ? "justify-between" : "justify-between";

  return (
    <header
      className={`${positionClass} left-0 w-full z-40 ${bgColor} ${textColor} font-supply-mono overflow-hidden ${className}`}
    >
      {showScrollBackground && (
        <div
          className="absolute inset-0 -z-10 transition-opacity duration-500 ease-in-out"
          style={{
            opacity: hasScrolled ? 1 : 0,
            background: "oklch(89.7% 0.196 126.665)",
            borderBottom: "2px solid var(--spora-primary)",
          }}
        />
      )}
      <div className={`relative z-10 mx-auto flex items-center ${justifyHeader} px-6 py-3 md:px-12 lg:px-16 md:py-4`}>
        {(isTeam || isDark || isTransparent) && (
          <div className="flex items-center">
            <img
              src={
                isDark
                  ? "https://res.cloudinary.com/dsy30p7gf/image/upload/v1768395876/Group_33_eu3kbv.svg"
                  : "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769075853/logo-grey_j6myjj.svg"
              }
              alt="Spora logo"
              className="h-9 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>
        )}

        <nav className="flex-1">
          <ul className={`flex items-center ${justifyNav} gap-4 sm:gap-6 md:gap-8 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold`}>
            <li>
              <button
                type="button"
                className={`${isGarden && !isLaboratory ? "underline" : "hover:underline"} cursor-pointer`}
                onClick={() => handleClick("/garden")}
              >
                (01)GARDEN
              </button>
            </li>
            <li>|</li>
            <li>
              <button
                type="button"
                className={`${isGreenhouse && !isLaboratory ? "underline" : "hover:underline"} cursor-pointer`}
                onClick={() => handleClick("/greenhouse")}
              >
                (02)GREENHOUSE
              </button>
            </li>
            <li>|</li>
            <li>
              <button
                type="button"
                className={`${isLaboratoryPath && isLaboratory ? "underline" : "hover:underline"} cursor-pointer`}
                onClick={() => handleClick("/laboratory")}
              >
                (03)LABORATORY
              </button>
            </li>
          </ul>
        </nav>

        {isTeam && (
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer"
          >
            <CyclingLogo
              logos={[
                "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready5_czorye.svg",
                "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready4_tnwrxb.svg",
                "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready3_wtlf0u.svg",
                "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready2_f5swhb.svg",
                "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready1_psvx4m.svg",
              ]}
              width="80px"
              height={30}
              cycleDuration={0.2}
            />
          </button>
        )}

        {!isTeam && !isLaboratory && (
          <div className="flex items-center">
            <MainButton
              variant={isDark ? "navbar" : "compact"}
              size="sm"
              type="button"
              onClick={() => navigate("/signin")}
              className={isTransparent ? "bg-transparent" : ""}
            >
              SIGN IN
            </MainButton>
          </div>
        )}
      </div>
      {showScrollProgress && (
        <div className="w-full h-0.5 bg-transparent">
          <div
            className="h-full transition-all duration-150 ease-out"
            style={{
              width: `${scrollProgress}%`,
              backgroundColor: isDark ? "#bbf451" : "oklch(65.6% 0.241 354.308)",
            }}
          />
        </div>
      )}
    </header>
  );
}
