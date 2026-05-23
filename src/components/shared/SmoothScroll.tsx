import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { ROUTES } from "@/constants/routes";

const UNSAFE_ROUTE_PREFIXES: readonly string[] = [
  ROUTES.LABORATORY,
  ROUTES.LABORATORY_FULL,
  ROUTES.INSTALLATION,
  ROUTES.SHW,
  ROUTES.TEAM,
  ROUTES.ADMIN,
  ROUTES.FLORA,
];

function isSmoothScrollSafe(pathname: string): boolean {
  return !UNSAFE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

const LENIS_OPTIONS = {
  lerp: 0.08,
  duration: 1.6,
  wheelMultiplier: 0.85,
  touchMultiplier: 0.9,
} as const;

export default function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isSmoothScrollSafe(pathname)) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      stopInertiaOnNavigate: true,
      allowNestedScroll: true,
      ...LENIS_OPTIONS,
    });

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
