import { useNavigate } from "react-router-dom"
import { isLabFullAccessible } from "@/lib/auth"
import CyclingLogo from "@/components/layout/CyclingLogo"

export default function FooterMain() {
  const navigate = useNavigate()

  return (
    <footer className="flex h-full w-full flex-col justify-between px-6 py-8 text-[var(--spora-primary)] md:px-12 lg:px-16">
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
          className="max-w-[180px] sm:max-w-[400px] lg:max-w-[640px] object-contain"
        />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-between">
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

        <div className="ml-4 flex min-w-0 flex-1 flex-col items-end justify-center sm:ml-8">
          <div className="w-1/2 border-t border-[var(--spora-primary)]" />
        </div>
      </div>

      <div className="mt-8 flex w-full min-w-0 flex-col gap-6 text-[10px] sm:text-xs font-supply-mono">
        <div className="flex w-full min-w-0 justify-end">
          <div className="min-w-0 text-[10px] sm:text-xs font-supply-mono">
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 justify-items-end text-right text-sm sm:grid-cols-2 sm:gap-x-8 sm:text-lg">
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
                onClick={() => navigate("/terms")}
              >
                <span className="md:hidden">Terms</span>
                <span className="hidden md:inline">Terms & Conditions</span>
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
                onClick={() => navigate(isLabFullAccessible() ? "/laboratory/full" : "/laboratory")}
              >
                Laboratory
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <span className="whitespace-nowrap text-center">© 2026, SPORA</span>
        </div>
      </div>
    </footer>
  )
}
