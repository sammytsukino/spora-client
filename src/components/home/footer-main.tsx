import React from "react"
import { useNavigate } from "react-router-dom"
import CyclingLogo from "./cycling-logo"

export default function FooterMain() {
  const navigate = useNavigate()

  return (
    <footer className="w-full h-full px-4 sm:px-6 md:px-8 py-8 flex flex-col justify-between text-neutral-900">
      {/* Top labels */}
      <div className="flex items-start justify-between text-2xl sm:text-2xl font-jetbrains-mono mb-12">
        <p className="whitespace-pre leading-tight">
          Not{"\n"}
          revolutionary
        </p>
        <p className="whitespace-pre leading-tight text-right">
          But{"\n"}
          evolutionary
        </p>
      </div>

      {/* Top image row */}
      <div className="flex items-start justify-end">
        <img src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1769536671/Ready12_xjlgkh.svg" alt="Spora logo" className="max-w-[800px]  object-contain" />
      </div>

      {/* Middle graphic row */}
      <div className="flex-1 flex items-center justify-between">
        {/* Left logo placeholder */}
        <div className="flex items-center">
          <CyclingLogo
            logos={[
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready5_czorye.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready4_tnwrxb.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready3_wtlf0u.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready2_f5swhs.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769690617/Ready1_psvx4m.svg",
            ]}
            width="clamp(12.5rem, 20vw, 20rem)"
            height="clamp(120px, 12vw, 200px)"
            cycleDuration={0.2}
          />
        </div>
            
        {/* Right brand + rule */}
        <div className="flex-1 flex flex-col items-end justify-center ml-4 sm:ml-8">
          <div className="w-1/2 border-t border-neutral-900" />
        </div>
      </div>

      {/* Bottom meta + nav */}
      <div className="mt-8 flex items-end justify-between text-[10px] sm:text-xs font-jetbrains-mono">
        {/* Spacer to keep copyright centered */}
        <span className="flex-1" />

        {/* Centered copyright */}
        <span className="text-center whitespace-nowrap">© 2026, SPORA</span>

        {/* Right navigation */}
        <div className="flex-1 flex justify-end">
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
    </footer>
  )
}

