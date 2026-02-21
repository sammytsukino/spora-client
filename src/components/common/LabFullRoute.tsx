import { useEffect } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getStoredToken, getStoredUser } from "@/lib/auth";

const LAB_FULL_SESSION_KEY = "spora_lab_full_session";

interface LabFullRouteProps {
  children: React.ReactNode;
}

/**
 * Lab Full: admins always; cultivators only when coming from /grow (?from=grow).
 * No localStorage. Session-only flag so we can strip ?from=grow and not redirect; cleared on leave so refresh/direct /laboratory/full → normal lab.
 */
export default function LabFullRoute({ children }: LabFullRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = getStoredToken();
  const user = getStoredUser();
  const fromGrow = searchParams.get("from") === "grow";
  const sessionFull = typeof sessionStorage !== "undefined" && sessionStorage.getItem(LAB_FULL_SESSION_KEY) === "1";
  const cultivatorCanSeeFull = fromGrow || sessionFull;

  useEffect(() => {
    if (user?.role === "cultivator" && fromGrow) {
      sessionStorage.setItem(LAB_FULL_SESSION_KEY, "1");
      const next = new URLSearchParams(searchParams);
      next.delete("from");
      const q = next.toString() ? `?${next.toString()}` : "";
      navigate(`${location.pathname}${q}`, { replace: true });
    }
  }, [user?.role, fromGrow, searchParams, navigate, location.pathname]);

  if (!token) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (user?.role === "admin") {
    return <>{children}</>;
  }

  if (user?.role === "cultivator" && !cultivatorCanSeeFull) {
    return <Navigate to="/laboratory" replace />;
  }

  return <>{children}</>;
}
