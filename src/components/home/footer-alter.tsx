import React from "react"
import { useNavigate } from "react-router-dom"

export default function FooterAlter() {
  const navigate = useNavigate()

  return (
    <footer className="w-full h-full bg-transparent px-4 sm:px-6 md:px-8 py-8 flex flex-col justify-between text-neutral-900">
      <div className="flex justify-end">
        <div className="w-1/2 border-t border-neutral-900 mb-10" />
      </div>

      <div className="flex-1 flex items-end justify-between mt-8">
        <div className="flex items-start">
          <img src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1769536304/Group_107_lca7b7.svg" alt="Spora logo" className="w-50 h-auto object-contain" />
        </div>

        <div className="flex items-start">
          <div className="text-[10px] sm:text-xs font-jetbrains-mono">
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 justify-items-end text-right text-lg">
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

      <div className="mt-8 flex items-center justify-center text-[10px] sm:text-xs font-jetbrains-mono">
        <span className="text-center whitespace-nowrap">© 2025, SPORA</span>
      </div>
    </footer>
  )
}

