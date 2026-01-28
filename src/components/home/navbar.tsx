import MainButton from "../ui/main-button"
import { useNavigate } from "react-router-dom"

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="w-full bg-neutral-800 text-stone-300 font-jetbrains-mono">
      <div className="mx-auto flex items-center justify-between px-6 py-3 md:px-10 md:py-4">
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1768395876/Group_33_eu3kbv.svg"
            alt="Spora logo"
            className="h-9 w-auto"
          />
        </div>

        <nav className="flex-1">
          <ul className="flex items-center justify-center gap-8 text-[10px] sm:text-xs tracking-[0.3em] uppercase">
            <li>
              <button
                type="button"
                className="hover:underline cursor-pointer"
                onClick={() => navigate("/garden")}
              >
                (01)GARDEN
              </button>
            </li>
            <li>|</li>
            <li>
              <button
                type="button"
                className="hover:underline cursor-pointer"
                onClick={() => navigate("/greenhouse")}
              >
                (02)GREENHOUSE
              </button>
            </li>
            <li>|</li>
            <li>
              <button
                type="button"
                className="hover:underline cursor-pointer"
                onClick={() => navigate("/laboratory")}
              >
                (03)LABORATORY
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex items-center">
          <MainButton
            variant="navbar"
            size="sm"
            type="button"
            onClick={() => navigate("/signin")}
          >
            SIGN IN
          </MainButton>
        </div>
      </div>
    </header>
  )
}
