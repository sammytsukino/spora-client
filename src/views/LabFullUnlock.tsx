import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken } from "@/lib/auth";
import { ROUTES, laboratoryFullFromGrow } from "@/constants/routes";

export default function LabFullUnlock() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getStoredToken()) {
      navigate(ROUTES.SIGN_UP, { replace: true });
      return;
    }

    navigate(laboratoryFullFromGrow(), { replace: true });
  }, [navigate]);

  return null;
}
