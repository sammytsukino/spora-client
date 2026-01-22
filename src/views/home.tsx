import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '../index.css'
import Navbar from '../components/home/navbar'
import MarqueeAlongSvgPath from '../components/home/marquee-along-svg-path'
import ImageTrail from '../components/home/image-trail'
import TransparentNavbar from '../components/home/transparent-navbar'

export default function Home() {
  return (
    <div className="components-container">
      <Navbar />
      

      {/*<section className="component-section">
        <GooeySvgFilterPixelTrail />
      </section>*/}

      <section className="component-section">
        <ImageTrail />
      </section>

      <TransparentNavbar/>


      <section className="component-section">
        <MarqueeAlongSvgPath />
      </section>

      
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
