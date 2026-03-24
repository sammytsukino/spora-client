import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { isLabFullAccessible } from "@/lib/auth"
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
        navigate(ROUTES.GARDEN)
        break
      case "GREENHOUSE":
        navigate(ROUTES.GREENHOUSE)
        break
      case "LABORATORY":
        navigate(isLabFullAccessible() ? ROUTES.LABORATORY_FULL : ROUTES.LABORATORY)
        break
      default:
        break
    }
  }

  return (
    <div
      className={cn(
        "relative z-10 flex flex-col md:absolute md:left-0 md:top-0 md:flex-row items-start gap-4 sm:gap-5 md:gap-10 lg:gap-12 px-6 sm:px-8 md:px-12 py-8 sm:py-9 md:py-0 md:pt-16 md:pb-0 w-full md:w-auto box-border",
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
          <p className="font-supply-mono text-xs md:text-sm lg:text-sm text-spora-primary">
            ({item.number}) {item.title}
          </p>
          <p className="font-bizud-mincho-bold text-3xl md:text-4xl lg:text-5xl text-spora-primary leading-tight hover:underline [overflow-wrap:break-word]">
            {item.description}
          </p>
        </button>
      ))}
    </div>
  )
}
