import React from "react"
import { useNavigate } from "react-router-dom"
import CyclingLogo from "./cycling-logo"

export default function FooterAlter() {
  const navigate = useNavigate()

  return (
    <footer className="w-full h-full bg-transparent px-4 sm:px-6 md:px-8 py-8 flex flex-col justify-between text-neutral-900">
      {/* Top labels */}

      {/* Top horizontal line */}
      <div className="flex justify-end">
        <div className="w-1/2 border-t border-neutral-900 mb-10" />
      </div>

      {/* Middle graphic row */}
      <div className="flex-1 flex items-end justify-between mt-8">
        {/* Left logo placeholder */}
        <div className="flex items-end">
          <CyclingLogo
            logos={[
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready5_czorye.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready4_tnwrxb.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready3_wtlf0u.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready2_f5swhs.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready1_psvx4m.svg",
            ]}
            width="12.5rem"
            height={120}
            cycleDuration={0.2}
          />
        </div>

        {/* Right navigation */}
        <div className="flex items-start">
          <div className="text-[10px] sm:text-xs font-jetbrains-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-1 justify-items-end text-right text-sm sm:text-lg">
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
      </div>

      {/* Bottom meta + nav */}
      <div className="mt-8 flex items-center justify-center text-[10px] sm:text-xs font-jetbrains-mono">
        {/* Centered copyright */}
        <span className="text-center whitespace-nowrap">© 2026, SPORA</span>
      </div>
    </footer>
  )
}

