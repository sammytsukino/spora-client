import { useEffect } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import TeamFooter from "@/components/team/team-footer";
import Lanyard from "@/components/laboratory/Lanyard";

export default function Team() {
  useEffect(() => {
    document.body.classList.add('hide-scrollbar')
    document.documentElement.classList.add('hide-scrollbar')

    return () => {
      document.body.classList.remove('hide-scrollbar')
      document.documentElement.classList.remove('hide-scrollbar')
    }
  }, [])

  return (
    <div className="relative w-full overflow-x-hidden min-h-screen flex flex-col bg-[var(--spora-primary-light)]">
            <TransparentNavbar showScrollBackground />


      <main className="relative flex-1">
        <div className="absolute inset-0">
          <Lanyard position={[0, 0, 10]} gravity={[0, -40, 0]} />
        </div>
      </main>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <TeamFooter />
      </div>
    </div>
  )
}
