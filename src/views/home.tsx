import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../index.css'
import Navbar from '../components/home/navbar'
import MarqueeAlongSvgPath from '../components/home/marquee-along-svg-path'
import ImageTrail from '../components/home/image-trail'
import VideoTextSection from '../components/home/video-text-section'

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



      {/* Ejemplo: Sección grande (150vh) */}
      <section className="component-section-large">
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-800 font-jetbrains-mono">Sección grande (150vh)</p>
        </div>
      </section>

      {/* Ejemplo: Sección extra grande (200vh) */}
      <section className="component-section-xlarge">
        <div className="flex items-center justify-center h-full">
          <p className="text-neutral-800 font-jetbrains-mono">Sección extra grande (200vh)</p>
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
