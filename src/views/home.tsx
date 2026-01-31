import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import '../index.css'
import useScreenSize from '../hooks/use-screen-size'
import SpecimenCard from '../components/ui/specimen-card'
import WebGLCanvas from '../components/ui/WebGLCanvas'

// =============================================================================
// DESIGN TOKENS
// =============================================================================
const TRAIL_IMAGES = [
  'https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-22_akcm8r.png',
  'https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-21_dzwlna.png',
  'https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-20_fww5yp.png',
  'https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-19_haco8y.png',
]

const LOGO_VARIANTS = ['SPORA', 'S-P-O', 'FLORA', 'SP0RA', '/////', 'SPO.RA']

// =============================================================================
// MICRO COMPONENTS
// =============================================================================
const HUDTarget = () => (
  <div className="w-6 h-6 border border-black rounded-full relative grid place-items-center">
    <div className="absolute w-full h-[1px] bg-black" />
    <div className="absolute h-full w-[1px] bg-black" />
  </div>
)

const HUDCorner = ({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) => {
  const styles: Record<string, React.CSSProperties> = {
    tl: { top: 24, left: 24, borderRight: 0, borderBottom: 0 },
    tr: { top: 24, right: 24, borderLeft: 0, borderBottom: 0 },
    bl: { bottom: 24, left: 24, borderRight: 0, borderTop: 0 },
    br: { bottom: 24, right: 24, borderLeft: 0, borderTop: 0 },
  }
  return (
    <div
      className="absolute w-5 h-5 border-2 border-black z-30"
      style={styles[position]}
    />
  )
}

const AcidButton = ({ 
  children, 
  onClick 
}: { 
  children: React.ReactNode
  onClick?: () => void 
}) => (
  <button
    onClick={onClick}
    className="px-8 py-4 bg-[#D9FF00] text-black font-bold uppercase tracking-wider 
               hover:bg-white transition-colors flex items-center gap-2 font-tech text-sm
               border border-black hover:shadow-[4px_4px_0_#0A0A0A] hover:-translate-x-1 hover:-translate-y-1
               transition-all duration-200"
  >
    {children}
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </button>
)

// =============================================================================
// HEADER COMPONENT
// =============================================================================
const Header = () => {
  const navigate = useNavigate()
  
  return (
    <header className="h-[60px] grid grid-cols-[1fr_auto_1fr] items-center px-6 border-b-grid sticky top-0 z-50 bg-[#D8D8D8]">
      <div 
        className="flex items-center gap-3 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <HUDTarget />
        <span className="font-bold text-sm tracking-tighter leading-tight font-display">
          SPORA<br />SYSTEMS
        </span>
      </div>
      <div className="h-full w-[1px] bg-black" />
      <div className="font-tech font-bold text-xl text-right tracking-tighter">GEN/01</div>
    </header>
  )
}

// =============================================================================
// HERO SECTION (editorial, 3 divisiones)
// =============================================================================
const HeroSection = () => {
  return (
    <section className="h-[calc(100vh-60px)] border-b-grid grid grid-rows-[auto_auto_1fr]">
      {/* Top: Título y subtítulo */}
      <div className="max-w-[1600px] mx-auto border-x border-[#0A0A0A] w-full px-8 md:px-24 py-12 border-b-grid">
        <h1 className="font-display font-black text-[clamp(3rem,8vw,10rem)] leading-[0.85] tracking-tighter uppercase mb-4">INFINITE<br />VELOCITY</h1>
        <p className="font-serif italic text-2xl md:text-4xl text-[#0A0A0A]/70">not revolutionary, but evolutionary</p>
      </div>
      {/* Middle: Descripción y detalles */}
      <div className="max-w-[1600px] mx-auto border-x border-[#0A0A0A] w-full grid grid-cols-12 border-b-grid">
        <div className="col-span-12 md:col-span-8 border-r-grid py-8 md:py-16 px-8 md:px-16">
          <p className="font-tech text-lg md:text-2xl max-w-[30ch]">SPORA is a generative design engine capable of producing thousands of unique digital specimens per minute. One scroll. Unlimited output.</p>
        </div>
        <div className="col-span-12 md:col-span-4 p-8 md:p-16 flex items-end justify-end pb-0 md:pb-0">
          <span className="font-mono text-base md:text-lg tracking-tight">SYS. VER 4.0.2</span>
        </div>
      </div>
      {/* Bottom: Render/Canvas (ocupa todo el espacio restante) */}
      <div className="max-w-[1600px] mx-auto border-x border-[#0A0A0A] w-full relative bg-[#f0f0f0] overflow-hidden p-0 m-0 flex h-full min-h-[220px]">
        <WebGLCanvas />
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          <span className="inline-flex items-center justify-center bg-black text-white rounded-full w-6 h-6 text-xs font-bold mr-2">●</span>
          <span className="font-tech text-xs">RENDERING INSTANCE CLOUD</span>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// MANIFESTO SECTION
// =============================================================================
const ManifestoSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Array<{ x: number; y: number; size: number; life: number; color: string }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth
        canvas.height = canvas.parentElement.offsetHeight
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = pixelsRef.current.length - 1; i >= 0; i--) {
        const p = pixelsRef.current[i]
        p.life -= 0.02
        p.size *= 0.95

        if (p.life <= 0) {
          pixelsRef.current.splice(i, 1)
        } else {
          ctx.fillStyle = p.color
          ctx.globalAlpha = p.life
          ctx.beginPath()
          ctx.rect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      requestAnimationFrame(animate)
    }
    animate()

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    for (let i = 0; i < 3; i++) {
      pixelsRef.current.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        size: Math.random() * 40 + 20,
        life: 1,
        color: `hsl(${Math.random() * 60 + 60}, 100%, 50%)`
      })
    }
  }

  return (
    <section className="min-h-screen bg-[#0A0A0A] text-[#D8D8D8] relative overflow-hidden border-b-grid">
      {/* Gooey SVG Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </svg>

      {/* Interactive Canvas */}
      <div className="gooey-container" onMouseMove={handleMouseMove}>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-24 md:p-32 max-w-[90vw]">
        <div className="font-tech text-acid mb-4 text-sm">[MANIFESTO_V1.0]</div>
        <h2 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase leading-[0.85] tracking-tighter font-display">
          We translate<br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>
            Language
          </span>{' '}into<br />
          Algorithmic<br />
          <span className="text-acid">Biology.</span>
        </h2>
        <div className="mt-12 max-w-xl font-tech text-sm leading-relaxed text-gray-400">
          Spora is not an AI image generator. It is a procedural growth engine that interprets semantic
          meaning as DNA for digital flora. Every word creates a unique seed.
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// MARQUEE SECTION
// =============================================================================
const MarqueeSection = () => {
  const [scrollOffset, setScrollOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      setScrollOffset(scrollPercent * 40)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="h-[60vh] relative border-b-grid overflow-hidden bg-[#D8D8D8] flex items-center justify-center">
      {/* HUD Label */}
      <div className="absolute top-6 left-6 font-tech text-xs uppercase z-20">
        Path_Animation<br />
        Scroll_Linked
      </div>

      {/* SVG Curved Text */}
      <svg viewBox="0 0 1400 400" className="w-full h-full">
        <path
          id="curve-path"
          d="M0,200 C300,50 600,350 1400,200"
          fill="transparent"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />
        <text>
          <textPath
            href="#curve-path"
            startOffset={`${scrollOffset}%`}
            className="font-black uppercase tracking-tighter fill-black font-display"
            style={{ fontSize: '80px' }}
          >
            Generative • Organic • Synthesis • Digital • Nature • Procedural • Growth • Infinite •
            Species • Generative • Organic • Synthesis • Digital • Nature • Procedural • Growth •
          </textPath>
        </text>
      </svg>

      {/* Quote */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center max-w-md z-20">
        <p className="font-serif italic text-xl">
          "Nature does not hurry, yet everything is accomplished."
        </p>
        <div className="h-8 w-[1px] bg-black mx-auto mt-4" />
      </div>
    </section>
  )
}

// =============================================================================
// DICTIONARY SECTION
// =============================================================================
const DictionarySection = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen border-b-grid">
      {/* Left: Visual */}
      <div className="relative border-b-grid lg:border-b-0 lg:border-r-grid bg-black overflow-hidden group min-h-[50vh]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-700"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-22_akcm8r.png')"
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full border border-white/20 animate-spin-slow flex items-center justify-center backdrop-blur-sm">
            <div className="w-2 h-2 bg-acid rounded-full" />
          </div>
        </div>

        <div className="absolute top-6 left-6 text-white font-tech text-xs">
          FIG. 04-A<br />
          GENUS: POLYGON
        </div>
        <div className="absolute bottom-6 right-6 text-acid font-tech text-xs text-right">
          RENDER_TIME: 14ms<br />
          SEED: #9F2A
        </div>
      </div>

      {/* Right: Definitions */}
      <div className="p-8 md:p-16 flex flex-col justify-center bg-[#D8D8D8]">
        <div className="mb-12">
          <h3 className="font-serif text-6xl md:text-7xl mb-2 italic">flora</h3>
          <div className="flex items-center gap-4 text-gray-500 font-tech text-sm">
            <span>/ˈflɔːrə/</span>
            <span className="bg-black text-white px-2 py-0.5">NOUN</span>
          </div>
        </div>

        <div className="space-y-8 font-serif text-xl border-l-2 border-black pl-8">
          <div className="group">
            <span className="font-tech text-xs text-gray-500 block mb-1">1. BOTANICAL</span>
            <p className="group-hover:text-acid group-hover:bg-black transition-colors inline px-1">
              The plants of a particular region, habitat, or geological period.
            </p>
          </div>

          <div className="group">
            <span className="font-tech text-xs text-gray-500 block mb-1">2. CATALOG</span>
            <p className="group-hover:text-acid group-hover:bg-black transition-colors inline px-1">
              A treatise on or list of the plant life of a particular area or period.
            </p>
          </div>

          <div className="group bg-[#D9FF00] -ml-8 pl-8 py-4 pr-4">
            <span className="font-tech text-xs text-black block mb-1">3. SPORA DEF.</span>
            <p className="font-bold text-black">
              A digital entity born from text, possessing unique genetic traits determined by semantic
              analysis of input strings.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// WORKS MARQUEE SECTION
// =============================================================================
const WorksSection = () => {
  const navigate = useNavigate()
  
  const specimens = [
    { id: 'A832', gen: '001', title: 'Helix Primordial', seed: '#A832F1', visualType: 'circles' as const, bgColor: 'acid' as const },
    { id: 'C2F4', gen: '002', title: 'Vertex Cascade', seed: '#C2F4D8', visualType: 'cross' as const, bgColor: 'black' as const },
    { id: '890B', gen: '003', title: 'Neural Bloom', seed: '#890B23', visualType: 'grid' as const, bgColor: 'default' as const },
    { id: 'D088', gen: '004', title: 'Spore Matrix', seed: '#D088FF', visualType: 'diamond' as const, bgColor: 'acid' as const },
    { id: '42FD', gen: '005', title: 'Fractal Seed', seed: '#42FD9A', visualType: 'spiral' as const, bgColor: 'black' as const },
    { id: 'E7A1', gen: '006', title: 'Mycelium Web', seed: '#E7A1C3', visualType: 'waves' as const, bgColor: 'default' as const },
  ]

  return (
    <section className="border-b-grid">
      {/* Header */}
      <div className="py-6 border-b-grid">
        <div className="px-6 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-acid rounded-full border border-black" />
              <span className="font-tech text-xs">RECENT_GENERATIONS</span>
            </div>
            <h3 className="text-3xl font-bold uppercase tracking-tight font-display">Specimen Archive</h3>
          </div>
          <button
            onClick={() => navigate('/garden')}
            className="font-tech text-xs hover:bg-black hover:text-white px-3 py-1 border border-black transition-colors"
          >
            VIEW_ALL →
          </button>
        </div>
      </div>

      {/* Marquee */}
      <div className="py-12 overflow-hidden bg-[#D8D8D8] border-b-grid">
        <div className="flex gap-6 animate-marquee" style={{ width: 'max-content' }}>
          {[...specimens, ...specimens].map((item, idx) => (
            <SpecimenCard
              key={idx}
              id={item.id}
              gen={item.gen}
              title={item.title}
              seed={item.seed}
              visualType={item.visualType}
              bgColor={item.bgColor}
            />
          ))}
        </div>
      </div>

      {/* CTA + Quote Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[50vh]">
        {/* CTA Box */}
        <div className="bg-black text-white p-12 md:p-20 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-acid blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
          <h4 className="font-tech text-acid text-xs mb-8">LABORATORY_ACCESS</h4>
          <p className="text-4xl font-bold leading-tight mb-8 font-display">
            Begin the synthesis process. Convert your thoughts into biological algorithms.
          </p>
          <AcidButton onClick={() => navigate('/laboratory')}>
            Enter Laboratory
          </AcidButton>
        </div>

        {/* Quote Box */}
        <div className="p-12 md:p-20 flex flex-col justify-center items-end text-right bg-white relative">
          <div className="absolute top-6 left-6 font-tech text-xs opacity-50">QUOTATION</div>
          <blockquote className="font-serif text-4xl md:text-5xl italic leading-tight mb-6">
            "La naturaleza no es un lugar para visitar. Es el hogar."
          </blockquote>
          <cite className="not-italic font-bold tracking-widest text-sm uppercase font-tech">— Gary Snyder</cite>
        </div>
      </div>
    </section>
  )
}

// =============================================================================
// FOOTER SECTION
// =============================================================================
const FooterSection = () => {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubblesRef = useRef<Array<{ x: number; y: number; r: number; vx: number; vy: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    setTimeout(resizeCanvas, 100)
    window.addEventListener('resize', resizeCanvas)

    // Initialize bubbles
    for (let i = 0; i < 20; i++) {
      bubblesRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * 400,
        r: Math.random() * 50 + 20,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1
      })
    }

    const animate = () => {
      if (!canvas.width) {
        requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#D9FF00'

      bubblesRef.current.forEach(b => {
        b.x += b.vx
        b.y += b.vy
        b.vx *= 0.99
        b.vy *= 0.99

        if (b.x < 0 || b.x > canvas.width) b.vx *= -1
        if (b.y < 0 || b.y > canvas.height) b.vy *= -1

        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      })
      requestAnimationFrame(animate)
    }
    animate()

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const footer = e.currentTarget
    const rect = footer.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    bubblesRef.current.forEach(b => {
      const dx = mouseX - b.x
      const dy = mouseY - b.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 150) {
        const angle = Math.atan2(dy, dx)
        b.vx -= Math.cos(angle) * 0.5
        b.vy -= Math.sin(angle) * 0.5
      }
    })
  }

  return (
    <footer className="relative bg-[#D8D8D8] text-black border-t-grid overflow-hidden" onMouseMove={handleMouseMove}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 min-h-[400px]">
        {/* Brand */}
        <div className="p-8 md:p-12 border-b-grid md:border-b-0 md:border-r-grid flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-black text-acid rounded-full flex items-center justify-center font-bold text-2xl mb-6">
              S
            </div>
            <h2 className="text-4xl font-black tracking-tighter font-display">
              SPORA<br />SYSTEMS
            </h2>
          </div>
          <div className="font-tech text-xs opacity-60 mt-12">
            EST. 2024<br />
            TOKYO — BERLIN
          </div>
        </div>

        {/* Navigation */}
        <div className="p-8 md:p-12 border-b-grid md:border-b-0 md:border-r-grid">
          <h5 className="font-bold mb-6 text-sm uppercase">Navigation</h5>
          <ul className="space-y-4 font-tech text-sm">
            {[
              { label: 'INDEX', path: '/' },
              { label: 'LABORATORY', path: '/laboratory' },
              { label: 'GARDEN', path: '/garden' },
              { label: 'GREENHOUSE', path: '/greenhouse' },
            ].map(item => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className="hover:text-acid hover:bg-black px-1 transition-colors block w-fit"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div className="p-8 md:p-12 border-b-grid md:border-b-0 md:border-r-grid">
          <h5 className="font-bold mb-6 text-sm uppercase">Info</h5>
          <ul className="space-y-4 font-tech text-sm">
            {[
              { label: 'TEAM', path: '/team' },
              { label: 'RESEARCH', path: '/research' },
              { label: 'CONTACT', path: '/contact' },
            ].map(item => (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className="hover:text-acid hover:bg-black px-1 transition-colors block w-fit"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Tagline */}
        <div className="p-8 md:p-12 flex flex-col justify-end">
          <div className="font-serif italic text-2xl md:text-3xl text-right leading-tight">
            not revolutionary<br />
            but evolutionary
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-grid p-4 flex justify-between items-center bg-black text-white text-xs font-tech">
        <div>© 2026 SPORA SYSTEMS INC.</div>
        <div className="flex gap-4">
          <span>STATUS: ONLINE</span>
          <span className="text-acid animate-blink">●</span>
        </div>
      </div>
    </footer>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function Home() {
  const screenSize = useScreenSize()

  useEffect(() => {
    document.body.classList.add('hide-scrollbar')
    document.documentElement.classList.add('hide-scrollbar')

    return () => {
      document.body.classList.remove('hide-scrollbar')
      document.documentElement.classList.remove('hide-scrollbar')
    }
  }, [])

  return (
    <div style={{ 
      '--c-concrete': '#D8D8D8',
      '--c-acid': '#D9FF00',
      '--c-black': '#0A0A0A',
    } as React.CSSProperties}>
      {/* Main Container with Editorial Max Width */}
      <div className="max-w-[1600px] mx-auto border-x border-[#0A0A0A] bg-[#D8D8D8] relative z-10">
        <Header />
        <HeroSection />
        <ManifestoSection />
        <MarqueeSection />
        <DictionarySection />
        <WorksSection />
        <FooterSection />
      </div>
    </div>
  )
}
