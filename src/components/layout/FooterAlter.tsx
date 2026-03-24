import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { isLabFullAccessible } from "@/lib/auth"
import CyclingLogo from "@/components/layout/CyclingLogo"

export default function FooterAlter() {
  const navigate = useNavigate()

  return (
    <footer className="relative w-full shrink-0 px-6 md:px-12 lg:px-16 py-8 flex flex-col justify-between text-spora-primary overflow-hidden">
      <div className="relative z-10 flex flex-col justify-between">
        <div className="mt-8 flex min-w-0 w-full items-end gap-3">
          <div className="flex shrink-0 items-end">
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
              cycleDuration={0.5}
              overlapDuration={0.07}
            />
          </div>

          <div
            className="hidden lg:flex flex-1 min-w-0 items-end mb-10 px-2 md:px-4"
            aria-hidden
          >
            <div className="h-px w-full min-w-0 bg-spora-primary" />
          </div>

          <div className="flex min-w-0 shrink-0 justify-end">
            <div className="min-w-0 text-[10px] sm:text-xs font-supply-mono">
              <div className="grid grid-cols-1 gap-y-1 justify-items-end text-right text-sm sm:grid-cols-2 sm:gap-x-8 sm:gap-y-1 sm:text-lg">
                <button
                  type="button"
                  className="hover:underline cursor-pointer"
                  onClick={() => navigate(ROUTES.TEAM)}
                >
                  Team
                </button>
                <button
                  type="button"
                  className="hover:underline cursor-pointer"
                  onClick={() => navigate(ROUTES.GARDEN)}
                >
                  Garden
                </button>
                <button
                  type="button"
                  className="hover:underline cursor-pointer"
                  onClick={() => navigate(ROUTES.TERMS)}
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
                  onClick={() => navigate(ROUTES.CONTACT)}
                >
                  Contact
                </button>
                <button
                  type="button"
                  className="hover:underline cursor-pointer"
                  onClick={() =>
                    navigate(isLabFullAccessible() ? ROUTES.LABORATORY_FULL : ROUTES.LABORATORY)
                  }
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
