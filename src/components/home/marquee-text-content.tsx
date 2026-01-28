import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()

  const handleClick = (item: (typeof textItems)[number]) => {
    switch (item.title) {
      case "GARDEN":
        navigate("/garden")
        break
      case "GREENHOUSE":
        navigate("/greenhouse")
        break
      case "LABORATORY":
        navigate("/laboratory")
        break
      default:
        break
    }
  }

  return (
    <div
      className={cn(
        "absolute left-0 top-0 flex flex-row items-start gap-8 md:gap-10 lg:gap-12 pl-6 md:pl-12 pt-12 md:pt-16 z-10 w-auto",
        className
      )}
    >
      {textItems.map((item, index) => (
        <button
          key={index}
          type="button"
          className="flex flex-col w-[18%] text-left cursor-pointer"
          onClick={() => handleClick(item)}
        >
          <p className="font-jetbrains-mono text-xs md:text-sm lg:text-sm text-neutral-800 mb-2 hover:underline">
            ({item.number}) {item.title}
          </p>
          <p className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl text-neutral-700 leading-tight hover:underline">
            {item.description}
          </p>
        </button>
      ))}
    </div>
  )
}
