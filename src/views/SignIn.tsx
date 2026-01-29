import { BubbleBackground } from "@/components/animate-ui/components/backgrounds/bubble";
import FooterAlter from "@/components/home/footer-alter";
import SignInForm from "@/components/home/signin-form";
import TransparentNavbar from "@/components/home/transparent-navbar";
import Section from "@/components/Section";

export default function SignIn() {
  return (
    <div className="w-full overflow-x-hidden">
      <TransparentNavbar />

      <Section
        variant="full"
        containerized={false}
        className="relative flex flex-col justify-between"
      >
        <BubbleBackground
          interactive
          className="fixed inset-0 pointer-events-none z-0 w-screen h-screen"
        />
        
        <div className="relative z-10 flex-1">
          <SignInForm />
        </div>
        
        <div className="relative z-10">
          <FooterAlter />
        </div>
      </Section>
    </div>
  )
}
