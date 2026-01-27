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

export default function Home() {
  const screenSize = useScreenSize()
  const browserName = useDetectBrowser()
  const isSafari = browserName === "Safari"

  return (
    <div className="components-container">
      <Navbar />


      {/*<section className="component-section">
        <GooeySvgFilterPixelTrail />
      </section>*/}

      {/* Sección tamaño completo (100vh) */}
      <section className="component-section">
        <ImageTrail />
      </section>

      {/* Sección con texto declarativo */}
      <section className="component-section">
        <div className="relative w-full h-full bg-neutral-800 overflow-hidden">
          {/* Gooey SVG Filter */}
          <GooeySvgFilter id="gooey-filter-declarative" strength={5} />

          {/* Pixel Trail como fondo - con filtro gooey pero sin fade */}
          <div
            className="absolute inset-0 z-0"
            style={{ filter: isSafari ? "none" : "url(#gooey-filter-declarative)" }}
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
      </section>

      {/* Sección con marquee y texto a la izquierda */}
      <section className="component-section-medium">
        <MarqueeAlongSvgPath showText={true} />
      </section>

      <section className="component-section-medium">
        <VideoTextSection />
      </section>



      {/* Sección con marquee y header personalizado */}
      <section className="component-section-small">
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
      </section>

      <section className="component-section-small">
        <div className="relative w-full h-full bg-neutral-800 overflow-hidden">
          {/* Gooey SVG Filter */}
          <GooeySvgFilter id="gooey-filter-declarative" strength={5} />

          {/* Pixel Trail como fondo - con filtro gooey pero sin fade */}
          <div
            className="absolute inset-0 z-0"
            style={{ filter: isSafari ? "none" : "url(#gooey-filter-declarative)" }}
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
      </section>

      {/* Footer principal */}
      <section className="component-section-small">
        <FooterMain />
      </section>

    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
