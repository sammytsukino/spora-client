import { useNavigate } from "react-router-dom";
import CyclingLogo from "@/components/home/cycling-logo";

type NavTarget = "/garden" | "/greenhouse" | "/laboratory";

interface TeamNavbarProps {
  onNavigateRequest?: (path: NavTarget) => void;
}

export default function TeamNavbar({ onNavigateRequest }: TeamNavbarProps) {
  const navigate = useNavigate();

  const handleClick = (path: NavTarget) => {
    if (onNavigateRequest) {
      onNavigateRequest(path);
    } else {
      navigate(path);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between text-[#262626] font-supply-mono">
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
          className="hover:underline cursor-pointer"
          onClick={() => handleClick("/laboratory")}
        >
          (03)LABORATORY
        </button>
      </nav>

      <button
        type="button"
        onClick={() => navigate("/")}
        className="cursor-pointer"
      >
        <CyclingLogo
          logos={[
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready5_czorye.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready4_tnwrxb.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready3_wtlf0u.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready2_f5swhb.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready1_psvx4m.svg",
          ]}
          width="80px"
          height={30}
          cycleDuration={0.2}
        />
      </button>
    </header>
  );
}
