import FooterAlter from "@/components/home/footer-alter";
import SignInForm from "@/components/home/signin-form";
import TransparentNavbar from "@/components/home/transparent-navbar";
import Section from "@/components/Section";
import Grainient from "@/components/Grainient";

export default function SignIn() {
  return (
    <div className="w-full overflow-x-hidden">
      <TransparentNavbar showScrollBackground />

      <Section
        variant="full"
        containerized={false}
        className="relative flex flex-col justify-between"
      >
        {/* Fondo anterior en vídeo, comentado temporalmente */}
        {/*
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
        */}

        {/* Fondo con Grainient, mismo esquema de color que Background/Home */}
        <div className="fixed inset-0 w-full h-full z-0">
          <Grainient
            color1={['#f5f3ed', '#f5f3ed', '#f5f3ed', '#f5f3ed', '#f5f3ed']}
            color2={['#dd4aff', '#dd4aff', '#00dcff', '#ff64ff', '#bbf451']}
            color3={['#00dcff', '#f4ef40', '#bbf451', '#00dcff', '#ff64ff']}
            timeSpeed={1.45}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.9}
          />
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