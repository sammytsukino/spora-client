import { useNavigate } from "react-router-dom";

export default function TeamFooter() {
  const navigate = useNavigate();

  return (
    <footer className="relative w-full px-6 md:px-12 lg:px-16 py-8 flex flex-col justify-between text-[var(--spora-primary)]">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-full md:max-w-xs text-center md:text-left text-sm sm:text-lg font-supply-mono leading-relaxed">
          <span>SPORA: Conceptualized, designed and developed with lots of ♡ by{" "}
            <a
              href="https://www.linkedin.com/in/sammycabello/"
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              SAMMY CABELLO
            </a>
          </span>
        </div>

        <div className="w-full md:w-auto text-[10px] sm:text-xs font-supply-mono">
          <div className="grid grid-cols-3 grid-rows-2 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-1 justify-items-center md:justify-items-end text-center md:text-right text-sm sm:text-lg">
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => navigate("/team")}
            >
              Team
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => navigate("/garden")}
            >
              Garden
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => navigate("/research")}
            >
              Research
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
              onClick={() => navigate("/contact")}
            >
              Contact
            </button>
            <button
              type="button"
              className="hover:underline cursor-pointer"
              onClick={() => navigate("/laboratory")}
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
