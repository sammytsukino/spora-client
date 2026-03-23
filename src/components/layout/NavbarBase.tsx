import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, FileText, Shield } from "lucide-react";
import MainButton from "@/components/ui/MainButton";
import CyclingLogo from "@/components/layout/CyclingLogo";
import { getStoredToken, clearSession, isLabFullAccessible, getStoredUser } from "@/lib/auth";

type NavbarVariant = "default" | "transparent" | "laboratory" | "team";
type NavbarPosition = "fixed" | "sticky";

interface NavbarBaseProps {
  variant?: NavbarVariant;
  position?: NavbarPosition;
  showScrollProgress?: boolean;
  showScrollBackground?: boolean;
  onNavigateRequest?: (path: "/garden" | "/greenhouse" | "/laboratory" | "/laboratory/full") => void;
  className?: string;
  transparentUseLightText?: boolean;
}

export default function NavbarBase({
  variant = "default",
  position = "fixed",
  showScrollProgress = false,
  showScrollBackground = false,
  onNavigateRequest,
  className = "",
  transparentUseLightText = false,
}: NavbarBaseProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const positionClass = position === "sticky" ? "sticky top-0" : "fixed top-0";
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getStoredToken());
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = variant === "default";

  useEffect(() => {
    setIsLoggedIn(!!getStoredToken());
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    clearSession();
    setMenuOpen(false);
    setIsLoggedIn(false);
    navigate("/");
  };
  const isTransparent = variant === "transparent";
  const isLaboratory = variant === "laboratory";
  const isTeam = variant === "team";
  const useLightLogo = isDark || (isTransparent && transparentUseLightText);

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

  const handleClick = (path: "/garden" | "/greenhouse" | "/laboratory" | "/laboratory/full") => {
    if (onNavigateRequest) {
      onNavigateRequest(path);
    } else {
      navigate(path);
    }
  };

  const pathname = location.pathname.toLowerCase();
  const isGarden = pathname.startsWith("/garden");
  const isGreenhouse = pathname.startsWith("/greenhouse");
  const isLaboratoryPath = pathname.startsWith("/laboratory") || pathname.startsWith("/installation");

  const textColor = isDark
    ? "text-[var(--spora-text-secondary)]"
    : isTransparent && transparentUseLightText
    ? "text-white"
    : "text-[var(--spora-primary)]";
  const bgColor = isDark
    ? "bg-[var(--spora-primary)]"
    : isTransparent
    ? ""
    : "bg-transparent";

  const justifyNav = isTeam
    ? "md:justify-start"
    : isLaboratory
    ? "md:justify-end"
    : "md:justify-center";

  return (
    <header
      className={`${positionClass} left-0 w-full z-40 ${bgColor} ${textColor} font-supply-mono ${className}`}
    >
      {showScrollBackground && (
        <div
          className="absolute inset-0 -z-10 transition-opacity duration-500 ease-in-out"
          style={{
            opacity: hasScrolled ? 1 : 0,
            background: "var(--spora-accent-secondary)",
            borderBottom: "2px solid var(--spora-primary)",
          }}
        />
      )}
      <div className="relative z-10 mx-auto w-full px-5 sm:px-6 md:px-12 lg:px-16 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4 md:gap-6">
          {(isTeam || isDark || isTransparent) && (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="md:hidden flex items-center cursor-pointer"
              aria-label="Go to home"
            >
              <img
                src={
                  useLightLogo
                    ? "https://res.cloudinary.com/dsy30p7gf/image/upload/v1768395876/Group_33_eu3kbv.svg"
                    : "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769075853/logo-grey_j6myjj.svg"
                }
                alt="Spora logo"
                className="h-4 w-auto"
              />
            </button>
          )}

          {(isTeam || isDark || isTransparent) && (
            <div className="hidden md:flex items-center">
                <img
                  src={
                    useLightLogo
                      ? "https://res.cloudinary.com/dsy30p7gf/image/upload/v1768395876/Group_33_eu3kbv.svg"
                      : "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769075853/logo-grey_j6myjj.svg"
                  }
                  alt="Spora logo"
                  className="h-7 sm:h-8 w-auto cursor-pointer"
                  onClick={() => navigate("/")}
                />
            </div>
          )}

          <nav className="flex-1">
            <ul
              className={`flex items-center justify-start ${justifyNav} gap-2 sm:gap-3 md:gap-8 text-[8px] sm:text-[10px] md:text-xs tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase font-semibold whitespace-nowrap`}
            >
            <li>
              <button
                type="button"
                className={`${isGarden && !isLaboratory ? "underline" : "hover:underline"} cursor-pointer`}
                onClick={() => handleClick("/garden")}
              >
                <span className="md:hidden">GARDEN</span>
                <span className="hidden md:inline">(01)GARDEN</span>
              </button>
            </li>
            <li className="hidden md:inline">|</li>
            <li>
              <button
                type="button"
                className={`${isGreenhouse && !isLaboratory ? "underline" : "hover:underline"} cursor-pointer`}
                onClick={() => handleClick("/greenhouse")}
              >
                <span className="md:hidden">GREENHOUSE</span>
                <span className="hidden md:inline">(02)GREENHOUSE</span>
              </button>
            </li>
            <li className="hidden md:inline">|</li>
            <li>
              <button
                type="button"
                className={`${isLaboratoryPath && isLaboratory ? "underline" : "hover:underline"} cursor-pointer`}
                onClick={() => handleClick(isLabFullAccessible() ? "/laboratory/full" : "/laboratory")}
              >
                <span className="md:hidden">LAB</span>
                <span className="hidden md:inline">(03)LABORATORY</span>
              </button>
            </li>
            </ul>
          </nav>

          {isTeam && (
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hidden md:inline-flex cursor-pointer"
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

          <div className="flex items-center" ref={menuRef}>
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={`p-2 transition-colors ${isDark || (isTransparent && transparentUseLightText) ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                    aria-label="User menu"
                    aria-expanded={menuOpen}
                  >
                    {menuOpen ? (
                      <X className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <Menu className="w-5 h-5" strokeWidth={2} />
                    )}
                  </button>
                  {menuOpen && (
                    <div
                      className={`absolute right-0 top-full mt-1 py-1 min-w-[200px] border font-supply-mono text-xs uppercase tracking-wider ${
                        isDark || (isTransparent && transparentUseLightText)
                          ? "bg-[var(--spora-primary)] border-[var(--spora-text-secondary)] text-[var(--spora-text-secondary)]"
                          : "bg-[#E9E9E9] border-[#262626] text-[#262626]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/profile");
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors ${isDark || (isTransparent && transparentUseLightText) ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                      >
                        <User className="w-4 h-4 shrink-0" />
                        Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/terms");
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors ${isDark || (isTransparent && transparentUseLightText) ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                      >
                        <FileText className="w-4 h-4 shrink-0" />
                        More info about licensing
                      </button>
                      {getStoredUser()?.role === "admin" && (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            navigate("/admin");
                          }}
                          className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors ${isDark || (isTransparent && transparentUseLightText) ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                        >
                          <Shield className="w-4 h-4 shrink-0" />
                          Admin panel
                        </button>
                      )}
                      <hr className={isDark || (isTransparent && transparentUseLightText) ? "border-[var(--spora-text-secondary)]/30" : "border-[#262626]/30"} />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-2 px-4 py-3 text-left transition-colors ${isDark || (isTransparent && transparentUseLightText) ? "hover:bg-white/10" : "hover:bg-black/5"}`}
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <MainButton
                  variant={isDark || (isTransparent && transparentUseLightText) ? "navbar" : "compact"}
                  size="sm"
                  type="button"
                  onClick={() => navigate("/signin")}
                  className={isTransparent ? "bg-transparent" : ""}
                >
                  SIGN IN
                </MainButton>
              )}
            </div>
        </div>
      </div>
      {showScrollProgress && (
        <div className="w-full h-[2px] bg-transparent">
          <div
            className="h-full transition-all duration-150 ease-out"
            style={{
              width: `${scrollProgress}%`,
              backgroundColor: isDark ? "var(--spora-accent-secondary)" : "oklch(65.6% 0.241 354.308)",
            }}
          />
        </div>
      )}
    </header>
  );
}
