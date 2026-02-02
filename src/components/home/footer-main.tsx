import { useNavigate } from "react-router-dom"

export default function FooterMain() {
  const navigate = useNavigate()

  return (
    <footer className="w-full h-full px-6 md:px-12 lg:px-16 py-8 flex flex-col justify-between text-neutral-900">
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

      <div className="flex items-start justify-end">
        <img src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1769536671/Ready12_xjlgkh.svg" alt="Spora logo" className="max-w-[800px]  object-contain" />
      </div>

      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center">
        <img src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1769536304/Group_107_lca7b7.svg" alt="Spora logo" className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 flex flex-col items-end justify-center ml-4 sm:ml-8">
        <img src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1769536671/Ready12_xjlgkh.svg" alt="Spora logo" className="w-1/5 object-contain" />

          <div className="w-1/2 mt-20  border-t border-neutral-900" />
        </div>
      </div>

      <div className="mt-8 flex items-end justify-between text-[10px] sm:text-xs font-jetbrains-mono">
        <span className="flex-1" />
        <span className="text-center whitespace-nowrap">© 2026, SPORA</span>
        <div className="flex-1 flex justify-end">
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
    </footer>
  )
}

