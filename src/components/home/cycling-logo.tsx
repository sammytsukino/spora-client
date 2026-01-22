interface CyclingLogoProps {
  logos: string[]
  width?: number | string
  height?: number | string
  cycleDuration?: number
  visiblePercentage?: number
  className?: string
}

export default function CyclingLogo({
  logos,
  width = 400,
  height = 120,
  cycleDuration = 0.75,
  visiblePercentage,
  className = "",
}: CyclingLogoProps) {
  const logoCount = logos.length
  
  const calculatedVisiblePercentage = visiblePercentage || (100 / logoCount)
  const visibleEnd = calculatedVisiblePercentage - 0.01
  const totalDuration = cycleDuration * logoCount

  const widthValue = typeof width === 'number' ? `${width}px` : width
  const heightValue = typeof height === 'number' ? `${height}px` : height

  return (
    <div 
      className={`relative ${className}`}
      style={{
        width: widthValue,
        height: heightValue,
      }}
    >
      {logos.map((logo, index) => {
        const delay = -(cycleDuration * index)
        
        return (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            className={`logo-cycling logo-${index + 1}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: widthValue,
              height: heightValue,
              opacity: 0,
              objectFit: "contain",
              animation: `brutalCycle-${logoCount} ${totalDuration}s step-end infinite`,
              animationDelay: `${delay}s`,
              pointerEvents: "none",
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
