import MainButton from "../ui/main-button"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

type NavbarProps = {
  position?: "fixed" | "sticky"
  className?: string
  showScrollProgress?: boolean
}

export default function Navbar({
  position = "fixed",
  className = "",
  showScrollProgress = false,
}: NavbarProps) {
  const navigate = useNavigate()
  const positionClass = position === "sticky" ? "sticky top-0" : "fixed top-0"
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (!showScrollProgress) return

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(Math.max(0, Math.min(100, progress)))
    }

    updateScrollProgress()
    window.addEventListener("scroll", updateScrollProgress, { passive: true })
    window.addEventListener("resize", updateScrollProgress)

    return () => {
      window.removeEventListener("scroll", updateScrollProgress)
      window.removeEventListener("resize", updateScrollProgress)
    }
  }, [showScrollProgress])

  return (
    <header
      className={`${positionClass} left-0 w-full z-50 bg-neutral-800 text-stone-300 font-jetbrains-mono overflow-hidden ${className}`}
    >

      <div className="relative z-10 mx-auto flex items-center justify-between px-6 py-3 md:px-12 lg:px-16 md:py-4">
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1768395876/Group_33_eu3kbv.svg"
            alt="Spora logo"
            className="h-9 w-auto cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>

        <nav className="flex-1">
          <ul className="flex items-center justify-center gap-8 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold">
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
            {showScrollProgress && (
        <div className="w-full h-[2px] bg-transparent">
          <div
            className="h-full"
            style={{ width: `${scrollProgress}%`, backgroundColor: "#bbf451" }}
          />
        </div>
      )}
    </header>
  )
}
