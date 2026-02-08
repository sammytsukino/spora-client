import { useNavigate } from "react-router-dom"
import CyclingLogo from "./cycling-logo"

export default function FooterMain() {
  const navigate = useNavigate()

  return (
    <footer className="w-full h-full px-6 md:px-12 lg:px-16 py-8 flex flex-col justify-between text-[var(--spora-primary)]">
      <div className="flex items-start justify-between text-lg sm:text-2xl font-supply-mono mb-10 sm:mb-12">
        <p className="whitespace-pre leading-tight">
          Not{"\n"}
          revolutionary
        </p>
        <p className="whitespace-pre leading-tight text-right">
          But{"\n"}
          evolutionary
        </p>
      </div>

      <div className="flex items-start justify-end">
        <img
          src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1769536671/Ready12_xjlgkh.svg"
          alt="Spora logo"
          className="max-w-[220px] sm:max-w-[480px] lg:max-w-[800px] object-contain"
        />
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center">
          <CyclingLogo
            logos={[
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1770557718/Ready5_wlhvqu.webp",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1770557729/Ready1_tho4wi.webp",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1770557729/Ready2_cxjg7b.webp",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1770557720/Ready3_hisekc.webp",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1770557719/Ready4_b6iujg.webp",
            ]}
            width="clamp(9rem, 16vw, 16rem)"
            height="clamp(90px, 10vw, 160px)"
            cycleDuration={0.5}
            overlapDuration={0.07}
          />
        </div>

        <div className="flex-1 flex flex-col items-end justify-center ml-4 sm:ml-8">
          <div className="w-1/2 border-t-2 border-[var(--spora-primary)]" />
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between text-[10px] sm:text-xs font-supply-mono">
        <span className="flex-1" />

        <span className="text-center whitespace-nowrap">© 2026, SPORA</span>

        <div className="flex-1 flex justify-end">
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
    </footer>
  )
}

