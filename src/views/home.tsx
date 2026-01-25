import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../index.css'
import Navbar from '../components/home/navbar'
import MarqueeAlongSvgPath from '../components/home/marquee-along-svg-path'
import ImageTrail from '../components/home/image-trail'
import VideoTextSection from '../components/home/video-text-section'
import SimpleMarquee from '../components/home/simple-marquee'
import MainButton from '../components/ui/main-button'


export default function Home() {
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

      {/* Ejemplo: Sección mediana (75vh) */}
      <section className="component-section-medium">
        <div className="bg-neutral-800 flex items-center justify-center h-full">
          <p className="text-neutral-200 font-jetbrains-mono">SECCIÓN EN LA QUE IRÁ EL TEXTO DECLARATIVO SOBRE LA APP</p>
        </div>
      </section>

      {/* Sección con marquee y texto a la izquierda */}
      <section className="component-section-medium">
        <MarqueeAlongSvgPath showText={true} />
      </section>

      <section className="component-section">
        <VideoTextSection />
      </section>



      {/* Sección con marquee y header personalizado */}
      <section className="component-section-medium">
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
        <div className="bg-neutral-800 flex items-center justify-center h-full">
          <p className="text-neutral-200 font-jetbrains-mono">SECCIÓN EN LA QUE IRÁ UN EJEMPLO DE ARTWORK GENERADO POR LA APP</p>
        </div>
      </section>


    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
