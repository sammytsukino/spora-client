import { useNavigate } from "react-router-dom";

type NavTarget = "/garden" | "/greenhouse" | "/laboratory";

interface LaboratoryNavbarProps {
  onNavigateRequest?: (path: NavTarget) => void;
}

export default function LaboratoryNavbar({ onNavigateRequest }: LaboratoryNavbarProps) {
  const navigate = useNavigate();

  const handleClick = (path: NavTarget) => {
    if (onNavigateRequest) {
      onNavigateRequest(path);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 lg:px-16 py-4 flex items-center justify-end text-[#262626] font-supply-mono">
      <nav className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold">
        <button
          type="button"
          className="hover:underline cursor-pointer"
          onClick={() => handleClick("/garden")}
        >
          (01)GARDEN
        </button>
        <span>|</span>
        <button
          type="button"
          className="hover:underline cursor-pointer"
          onClick={() => handleClick("/greenhouse")}
        >
          (02)GREENHOUSE
        </button>
        <span>|</span>
        <button
          type="button"
          className="hover:underline cursor-pointer underline"
          onClick={() => handleClick("/laboratory")}
        >
          (03)LABORATORY
        </button>
      </nav>
    </header>
  );
}

