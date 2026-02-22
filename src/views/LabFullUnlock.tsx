import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken } from "@/lib/auth";

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
