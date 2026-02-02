import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../index.css'
import MarqueeAlongSvgPath from '../components/home/marquee-along-svg-path'
import ImageTrail from '../components/home/image-trail'
import VideoTextSection from '../components/home/video-text-section'
import SimpleMarquee from '../components/home/simple-marquee'
import MainButton from '../components/ui/main-button'
import PixelTrail from '../components/home/pixel-trail'
import GooeySvgFilter from '../components/home/gooey-svg-filter'
import useDetectBrowser from '../hooks/use-detect-browser'
import useScreenSize from '../hooks/use-screen-size'
import FooterMain from '../components/home/footer-main'
import Section from '../components/Section'
import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble'
import CyclingLogo from '../components/home/cycling-logo'
import Navbar from '@/components/home/navbar'

export default function Home() {
  const navigate = useNavigate()
  const screenSize = useScreenSize()
  const browserName = useDetectBrowser()
  const isSafari = browserName === "Safari"

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

      {/* HERO - pantalla completa con video de fondo + ImageTrail + contenido encima */}
      <Section
        variant="hero"
        containerized={false}
        className="relative overflow-hidden items-stretch"
      >
        {/* Capa de background: BubbleBackground debajo del ImageTrail */}
        {/*
        <div className="absolute inset-0 z-0">
          <BubbleBackground
            interactive
            className="absolute inset-0 flex items-center justify-center"
          />
        </div>
        */}

        {/* Capa de background: video en loop debajo del ImageTrail */}
        {/*
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover grayscale"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          >
            <source
              src="https://res.cloudinary.com/dsy30p7gf/video/upload/v1769766231/img-7_nfkocz.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        */}



        {/* Capa de background: ImageTrail ocupa toda la sección */}
        <div className="absolute inset-0 z-10">
          <ImageTrail />
        </div>

        {/* Capa de contenido: tipografía + CyclingLogo, siguiendo patrón del footer */}
        <div className="relative z-20 flex flex-col items-center justify-center gap-20 w-full h-full pointer-events-none">
          <p className="font-bizud-mincho-bold text-base sm:text-lg md:text-xl tracking-wide mb-2">
            not revolutionary
          </p>

          <CyclingLogo
            logos={[
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903352/4_wxvxkj.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903351/3_yni4c2.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903330/0_b471dn.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903331/2_gnhbhj.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903330/1_riof7w.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903329/11_gjupa0.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903329/12_nizkdg.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903329/13_z6rhv6.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903328/10_cgfww1.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903328/8_lvrwmb.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903328/9_ntwap1.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903327/7_pi1uzh.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903327/5_nmjyqc.svg",
              "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903327/6_hi73sd.svg",
            ]}
            width="50vw"
            height="10vw"
            cycleDuration={0.2}
          />

          <p className="font-bizud-mincho-bold text-base sm:text-lg md:text-xl tracking-wide mt-2">
            but evolutionary
          </p>
        </div>
      </Section>

      {/* Sección con texto declarativo y PixelTrail de fondo */}
      <Section
        variant="large"
        containerized={false}
        className="items-stretch justify-start"
      >
        <div className="relative w-full h-full overflow-hidden bg-neutral-800">

          
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

          {/* Texto declarativo por encima */}
          <div className="relative z-10 px-20 h-full flex items-start pt-8 pointer-events-none">
            <p className="font-bizud-mincho text-neutral-200 -ml-23 text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-tight pointer-events-none">
              SPORA is a collaborative platform where words becomes generative art. Each piece forms a unique flora whose shape is defined by its sentiment, rhythm, and structural patterns, and can grow new derivative branches while preserving its core identity through a shared soil.
            </p>
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
        variant="medium"
        containerized={false}
        className="bg-neutral-800 items-stretch"
      >
        <VideoTextSection />
      </Section>

      {/* Sección con marquee y header personalizado */}
      <Section variant="compact" containerized={false}>
        <div className="w-full h-full flex flex-col">
          {/* Header personalizado - se renderiza fuera del componente */}
          <div className="flex justify-between items-center px-6 md:px-12 lg:px-16 py-4 mt-8">
            <h2 className="text-xl sm:text-lg md:text-2x1 underline font-jetbrains-mono">
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
        className="items-stretch justify-start"
      >
        <div className="relative w-full h-full overflow-hidden bg-neutral-800">
          {/* Bubble Background artístico */}

          {/* Texto declarativo y botón alineados con el grid principal */}
          <div className="relative z-10 h-full flex flex-col items-end justify-start">
            
            <p className="font-bizud-mincho text-neutral-200 -mr-3 max-w-6xl flex text-right text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl leading-tight pointer-events-none">
              "Lloro porque no siento nada, y ahora además de triste me siento un farsante"
            </p>

            {/* Main Button debajo del texto */}
            <div className="mt-12 pointer-events-auto pt-8 px-6 md:px-12 lg:px-16">
              <MainButton
                variant="navbar"
                size="sm"
                type="button"
                onClick={() => navigate('/laboratory')}
              >
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
              className="absolute inset-0 flex items-center justify-center"
            />

        <div className="relative z-10">
          <FooterMain />
        </div>
      </Section>


    </div>
  )
}
