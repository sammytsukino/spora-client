import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { isLabFullAccessible } from "@/lib/auth";
export default function TeamFooter() {
  const navigate = useNavigate();

  return (
    <footer className="relative flex w-full flex-col justify-between px-6 py-8 text-[var(--spora-primary)] md:px-12 lg:px-16">
      <div className="flex w-full flex-col items-end gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-full text-right text-sm leading-relaxed font-supply-mono md:max-w-xs md:text-left sm:text-lg">
          <span>SPORA: Conceptualized, designed and developed with lots of ♡ by{" "}
            <a
              href="https://www.linkedin.com/in/sammycabello/"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer hover:underline"
            >
              SAMMY CABELLO
            </a>
          </span>
        </div>

        <div className="flex w-full min-w-0 justify-end text-[10px] sm:text-xs font-supply-mono md:w-auto">
          <div className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-1 justify-items-end text-right text-sm sm:grid-cols-2 sm:gap-x-8 sm:text-lg">
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => navigate(ROUTES.TEAM)}
            >
              Team
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => navigate(ROUTES.GARDEN)}
            >
              Garden
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => navigate(ROUTES.TERMS)}
            >
              <span className="md:hidden">Terms</span>
              <span className="hidden md:inline">Terms & Conditions</span>
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => navigate("/greenhouse")}
            >
              Greenhouse
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => navigate(ROUTES.CONTACT)}
            >
              Contact
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() =>
                navigate(isLabFullAccessible() ? ROUTES.LABORATORY_FULL : ROUTES.LABORATORY)
              }
            >
              Laboratory
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center text-[10px] sm:text-xs font-supply-mono">
        <span className="text-center whitespace-nowrap">© 2026, SPORA</span>
      </div>
    </footer>
  );
}
