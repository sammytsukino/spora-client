import type { NavigateFunction } from "react-router-dom";
import { ROUTES } from "@/constants/routes";


export type FloraViewLocationState = {
  flora?: unknown;
  readerReturnTo?: string;
};


export function readerNavState(pathname: string, search: string): Pick<FloraViewLocationState, "readerReturnTo"> {
  return { readerReturnTo: `${pathname}${search}` };
}


export function navigateFloraViewBack(
  navigate: NavigateFunction,
  pathname: string,
  state: FloraViewLocationState | null | undefined
) {
  const explicit = state?.readerReturnTo;
  if (
    typeof explicit === "string" &&
    explicit.startsWith("/") &&
    !explicit.startsWith("//") &&
    explicit !== pathname
  ) {
    navigate(explicit);
    return;
  }

  const h = typeof window !== "undefined" ? window.history.state : null;
  const idx =
    h && typeof h === "object" && "idx" in h && typeof (h as { idx: unknown }).idx === "number"
      ? (h as { idx: number }).idx
      : 0;

  if (idx > 0) {
    navigate(-1);
    return;
  }

  navigate(ROUTES.HOME);
}
