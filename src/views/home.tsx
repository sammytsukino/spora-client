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
import { MeshGradient } from '@paper-design/shaders-react'

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
    <div className="w-full overflow-x-hidden ">
      <Navbar position="fixed" showScrollProgress />

      <Section
        variant="hero"
        containerized={false}
        className="relative overflow-hidden flex flex-col min-h-0 p-0 m-0"
      >
        <HeroSection />
      </Section>

      <Section
        variant="large"
        containerized={false}
        className="items-stretch justify-start "
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
        className="bg-[var(--spora-primary)] items-stretch"
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
            src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1770320881/BACKGROUND-GRADIENT_bejhdr.mp4"
            type="video/mp4"
          />
        </video>
        */}

        {/* Fondo con Grainient (mismo esquema que Background.tsx) */}
        <div className="absolute inset-0 w-full h-full">
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <MeshGradient speed={1} scale={1} distortion={0.8} swirl={0.1} colors={['#CAFF50', '#FF64FF', '#F4EF40', '#52FF5A', '#00DCFF', '#DD4AFF', '#EDEDED']} style={{ height: '100%', width: '100%' }}
            />

          </div>
        </div>

        

        <div className="relative z-10">
          <FooterMain />
        </div>
      </Section>
    </div>
  )
}
