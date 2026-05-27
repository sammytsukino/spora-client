import { useRef, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import FloraLink from "@/components/shared/FloraLink"
import { floraPath } from "@/constants/routes"
import { readerNavState } from "@/lib/floraViewBack"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"
import { getOptimizedThumbnailUrl } from "@/lib/cloudinary"
import { DEFAULT_MARQUEE_THUMBNAIL_URLS } from "@/data/flora-thumbnail-urls"
import type { FloraThumbnail } from "@/hooks/useFloraThumbnails"

type SpringOptions = {
  damping?: number
  stiffness?: number
}

const wrap = (min: number, max: number, value: number): number => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

interface SimpleMarqueeProps {
  items?: FloraThumbnail[]
  className?: string
  direction?: "left" | "right"
  baseVelocity?: number
  repeat?: number
  slowdownOnHover?: boolean
  slowDownFactor?: number
  slowDownSpringConfig?: SpringOptions
}

const MarqueeItem = ({ children }: { children: ReactNode }) => (
  <div className="mx-2 sm:mx-3 md:mx-4 hover:scale-105 cursor-pointer duration-300 ease-in-out">
    {children}
  </div>
)

const MarqueeRow = ({
  children,
  direction = "right",
  baseVelocity = 5,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },
  repeat = 3,
  className,
}: {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  baseVelocity?: number
  slowdownOnHover?: boolean
  slowDownFactor?: number
  slowDownSpringConfig?: SpringOptions
  repeat?: number
  className?: string
}) => {
  const baseX = useMotionValue(0)
  const baseY = useMotionValue(0)
  const hoverFactorValue = useMotionValue(1)
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig)
  const isHovered = useRef(false)

  const isHorizontal = direction === "left" || direction === "right"
  const actualBaseVelocity =
    direction === "left" || direction === "up" ? -baseVelocity : baseVelocity

  const x = useTransform(baseX, (offsetValue) => {
    const wrappedValue = wrap(0, -100, offsetValue)
    return `${wrappedValue}%`
  })
  const y = useTransform(baseY, (offsetValue) => {
    const wrappedValue = wrap(0, -100, offsetValue)
    return `${wrappedValue}%`
  })

  useAnimationFrame((_, delta) => {
    if (isHovered.current) {
      hoverFactorValue.set(slowdownOnHover ? slowDownFactor : 1)
    } else {
      hoverFactorValue.set(1)
    }

    const moveBy =
      actualBaseVelocity * (delta / 1000) * smoothHoverFactor.get()

    if (isHorizontal) {
      baseX.set(baseX.get() + moveBy)
    } else {
      baseY.set(baseY.get() + moveBy)
    }
  })

  return (
    <motion.div
      className={cn("flex", isHorizontal ? "flex-row" : "flex-col", className)}
      onHoverStart={() => (isHovered.current = true)}
      onHoverEnd={() => (isHovered.current = false)}
    >
      {Array.from({ length: repeat }, (_, repeatIndex) => repeatIndex).map((repeatIndex) => (
        <motion.div
          key={repeatIndex}
          className={cn("shrink-0", isHorizontal && "flex")}
          style={isHorizontal ? { x } : { y }}
          aria-hidden={repeatIndex > 0}
        >
          {children}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function SimpleMarquee({
  items: floraItems = [],
  className = "",
  direction = "right",
  baseVelocity = 4,
  repeat = 4,
  slowdownOnHover = true,
  slowDownFactor = 0.1,
  slowDownSpringConfig = { damping: 60, stiffness: 300 },
}: SimpleMarqueeProps) {
  const location = useLocation()
  const defaultImages = DEFAULT_MARQUEE_THUMBNAIL_URLS

  const itemsToUse: FloraThumbnail[] =
    floraItems.length > 0 ? floraItems : defaultImages.map((url) => ({ url: getOptimizedThumbnailUrl(url) }))
  const minItemsForFill = 45
  const expandedItems =
    itemsToUse.length >= minItemsForFill
      ? itemsToUse
      : Array.from({ length: minItemsForFill }, (_, i) => itemsToUse[i % itemsToUse.length])
  const displayItems = expandedItems.map((item, i) => (
    <MarqueeItem key={i}>
      {item.id ? (
        <FloraLink
          to={floraPath(item.id)}
          state={{
            ...readerNavState(location.pathname, location.search),
            ...(item.title !== undefined
              ? {
                  flora: {
                    id: item.id,
                    title: item.title ?? "",
                    author: item.author ?? "@Anonymous",
                    excerpt: item.excerpt ?? "",
                    seed: item.seed ?? `#${String(item.id).slice(-6).toUpperCase()}`,
                    generation: item.generation ?? "GEN_0",
                    image: item.url,
                  },
                }
              : {}),
          }}
          className="group relative block cursor-pointer"
          aria-label={`Open flora ${item.title ?? item.id}`}
        >
          <img
            src={item.url}
            alt={item.title ?? `Flora ${i + 1}`}
            className="h-20 w-32 sm:h-24 sm:w-40 md:h-32 md:w-48 object-cover"
          />
          <span
            className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none font-supply-mono text-[8px] sm:text-[9px] text-white uppercase tracking-wider px-1 text-center break-all"
            aria-hidden
          >
            {item.id?.startsWith("flr-") ? item.id : item.id?.slice(0, 8) + "…"}
          </span>
        </FloraLink>
      ) : (
        <img
          src={item.url}
          alt={item.title ?? `Flora ${i + 1}`}
          className="h-20 w-32 sm:h-24 sm:w-40 md:h-32 md:w-48 object-cover"
        />
      )}
    </MarqueeItem>
  ))

  const firstThird = displayItems.slice(0, Math.floor(displayItems.length / 3))
  const secondThird = displayItems.slice(
    Math.floor(displayItems.length / 3),
    Math.floor((2 * displayItems.length) / 3)
  )
  const lastThird = displayItems.slice(Math.floor((2 * displayItems.length) / 3))

  return (
    <div
      className={cn(
        "flex w-full h-full relative justify-center items-center flex-col overflow-hidden",
        className
      )}
    >
      <div className="w-full h-full flex flex-col justify-center items-center space-y-2 sm:space-y-3 md:space-y-4 py-8">
        <MarqueeRow
          className="w-full"
          baseVelocity={baseVelocity}
          repeat={repeat}
          slowDownFactor={slowDownFactor}
          slowdownOnHover={slowdownOnHover}
          slowDownSpringConfig={slowDownSpringConfig}
          direction={direction}
        >
          {firstThird}
        </MarqueeRow>

        <MarqueeRow
          className="w-full"
          baseVelocity={baseVelocity}
          repeat={repeat}
          slowdownOnHover={slowdownOnHover}
          slowDownFactor={slowDownFactor}
          slowDownSpringConfig={slowDownSpringConfig}
          direction={direction === "left" ? "right" : "left"}
        >
          {secondThird}
        </MarqueeRow>

        <MarqueeRow
          className="w-full"
          baseVelocity={baseVelocity}
          repeat={repeat}
          slowDownFactor={slowDownFactor}
          slowdownOnHover={slowdownOnHover}
          slowDownSpringConfig={slowDownSpringConfig}
          direction={direction}
        >
          {lastThird}
        </MarqueeRow>
      </div>
    </div>
  )
}
