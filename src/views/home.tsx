import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../index.css'
import MarqueeAlongSvgPath from '../components/home/marquee-along-svg-path'
import VideoTextSection from '../components/home/video-text-section'
import SimpleMarquee from '../components/home/simple-marquee'
import MainButton from '../components/ui/main-button'
import PixelTrail from '../components/home/pixel-trail'
import GooeySvgFilter from '../components/home/gooey-svg-filter'
import useDetectBrowser from '../hooks/use-detect-browser'
import useScreenSize from '../hooks/use-screen-size'
import FooterMain from '../components/home/footer-main'
import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble'
import Navbar from '@/components/home/navbar'
import WebGLCanvas from '../components/home/webgl-canvas'


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

      {/* HERO SECTION (editorial, 3 divisiones) */}
      <section className="w-full h-[calc(100vh-60px)] mt-[60px] border-b border-[#0A0A0A] grid grid-rows-[auto_auto_1fr]">
        {/* Top: Título y subtítulo */}
        <div className="border-x border-[#0A0A0A] w-full px-8 md:px-24 py-12 border-b border-[#0A0A0A]">
          <h1 className="font-jetbrains-mono font-black text-[clamp(3rem,8vw,10rem)] leading-[0.85] tracking-tighter uppercase mb-4">
            INFINITE<br />VELOCITY
          </h1>
          <p className="font-bizud-mincho italic text-2xl md:text-4xl text-[#0A0A0A]/70">
            not revolutionary, but evolutionary
          </p>
        </div>
        
        {/* Middle: Descripción y detalles */}
        <div className="border-x border-[#0A0A0A] w-full grid grid-cols-12 border-b border-[#0A0A0A]">
          <div className="col-span-12 md:col-span-8 border-r border-[#0A0A0A] py-8 md:py-16 px-8 md:px-16">
            <p className="font-jetbrains-mono text-lg md:text-2xl max-w-[30ch]">
              SPORA is a generative design engine capable of producing thousands of unique digital specimens per minute. One scroll. Unlimited output.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 p-8 md:p-16 flex items-end justify-end pb-0 md:pb-0">
            <span className="font-jetbrains-mono text-base md:text-lg tracking-tight">
              SYS. VER 4.0.2
            </span>
          </div>
        </div>
        
        {/* Bottom: Render/Canvas (ocupa todo el espacio restante) */}
        <div className="border-x border-[#0A0A0A] w-full relative bg-[#f0f0f0] overflow-hidden p-0 m-0 flex h-full min-h-[220px]">
          <WebGLCanvas />
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
            <span className="inline-flex items-center justify-center bg-black text-white rounded-full w-6 h-6 text-xs font-bold mr-2">
              ●
            </span>
            <span className="font-jetbrains-mono text-xs">RENDERING INSTANCE CLOUD</span>
          </div>
        </div>
      </section>

      {/* Sección con texto declarativo y PixelTrail de fondo */}
      <section className="relative w-full h-[90vh] flex items-stretch justify-start border-b border-[#0A0A0A]">
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
          <div className="relative z-10 px-8 md:px-20 h-full flex items-start pt-16 md:pt-24 pointer-events-none">
            <p className="font-bizud-mincho text-neutral-200 text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight pointer-events-none">
              SPORA is a collaborative platform where words becomes generative art. Each piece forms a unique flora whose shape is defined by its sentiment, rhythm, and structural patterns, and can grow new derivative branches while preserving its core identity through a shared soil.
            </p>
          </div>
        </div>
      </section>

      {/* Sección con marquee y texto a la izquierda */}
      <section className="relative w-full h-[70vh] flex items-stretch border-b border-[#0A0A0A]">
        <MarqueeAlongSvgPath showText={true} />
      </section>

      {/* Sección de video + texto */}
      <section className="relative w-full h-[70vh] bg-neutral-800 flex items-stretch border-b border-[#0A0A0A]">
        <VideoTextSection />
      </section>

      {/* Sección con marquee y header personalizado */}
      <section className="relative w-full h-[60vh] flex border-b border-[#0A0A0A]">
        <div className="w-full h-full flex flex-col">
          {/* Header personalizado */}
          <div className="flex justify-between items-center px-6 md:px-12 lg:px-16 py-4 mt-8 flex-shrink-0">
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

          {/* El marquee simple */}
          <div className="flex-1 overflow-hidden">
            <SimpleMarquee />
          </div>
        </div>
      </section>

      {/* Sección con quote + botón */}
      <section className="relative w-full h-[70vh] flex items-center justify-end border-b border-[#0A0A0A]">
        <div className="relative w-full h-full overflow-hidden bg-neutral-800 flex items-center justify-end">
          {/* Texto declarativo y botón */}
          <div className="relative z-10 flex flex-col items-end justify-center py-16 px-8 md:px-16 lg:px-24">
            <p className="font-bizud-mincho text-neutral-200 max-w-6xl text-right text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight pointer-events-none">
              "Lloro porque no siento nada, y ahora además de triste me siento un farsante"
            </p>

            {/* Main Button debajo del texto */}
            <div className="mt-12 pointer-events-auto">
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
      </section>

      {/* Footer principal con fondo Iridescence */}
      <section className="relative w-full h-auto flex overflow-hidden">
        <BubbleBackground
          interactive
          className="absolute inset-0 flex items-center justify-center"
        />

        <div className="relative z-10 w-full">
          <FooterMain />
        </div>
      </section>
    </div>
  )
}
