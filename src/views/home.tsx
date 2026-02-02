import { useNavigate } from 'react-router-dom'

import '../index.css'
import Navbar from '../components/home/navbar'
import MarqueeAlongSvgPath from '../components/home/marquee-along-svg-path'
import VideoTextSection from '../components/home/video-text-section'
import SimpleMarquee from '../components/home/simple-marquee'
import MainButton from '../components/ui/main-button'
import ImageTrail from '../components/home/image-trail'
import PixelTrail from '../components/home/pixel-trail'
import GooeySvgFilter from '../components/home/gooey-svg-filter'
import useDetectBrowser from '../hooks/use-detect-browser'
import useScreenSize from '../hooks/use-screen-size'
import FooterMain from '../components/home/footer-main'
import Section from '../components/Section'
import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble'
import CyclingLogo from '../components/home/cycling-logo'

export default function Home() {
  const navigate = useNavigate()
  const browserName = useDetectBrowser()
  const isSafari = browserName === 'Safari'
  const screenSize = useScreenSize()

  return (
    <div className="w-full overflow-x-hidden">
      <Navbar />

      <Section
        variant="hero"
        containerized={false}
        className="relative overflow-hidden items-stretch"
      >
        <div className="absolute inset-0">
          <ImageTrail />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-20 w-full h-full pointer-events-none">
          <p className="font-bizud-mincho-bold text-lg sm:text-xl md:text-2xl tracking-wide mb-2">
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

          <p className="font-bizud-mincho-bold text-lg sm:text-xl md:text-2xl tracking-wide mt-2">
            but evolutionary
          </p>
        </div>
      </Section>

      <Section
        variant="large"
        containerized={false}
        className="bg-neutral-800 items-stretch justify-start"
      >
        <div className="relative w-full h-full overflow-hidden">
          <GooeySvgFilter id="gooey-filter-declarative" strength={5} />

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

          <div className="relative z-10 px-20 h-full flex items-start pt-8 pointer-events-none">
            <p className="font-bizud-mincho text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight pointer-events-none text-neutral-200 -ml-23 -mr-23">
              SPORA is a collaborative platform where words becomes generative art. Each piece forms a unique flora whose shape is defined by its sentiment, rhythm, and structural patterns, and can grow new derivative branches while preserving its core identity through a shared soil.
            </p>
          </div>
        </div>
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
        className="bg-neutral-800 items-stretch justify-start"
      >
        <div className="relative w-full h-full overflow-hidden">
          <GooeySvgFilter id="gooey-filter-quote" strength={5} />

          <div
            className="absolute inset-0 z-0"
            style={{ filter: isSafari ? 'none' : 'url(#gooey-filter-quote)' }}
          >
            <PixelTrail
              pixelSize={screenSize.lessThan(`md`) ? 24 : 60}
              fadeDuration={0}
              delay={2000}
              pixelClassName="[background:radial-gradient(circle,#c6ff00_0%,#ff00f0_100%)]"
              className="w-full h-full"
            />
          </div>

          <div className="relative z-10 h-full flex flex-col items-end justify-start pt-8 px-4 sm:px-6 md:px-8">
            <p className="font-bizud-mincho max-w-6xl flex text-right text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl leading-tight pointer-events-none -mr-15 text-neutral-200 -ml-23 -mr-23">
              "Lloro porque no siento nada, y ahora además de triste me siento un farsante"
            </p>

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
      </Section>

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
