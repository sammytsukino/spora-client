import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken } from "@/lib/auth";

/**
 * Easter egg route: /grow is the only way for cultivators to see lab full.
 * Redirects to /laboratory/full?from=grow (no localStorage; full only this visit).
 * Acrostic in VideoTextSection: first letters of 4 lines spell GROW.
 */
export default function LabFullUnlock() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getStoredToken()) {
      navigate("/signup", { replace: true });
      return;
    }

    navigate("/laboratory/full?from=grow", { replace: true });
  }, [navigate]);

  return null;
}
