import MainButton from "../ui/main-button"
import { useNavigate } from "react-router-dom"
// import { motion, useScroll } from "motion/react"

export default function Navbar() {
  const navigate = useNavigate()
  // const { scrollYProgress } = useScroll()

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-neutral-800 text-stone-300 font-jetbrains-mono overflow-hidden">
      {/*
      <motion.div
        id="scroll-indicator"
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          scaleX: scrollYProgress,
          transformOrigin: "0% 50%",
          backgroundColor: "#F434C0",
        }}
      />
      */}
      <div className="relative z-10 mx-auto flex items-center justify-between px-6 py-3 md:px-10 md:py-4">
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1768395876/Group_33_eu3kbv.svg"
            alt="Spora logo"
            className="h-9 w-auto cursor-pointer"
            onClick={() => navigate("/")}
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
