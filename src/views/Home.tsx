import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../index.css'
import { ROUTES } from '@/constants/routes'
import { useFloraThumbnails } from '@/hooks/useFloraThumbnails'
import MarqueeAlongSvgPath from '../components/home/MarqueeAlongSvgPath'
import VideoTextSection from '../components/home/VideoTextSection'
import SimpleMarquee from '../components/home/SimpleMarquee'
import MainButton from '../components/ui/MainButton'
import FooterMain from '../components/layout/FooterMain'
import Section from '@/components/layout/Section'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/home/HeroSection'
import DeclarativeSection from '@/components/home/DeclarativeSection'
import QuoteSection from '@/components/home/QuoteSection'
import { BubbleBackground } from '@/components/backgrounds/BubbleBackground'

const bubbleColors = {
  first: '18,113,255',
  second: '221,74,255',
  third: '0,220,255',
  fourth: '82,255,90',
  fifth: '244,239,64',
  sixth: '255,100,255',
}

export default function Home() {
  const navigate = useNavigate()
  const { items: floraThumbnails } = useFloraThumbnails(50)

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
        variant="flush"
        containerized={false}
        className="items-stretch justify-start"
      >
        <DeclarativeSection
          text="SPORA is a collaborative platform where words becomes generative art. Each piece forms a unique flora whose shape is defined by its sentiment, rhythm, and structural patterns, and can grow new derivative branches while preserving its core identity through a shared soil."
          imageSrc="https://res.cloudinary.com/dsy30p7gf/image/upload/v1774263030/lace_chart_jfrssl.png"
        />
      </Section>

      <Section
        variant="flush"
        containerized={false}
        className="items-stretch"
      >
        <MarqueeAlongSvgPath showText={true} items={floraThumbnails} />
      </Section>

      <Section
        variant="large"
        containerized={false}
        className="bg-spora-primary items-stretch max-md:h-auto!"
      >
        <VideoTextSection />
      </Section>

      <Section variant="compact" containerized={false}>
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center px-6 md:px-12 lg:px-16 py-4 mt-8">
            <h2 className="text-xl sm:text-lg md:text-2xl font-supply-mono hover:underline cursor-pointer" onClick={() => navigate(ROUTES.GARDEN)}>
              Featured Floras →
            </h2>
            <MainButton
              variant="compact"
              size="sm"
              type="button"
              onClick={() => navigate(ROUTES.GARDEN)}
            >
              VIEW ALL
            </MainButton>
          </div>

          <div className="flex-1 overflow-hidden">
            <SimpleMarquee items={floraThumbnails} />
          </div>
        </div>
      </Section>

      <Section
        variant="large"
        containerized={false}
        className="items-stretch justify-start"
      >
        <QuoteSection
          quote="Estoy luchando con desesperación
contra cosas que no veo,
cosas que proceden de otro mundo
donde mi cuerpo parece que es la puerta...
"
          author="Fran Barreno"
          buttonText="CREATE YOUR OWN"
          onButtonClick={() => navigate(ROUTES.LABORATORY)}
        />
      </Section>

      <Section
        variant="compact"
        containerized={false}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full">
          <BubbleBackground className="absolute inset-0 w-full h-full" colors={bubbleColors} interactive />
          {/* <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
        </div>

        <div className="relative z-10">
          <FooterMain />
        </div>
      </Section>
    </div>
  )
}
