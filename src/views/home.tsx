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
        className="bg-neutral-800 items-stretch"
      >
        <VideoTextSection />
      </Section>

      <Section variant="compact" containerized={false}>
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center px-6 md:px-12 lg:px-16 py-4 mt-8">
            <h2 className="text-xl sm:text-lg md:text-2x1 font-jetbrains-mono hover:underline cursor-pointer" onClick={() => navigate('/garden')}>
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

        <div className="relative z-10">
          <FooterMain />
        </div>
      </Section>
    </div>
  )
}
