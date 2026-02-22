import FooterAlter from "@/components/home/FooterAlter";
import SignInForm from "@/components/home/SignInForm";
import TransparentNavbar from "@/components/home/TransparentNavbar";
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
        <div className="fixed inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1770320881/BACKGROUND-GRADIENT_bejhdr.mp4"
              type="video/mp4"
            />
          </video>
        </div>

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