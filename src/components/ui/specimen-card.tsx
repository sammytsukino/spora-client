import React from 'react'

// =============================================================================
// VISUAL TYPES - Different generative visuals for specimens
// =============================================================================
type VisualType = 'circles' | 'cross' | 'grid' | 'diamond' | 'spiral' | 'waves'

interface SpecimenCardProps {
  id: string
  gen: string
  title: string
  seed: string
  visualType?: VisualType
  bgColor?: 'default' | 'black' | 'acid'
  className?: string
}

// Generative Visual Components
const CirclesVisual = () => (
  <div className="w-24 h-24 border border-black rounded-full relative flex items-center justify-center">
    <div className="absolute inset-0 border border-black rounded-full m-3" />
    <div 
      className="absolute inset-0 border border-black rounded-full m-6" 
      style={{ background: 'var(--c-acid)' }} 
    />
  </div>
)

const CrossVisual = () => (
  <svg width="60" height="60" viewBox="0 0 100 100" className="stroke-current fill-none" strokeWidth="2">
    <path d="M50 10 Q 90 50 50 90 Q 10 50 50 10" />
    <path d="M50 10 L 50 90" />
    <path d="M10 50 L 90 50" />
  </svg>
)

const GridVisual = () => (
  <div className="grid grid-cols-4 gap-2">
    {Array.from({ length: 16 }).map((_, i) => (
      <div 
        key={i} 
        className="w-3 h-3 bg-current" 
        style={{ opacity: Math.random() > 0.3 ? 1 : 0.3 }}
      />
    ))}
  </div>
)

const DiamondVisual = () => (
  <div className="w-20 h-20 border-2 border-current rotate-45" />
)

const SpiralVisual = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" className="stroke-current fill-none" strokeWidth="1.5">
    <path d="M50 50 m0,-40 a40,40 0 1,1 0,80 a35,35 0 1,1 0,-70 a30,30 0 1,1 0,60 a25,25 0 1,1 0,-50 a20,20 0 1,1 0,40 a15,15 0 1,1 0,-30" />
  </svg>
)

const WavesVisual = () => (
  <svg width="80" height="60" viewBox="0 0 100 60" className="stroke-current fill-none" strokeWidth="2">
    <path d="M0 15 Q25 5 50 15 T100 15" />
    <path d="M0 30 Q25 20 50 30 T100 30" />
    <path d="M0 45 Q25 35 50 45 T100 45" />
  </svg>
)

const visualComponents: Record<VisualType, React.FC> = {
  circles: CirclesVisual,
  cross: CrossVisual,
  grid: GridVisual,
  diamond: DiamondVisual,
  spiral: SpiralVisual,
  waves: WavesVisual,
}

// =============================================================================
// SPECIMEN CARD COMPONENT
// =============================================================================
export default function SpecimenCard({
  id,
  gen,
  title,
  seed,
  visualType = 'circles',
  bgColor = 'default',
  className = '',
}: SpecimenCardProps) {
  const VisualComponent = visualComponents[visualType]
  
  const bgStyles: Record<string, { bg: string; text: string }> = {
    default: { bg: '#eee', text: 'text-black' },
    black: { bg: 'black', text: 'text-white' },
    acid: { bg: 'var(--c-acid)', text: 'text-black' },
  }
  
  const { bg, text } = bgStyles[bgColor]

  return (
    <div
      className={`bg-white p-4 flex flex-col group hover:-translate-y-2 transition-transform duration-300 cursor-pointer ${className}`}
      style={{ 
        width: '300px', 
        height: '400px', 
        border: 'var(--grid-line)',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div className="flex justify-between text-[10px] mb-2 font-tech">
        <span>{id}</span>
        <span>{gen}</span>
      </div>
      
      {/* Visual Area */}
      <div
        className={`flex-1 mb-4 flex items-center justify-center relative overflow-hidden ${text}`}
        style={{ background: bg }}
      >
        <div className="transition-transform duration-500 group-hover:scale-110">
          <VisualComponent />
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-auto">
        <h4 className="font-bold text-lg font-display">{title}</h4>
        <p className="text-xs text-gray-500 font-tech">Seed: "{seed}"</p>
      </div>
    </div>
  )
}

// =============================================================================
// SPECIMEN CARD WITH IMAGE (for real flora images)
// =============================================================================
interface SpecimenCardImageProps {
  id: string
  gen?: string
  title: string
  seed: string
  image: string
  className?: string
}

export function SpecimenCardImage({
  id,
  gen = 'GEN_0',
  title,
  seed,
  image,
  className = '',
}: SpecimenCardImageProps) {
  return (
    <div
      className={`bg-white p-4 flex flex-col group hover:-translate-y-2 transition-transform duration-300 cursor-pointer ${className}`}
      style={{ 
        width: '300px', 
        height: '400px', 
        border: 'var(--grid-line)',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div className="flex justify-between text-[10px] mb-2 font-tech">
        <span>{id}</span>
        <span>{gen}</span>
      </div>
      
      {/* Image Area */}
      <div className="flex-1 mb-4 relative overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 font-tech text-[10px] border border-black opacity-0 group-hover:opacity-100 transition-opacity">
          ID: {id}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-auto">
        <h4 className="font-bold text-lg font-display">{title}</h4>
        <p className="text-xs text-gray-500 font-tech">Seed: "{seed}"</p>
      </div>
    </div>
  )
}
