type SpecimenItem = {
  id: string
  image: string
}

interface SpecimenMarqueeProps {
  items: SpecimenItem[]
  className?: string
}

export default function SpecimenMarquee({ items, className = "" }: SpecimenMarqueeProps) {
  const duplicatedItems = [...items, ...items]

  return (
    <div className={`specimen-marquee ${className}`.trim()}>
      <div className="specimen-marquee-track">
        {duplicatedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 w-[260px] sm:w-[280px] aspect-[3/4] bg-[var(--spora-secondary)] border-2 border-[var(--spora-primary)] p-2 relative group/item hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="h-full w-full bg-[var(--spora-primary-light)] overflow-hidden relative border-2 border-[var(--spora-primary)]">
              <img
                src={item.image}
                alt={`Specimen ${item.id}`}
                className="w-full h-full object-cover filter grayscale group-hover/item:grayscale-0 transition-all duration-500"
              />
              <div className="absolute bottom-2 left-2 bg-[var(--spora-primary)] px-2 py-1 font-supply-mono text-[10px] uppercase tracking-[0.2em] border-2 border-[var(--spora-primary)]">
                ID: {item.id}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
