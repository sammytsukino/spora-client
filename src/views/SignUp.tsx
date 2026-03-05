import FooterAlter from "@/components/layout/FooterAlter";
import SignUpForm from "@/components/home/SignUpForm";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import Section from "@/components/layout/Section";
import { BubbleBackground } from "@/components/backgrounds/BubbleBackground";

const bubbleColors = {
  first: '18,113,255',
  second: '221,74,255',
  third: '0,220,255',
  fourth: '82,255,90',
  fifth: '244,239,64',
  sixth: '255,100,255',
};

export default function SignUp() {
  return (
    <div className="w-full overflow-x-hidden">
      <TransparentNavbar showScrollBackground />

      <Section
        variant="full"
        containerized={false}
        className="relative flex flex-col justify-between min-h-dvh"
      >
        <div className="fixed inset-0 w-full h-full z-0">
          <BubbleBackground className="absolute inset-0 w-full h-full" colors={bubbleColors} interactive />
        </div>
        {/* <div className="fixed inset-0 w-full h-full z-0">
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
        </div> */}

        <div className="relative z-10 shrink-0 h-16 sm:h-20" aria-hidden />
        <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-4 sm:px-6">
          <SignUpForm />
        </div>

        <div className="relative z-10">
          <FooterAlter />
        </div>
      </Section>
    </div>
  )
}