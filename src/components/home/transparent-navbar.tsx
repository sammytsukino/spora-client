import MainButton from "@/components/ui/main-button"

export default function TransparentNavbar() {
  return (
    <header className="bg-transparent w-full text-neutral-800 font-jetbrains-mono">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 md:px-10 md:py-4">
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dsy30p7gf/image/upload/v1769075853/logo-grey_j6myjj.svg"
            alt="Spora logo"
            className="h-9 w-auto"
          />
        </div>

        <nav className="flex-1">
          <ul className="flex items-center justify-center gap-8 text-[10px] sm:text-xs tracking-[0.3em] uppercase">
            <li>(01)GARDEN</li>
            <li>|</li>
            <li>(02)GREENHOUSE</li>
            <li>|</li>
            <li>(03)LABORATORY</li>
          </ul>
        </nav>

        <div className="flex items-center">
          <MainButton variant="compact" size="sm" type="button">
            SIGN IN
          </MainButton>
        </div>
      </div>
    </header>
  )
}
