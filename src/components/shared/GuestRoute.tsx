import { Navigate } from "react-router-dom";
import { getStoredToken } from "@/lib/auth";

interface GuestRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function GuestRoute({ children, redirectTo = "/profile" }: GuestRouteProps) {
  const token = getStoredToken();

  if (token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
