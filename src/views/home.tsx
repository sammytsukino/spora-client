import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import '../index.css'
import useDetectBrowser from '../hooks/use-detect-browser'
import useScreenSize from '../hooks/use-screen-size'
import Navbar from '@/components/home/navbar'
import FooterMain from '../components/home/footer-main'

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

      {/* ========================================
          SECTION 1: HERO (Full Screen)
          - Interactive background effect
          - Large editorial typography
          - Brand statement
          ======================================== */}
      <section className="h-screen w-full flex items-center justify-center">
        {/* TODO: Hero content */}
      </section>

      {/* ========================================
          SECTION 2: MANIFESTO (Large)
          - Bold declarative text
          - Dark background
          - Interactive pixel/visual effect
          ======================================== */}
      <section className="min-h-screen w-full bg-neutral-800">
        {/* TODO: Manifesto content */}
      </section>

      {/* ========================================
          SECTION 3: VISUAL MARQUEE (Medium)
          - Animated text/elements
          - Scroll-aware movement
          ======================================== */}
      <section className="min-h-[60vh] w-full">
        {/* TODO: Marquee content */}
      </section>

      {/* ========================================
          SECTION 4: VIDEO + TEXT (Medium)
          - Split layout
          - Video showcase
          - Definition/explanation text
          ======================================== */}
      <section className="min-h-[60vh] w-full bg-neutral-800">
        {/* TODO: Video section content */}
      </section>

      {/* ========================================
          SECTION 5: FEATURED WORKS (Compact)
          - Gallery preview
          - CTA to full gallery
          ======================================== */}
      <section className="min-h-[40vh] w-full">
        {/* TODO: Featured works content */}
      </section>

      {/* ========================================
          SECTION 6: QUOTE + CTA (Medium)
          - Emotional quote
          - Call to action button
          ======================================== */}
      <section className="min-h-[60vh] w-full bg-neutral-800">
        {/* TODO: Quote and CTA content */}
      </section>

      {/* ========================================
          SECTION 7: FOOTER
          - Navigation
          - Brand closure
          ======================================== */}
      <footer className="w-full">
        <FooterMain />
      </footer>
    </div>
  )
}
