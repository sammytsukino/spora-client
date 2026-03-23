import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { getStoredToken } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = ROUTES.SIGN_UP }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
