import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface MarqueeTextContentProps {
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
        "absolute left-0 top-0 flex flex-col md:flex-row items-start gap-4 sm:gap-5 md:gap-10 lg:gap-12 px-6 sm:px-8 md:px-12 pt-6 sm:pt-9 md:pt-16 z-10 w-full md:w-auto box-border",
        className
      )}
    >
      {textItems.map((item, index) => (
        <button
          key={index}
          type="button"
          className="flex flex-col w-full md:w-[18%] text-left cursor-pointer"
          onClick={() => handleClick(item)}
        >
          <p className="font-supply-mono text-xs md:text-sm lg:text-sm text-[#262626]">
            ({item.number}) {item.title}
          </p>
          <p className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl text-[#262626] leading-tight hover:underline break-words">
            {item.description}
          </p>
        </button>
      ))}
    </div>
  )
}
