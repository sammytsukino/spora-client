import { useEffect } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { getStoredToken, getStoredUser } from "@/lib/auth";

const LAB_FULL_SESSION_KEY = "spora_lab_full_session";

interface LabFullRouteProps {
  children: React.ReactNode;
}

export default function LabFullRoute({ children }: LabFullRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = getStoredToken();
  const user = getStoredUser();
  const fromShw = searchParams.get("from") === "shw";
  const sessionFull = typeof sessionStorage !== "undefined" && sessionStorage.getItem(LAB_FULL_SESSION_KEY) === "1";
  const cultivatorCanSeeFull = fromShw || sessionFull;

  useEffect(() => {
    if (user?.role === "cultivator" && fromShw) {
      sessionStorage.setItem(LAB_FULL_SESSION_KEY, "1");
      const next = new URLSearchParams(searchParams);
      next.delete("from");
      const queryString = next.toString() ? `?${next.toString()}` : "";
      navigate(`${location.pathname}${queryString}`, { replace: true });
    }
  }, [user?.role, fromShw, searchParams, navigate, location.pathname]);

  if (!token) {
    return <Navigate to={ROUTES.SIGN_IN} state={{ from: location }} replace />;
  }

  if (user?.role === "admin") {
    return <>{children}</>;
  }

  if (user?.role === "cultivator" && !cultivatorCanSeeFull) {
    return <Navigate to={ROUTES.LABORATORY} replace />;
  }

  return <>{children}</>;
}
