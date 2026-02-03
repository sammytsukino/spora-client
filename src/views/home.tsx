import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../index.css'
import MarqueeAlongSvgPath from '../components/home/marquee-along-svg-path'
import VideoTextSection from '../components/home/video-text-section'
import SimpleMarquee from '../components/home/simple-marquee'
import MainButton from '../components/ui/main-button'
import FooterMain from '../components/home/footer-main'
import Section from '../components/Section'
import Navbar from '@/components/home/navbar'
import HeroSection from '@/components/home/hero-section'
import DeclarativeSection from '@/components/home/declarative-section'
import QuoteSection from '@/components/home/quote-section'
import Grainient from '@/components/Grainient'

export default function Home() {
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.add('hide-scrollbar')
    document.documentElement.classList.add('hide-scrollbar')

    return () => {
      document.body.classList.remove('hide-scrollbar')
      document.documentElement.classList.remove('hide-scrollbar')
    }
  }, [])

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar position="fixed" showScrollProgress />

      <Section
        variant="hero"
        containerized={false}
        className="relative overflow-hidden items-stretch"
      >
        <HeroSection />
      </Section>

      <Section
        variant="large"
        containerized={false}
        className="items-stretch justify-start"
      >
        <DeclarativeSection 
          text="SPORA is a collaborative platform where words becomes generative art. Each piece forms a unique flora whose shape is defined by its sentiment, rhythm, and structural patterns, and can grow new derivative branches while preserving its core identity through a shared soil."
        />
      </Section>

      <Section
        variant="medium"
        containerized={false}
        className="items-stretch"
      >
        <MarqueeAlongSvgPath showText={true} />
      </Section>

      <Section
        variant="medium"
        containerized={false}
        className="bg-[#262626] items-stretch"
      >
        <VideoTextSection />
      </Section>

      <Section variant="compact" containerized={false}>
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center px-6 md:px-12 lg:px-16 py-4 mt-8">
            <h2 className="text-xl sm:text-lg md:text-2x1 font-supply-mono hover:underline cursor-pointer" onClick={() => navigate('/garden')}>
              Featured Floras →
            </h2>
            <MainButton
              variant="compact"
              size="sm"
              type="button"
              onClick={() => navigate('/garden')}
            >
              VIEW ALL
            </MainButton>
          </div>

          <div className="flex-1 overflow-hidden">
            <SimpleMarquee />
          </div>
        </div>
      </Section>

      <Section
        variant="medium"
        containerized={false}
        className="items-stretch justify-start"
      >
        <QuoteSection 
          quote="Lloro porque no siento nada, y ahora además de triste me siento un farsante"
          buttonText="CREATE YOUR OWN"
          onButtonClick={() => navigate('/laboratory')}
        />
      </Section>

      <Section
        variant="compact"
        containerized={false}
        className="relative overflow-hidden"
      >
        {/* Fondo anterior en vídeo, comentado temporalmente */}
        {/*
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1770048737/BACKGROUND-COLORS_pm0nlf.mp4"
            type="video/mp4"
          />
        </video>
        */}

        {/* Fondo con Grainient (mismo esquema que Background.tsx) */}
        <div className="absolute inset-0 w-full h-full">
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

        <div className="relative z-10">
          <FooterMain />
        </div>
      </Section>
    </div>
  )
}
