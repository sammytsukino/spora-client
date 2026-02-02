import FooterAlter from "@/components/home/footer-alter";
import SignInForm from "@/components/home/signin-form";
import TransparentNavbar from "@/components/home/transparent-navbar";
import Section from "@/components/Section";

export default function SignIn() {
  return (
    <div className="w-full overflow-x-hidden">
      <TransparentNavbar showScrollBackground />

      <Section
        variant="full"
        containerized={false}
        className="relative flex flex-col justify-between"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover z-0"
        >
          <source
            src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1770048737/BACKGROUND-COLORS_pm0nlf.mp4"
            type="video/mp4"
          />
        </video>
        
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 pt-24 pb-10">
          <SignInForm />
        </div>
        
        <div className="relative z-10">
          <FooterAlter />
        </div>
      </Section>
    </div>
  )
}