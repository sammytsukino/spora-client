import FooterAlter from "@/components/layout/FooterAlter";
import SignInForm from "@/components/home/SignInForm";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import Section from "@/components/layout/Section";
import { HeroMeshGradientBackground } from "@/components/backgrounds/Gradient";

export default function SignIn() {
  return (
    <div className="w-full overflow-x-hidden">
      <TransparentNavbar showScrollBackground />

      <Section
        variant="full"
        containerized={false}
        className="relative flex flex-col justify-between min-h-dvh"
      >
        <div className="fixed inset-0 w-full h-full z-0">
          <HeroMeshGradientBackground className="absolute inset-0" />
        </div>

        <div className="relative z-10 shrink-0 h-16 sm:h-20" aria-hidden />
        <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-4 sm:px-6">
          <SignInForm />
        </div>

        <div className="relative z-10">
          <FooterAlter className="px-4 sm:px-6 md:px-12 lg:px-16" />
        </div>
      </Section>
    </div>
  )
}