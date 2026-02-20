import { Navigate, useLocation } from "react-router-dom";
import {
  getStoredToken,
  getStoredUser,
  isLabFullUnlocked,
} from "@/lib/auth";
interface LabFullRouteProps {
  children: React.ReactNode;
}

/**
 * Lab Full is accessible to admins always.
 * Cultivators need to unlock it via the Easter egg: /laboratory/full/soil
 */
export default function LabFullRoute({ children }: LabFullRouteProps) {
  const location = useLocation();
  const token = getStoredToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/signup" state={{ from: location }} replace />;
  }

  if (user?.role === "admin") {
    return <>{children}</>;
  }

  if (user?.role === "cultivator" && !isLabFullUnlocked()) {
    return <Navigate to="/laboratory" replace />;
  }

  return <>{children}</>;
}
