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
  ROUTES.BACKGROUND,
  ROUTES.ADMIN,
  ROUTES.FLORA,
];

function isSmoothScrollSafe(pathname: string): boolean {
  return !UNSAFE_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export default function SmoothScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isSmoothScrollSafe(pathname)) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      stopInertiaOnNavigate: true,
      allowNestedScroll: true,
    });

    return () => {
      lenis.destroy();
    };
  }, [pathname]);

  return null;
}
