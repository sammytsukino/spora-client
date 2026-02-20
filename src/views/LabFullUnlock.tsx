import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken, setLabFullUnlocked } from "@/lib/auth";

/**
 * Easter egg route: /grow unlocks lab full for cultivators and redirects.
 * Acrostic in VideoTextSection (flora definition): first letters of 4 lines spell GROW.
 */
export default function LabFullUnlock() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getStoredToken()) {
      navigate("/signup", { replace: true });
      return;
    }

    setLabFullUnlocked();
    navigate("/laboratory/full", { replace: true });
  }, [navigate]);

  return null;
}
