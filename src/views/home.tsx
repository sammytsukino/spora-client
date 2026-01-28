import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../index.css'
import Navbar from '../components/home/navbar'
import MarqueeAlongSvgPath from '../components/home/marquee-along-svg-path'
import ImageTrail from '../components/home/image-trail'
import VideoTextSection from '../components/home/video-text-section'
import SimpleMarquee from '../components/home/simple-marquee'
import MainButton from '../components/ui/main-button'
import DeclarativeText from '../components/home/declarative-text'
import PixelTrail from '../components/home/pixel-trail'
import GooeySvgFilter from '../components/home/gooey-svg-filter'
import useDetectBrowser from '../hooks/use-detect-browser'
import useScreenSize from '../hooks/use-screen-size'
import FooterMain from '../components/home/footer-main'
import Section from '../components/Section'
import Iridescence from '@/components/Iridescence'
import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble'


export default function Home() {
  const screenSize = useScreenSize()
  const browserName = useDetectBrowser()
  const isSafari = browserName === "Safari"

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />

      {/* HERO - pantalla completa con ImageTrail */}
      <Section variant="hero" containerized={false} className="items-stretch">
        <ImageTrail />
        
      </Section>

      {/* Sección con texto declarativo y PixelTrail de fondo */}
      <Section
        variant="large"
        containerized={false}
        className="bg-neutral-800 items-stretch justify-start"
      >
        <div className="relative w-full h-full overflow-hidden">
          {/* Gooey SVG Filter */}
          <GooeySvgFilter id="gooey-filter-declarative" strength={5} />

          {/* Pixel Trail como fondo - con filtro gooey pero sin fade */}
          <div
            className="absolute inset-0 z-0"
            style={{ filter: isSafari ? 'none' : 'url(#gooey-filter-declarative)' }}
          >
            <PixelTrail
              pixelSize={screenSize.lessThan(`md`) ? 24 : 60}
              fadeDuration={0}
              delay={2000}
              pixelClassName="[background:radial-gradient(circle,#c6ff00_0%,#ff00f0_100%)]"
              className="w-full h-full"
            />

            
          </div>

          {/* Texto declarativo por encima - pointer-events-none para que el mouse pase a través */}
          <div className="relative z-10 px-20 h-full flex items-start pt-8 pointer-events-none">
            <DeclarativeText className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight pointer-events-none">
              SPORA is a collaborative platform where words becomes generative art. Each piece forms a unique flora whose shape is defined by its sentiment, rhythm, and structural patterns, and can grow new derivative branches while preserving its core identity through a shared soil.
            </DeclarativeText>
          </div>
        </div>
      </Section>

      {/* Sección con marquee y texto a la izquierda */}
      <Section
        variant="medium"
        containerized={false}
        className="items-stretch"
      >
        <MarqueeAlongSvgPath showText={true} />
      </Section>

      {/* Sección de video + texto (sin padding vertical de Section) */}
      <Section
        variant="flush"
        containerized={false}
        className="bg-neutral-800 items-stretch"
      >
        <VideoTextSection />
      </Section>

      {/* Sección con marquee y header personalizado */}
      <Section variant="compact" containerized={false}>
        <div className="w-full h-full flex flex-col">
          {/* Header personalizado - se renderiza fuera del componente */}
          <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-4 mt-8">
            <h2 className="text-xl sm:text-lg md:text-2x1 underline font-jetbrains-mono">
              Featured Floras →
            </h2>
            <MainButton variant="compact" size="sm" type="button">
              VIEW ALL
            </MainButton>
          </div>

          {/* El marquee simple - solo se enfoca en el contenido */}
          <div className="flex-1 overflow-hidden">
            <SimpleMarquee />
          </div>
        </div>
      </Section>

      {/* Sección con PixelTrail + quote + botón */}
      <Section
        variant="medium"
        containerized={false}
        className="bg-neutral-800 items-stretch justify-start"
      >
        <div className="relative w-full h-full overflow-hidden">
          {/* Gooey SVG Filter */}
          <GooeySvgFilter id="gooey-filter-declarative" strength={5} />

          {/* Pixel Trail como fondo - con filtro gooey pero sin fade */}
          <div
            className="absolute inset-0 z-0"
            style={{ filter: isSafari ? 'none' : 'url(#gooey-filter-declarative)' }}
          >
            <PixelTrail
              pixelSize={screenSize.lessThan(`md`) ? 24 : 60}
              fadeDuration={0}
              delay={2000}
              pixelClassName="[background:radial-gradient(circle,#c6ff00_0%,#ff00f0_100%)]"
              className="w-full h-full"
            />
          </div>

          {/* Texto declarativo y botón alineados con el grid principal */}
          <div className="relative z-10 h-full flex flex-col items-end justify-start pt-8 px-4 sm:px-6 md:px-8">
            
            <DeclarativeText className="max-w-6xl flex text-right text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight pointer-events-none -mr-15">
              "Lloro porque no siento nada, y ahora además de triste me siento un farsante"
            </DeclarativeText>

            {/* Main Button debajo del texto */}
            <div className="mt-12 pointer-events-auto">
              <MainButton variant="navbar" size="sm" type="button">
                CREATE YOUR OWN
              </MainButton>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer principal con fondo Iridescence */}
      <Section
        variant="compact"
        containerized={false}
        className="relative overflow-hidden"
      >
            <BubbleBackground
              interactive
              className="absolute inset-0 flex items-center justify-center rounded-xl"
            />

        <div className="relative z-10">
          <FooterMain />
        </div>
      </Section>


    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
