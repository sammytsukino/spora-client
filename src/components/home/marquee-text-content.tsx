import { cn } from "@/lib/utils"

interface MarqueeTextContentProps {
  /**
   * Clases CSS adicionales
   */
  className?: string
}

const textItems = [
  {
    number: "01",
    title: "GARDEN",
    description: "Open Floras ready to be cut",
  },
  {
    number: "02",
    title: "GREENHOUSE",
    description: "Discover timeless artworks",
  },
  {
    number: "03",
    title: "LABORATORY",
    description: "Create your own Floras",
  },
]

export default function MarqueeTextContent({
  className,
}: MarqueeTextContentProps) {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 flex flex-row items-start gap-8 md:gap-10 lg:gap-12 pl-6 md:pl-12 pt-12 md:pt-16 z-10 w-auto",
        className
      )}
    >
      {textItems.map((item, index) => (
        <div key={index} className="flex flex-col w-[18%]">
          <p className="font-jetbrains-mono text-xs md:text-sm lg:text-sm text-neutral-800 mb-2">
            ({item.number}) {item.title}
          </p>
          <p className="font-bizud-mincho text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-700 leading-tight">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  )
}
