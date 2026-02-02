import { useEffect } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";
import PageTitle from "@/components/ui/page-title";
import TeamCard from "@/components/team/team-card";
import { teamMembers } from "@/data/team-data";

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
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      <main className="flex-1 pt-20 pb-16 px-6 md:px-12 lg:px-16">
        <PageTitle
          supertitle="(05)TEAM"
          title="MEET THE MINDS BEHIND SPORA"
          description="A collective of artists, developers, and researchers pushing the boundaries of generative art."
          className="mb-12"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>

        <div className="mt-16 border-2 border-[#262626] p-8 bg-[#E9E9E9]">
          <h3 className="font-bizud-mincho-bold text-3xl mb-4">Join Our Community</h3>
          <p className="font-supply-mono text-sm mb-6">
            SPORA is more than a platform—it's a movement. We're always looking for passionate artists, 
            developers, and thinkers to join our mission of redefining generative art.
          </p>
          <a 
            href="mailto:hello@spora.art" 
            className="font-supply-mono text-sm border-2 border-[#262626] px-6 py-2 inline-block hover:bg-lime-300 transition-colors"
          >
            GET IN TOUCH
          </a>
        </div>
      </main>

      <div className="relative z-10">
        <FooterAlter />
      </div>
    </div>
  )
}
