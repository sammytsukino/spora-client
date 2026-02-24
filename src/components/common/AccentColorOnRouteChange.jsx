import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ACCENT_COLORS = [
  "#bbf451",
  "#F97EFF",
  "#E8D700",
  "#8FFF8F",
  "#63E2FF",
  "#C282FF",
];

function getRandomAccentColor() {
  const index = Math.floor(Math.random() * ACCENT_COLORS.length);
  return ACCENT_COLORS[index];
}

/**
 * Updates --spora-accent-secondary on the document root when the route changes.
 * Picks a random color from the Spora accent palette (lima + DeclarativeSection colors).
 */
export default function AccentColorOnRouteChange() {
  const location = useLocation();

  useEffect(() => {
    const color = getRandomAccentColor();
    document.documentElement.style.setProperty("--spora-accent-secondary", color);
  }, [location.pathname]);

  return null;
}
