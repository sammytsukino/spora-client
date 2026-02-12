interface CyclingLogoProps {
  logos: string[]
  width?: number | string
  height?: number | string
  cycleDuration?: number
  pauseDuration?: number
  overlapDuration?: number
  visiblePercentage?: number
  className?: string
  aspectRatio?: number | string
  fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
}

export default function CyclingLogo({
  logos,
  width = 400,
  height = 120,
  cycleDuration = 0.75,
  pauseDuration = 0.02,
  overlapDuration = 0,
  visiblePercentage,
  className = "",
  aspectRatio,
  fit = 'fill',
}: CyclingLogoProps) {
  const logoCount = logos.length
  const perLogoDuration = cycleDuration
  const baseVisibleDuration = Math.max(cycleDuration - pauseDuration, 0)
  const totalDuration = perLogoDuration * logoCount
  const visibleDuration = Math.min(
    Math.max(baseVisibleDuration + overlapDuration, 0),
    totalDuration
  )
  const calculatedVisiblePercentage =
    visiblePercentage ?? (visibleDuration / totalDuration) * 100
  const visibleEnd = Math.max(calculatedVisiblePercentage - 0.01, 0)

  const widthValue = typeof width === 'number' ? `${width}px` : width
  const heightValue = typeof height === 'number' ? `${height}px` : height
  const containerHeightValue = heightValue === 'auto' ? 'auto' : heightValue
  const imageHeightValue = heightValue === 'auto' ? '100%' : heightValue
  const computedAspectRatio =
    aspectRatio ??
    (typeof width === 'number' && typeof height === 'number'
      ? `${width} / ${height}`
      : undefined)

  return (
    <div 
      className={`relative block ${className}`}
      style={{
        width: widthValue,
        height: containerHeightValue,
        aspectRatio: computedAspectRatio,
        minHeight: heightValue === '100%' ? undefined : undefined,
        lineHeight: 0,
      }}
    >
      {logos.map((logo, index) => {
        const delay = -(perLogoDuration * index)
        
        return (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            className={`logo-cycling logo-${index + 1} block`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: widthValue,
              height: imageHeightValue,
              opacity: 0,
              objectFit: fit,
              animation: `brutalCycle-${logoCount} ${totalDuration}s step-end infinite`,
              animationDelay: `${delay}s`,
              pointerEvents: "none",
              margin: 0,
              padding: 0,
            }}
          />
        )
      })}
      
      <style>{`
        @keyframes brutalCycle-${logoCount} {
          0%, ${visibleEnd}% {
            opacity: 1;
          }
          ${calculatedVisiblePercentage}%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
