import { useNavigate } from "react-router-dom"
import CyclingLogo from "./cycling-logo"

export default function FooterAlter() {
  const navigate = useNavigate()

  return (
    <footer className="relative w-full h-full px-6 md:px-12 lg:px-16 py-8 flex flex-col justify-between text-[#262626] overflow-hidden">
      <div className="relative z-10 flex flex-col justify-between h-full">



      <div className="flex-1 flex items-end justify-between mt-8">
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

        <div className="w-2/3 border-t-2 border-[#262626] mb-10" />

        <div className="flex items-start">
          <div className="text-[10px] sm:text-xs font-supply-mono">
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

      <div className="mt-8 flex items-center justify-center text-[10px] sm:text-xs font-supply-mono">
        <span className="text-center whitespace-nowrap">© 2026, SPORA</span>
      </div>
      </div>
    </footer>
  )
}

