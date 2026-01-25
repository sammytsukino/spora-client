import React, { useRef } from "react"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

type SpringOptions = {
  damping?: number
  stiffness?: number
}

// Custom wrap function
const wrap = (min: number, max: number, value: number): number => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

interface SimpleMarqueeProps {
  items?: React.ReactNode[]
  className?: string
  direction?: "left" | "right"
  baseVelocity?: number
  repeat?: number
  slowdownOnHover?: boolean
  slowDownFactor?: number
  slowDownSpringConfig?: SpringOptions
}

const MarqueeItem = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-2 sm:mx-3 md:mx-4 hover:scale-105 cursor-pointer duration-300 ease-in-out">
    {children}
  </div>
)

// Componente interno de marquee
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

  const x = useTransform(baseX, (v) => {
    const wrappedValue = wrap(0, -100, v)
    return `${wrappedValue}%`
  })
  const y = useTransform(baseY, (v) => {
    const wrappedValue = wrap(0, -100, v)
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
      {Array.from({ length: repeat }, (_, i) => i).map((i) => (
        <motion.div
          key={i}
          className={cn("shrink-0", isHorizontal && "flex")}
          style={isHorizontal ? { x } : { y }}
          aria-hidden={i > 0}
        >
          {children}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default function SimpleMarquee({
  items = [],
  className = "",
  direction = "left",
  baseVelocity = 8,
  repeat = 4,
  slowdownOnHover = true,
  slowDownFactor = 0.1,
  slowDownSpringConfig = { damping: 60, stiffness: 300 },
}: SimpleMarqueeProps) {
  // Si no hay items, usar imágenes de ejemplo
  const defaultImages = [
    "https://cdn.cosmos.so/4b771c5c-d1eb-4948-b839-255dbeb931ba?format=jpeg",
    "https://cdn.cosmos.so/a8d82afd-2293-43ad-bac3-887683d85b44?format=jpeg",
    "https://cdn.cosmos.so/49206ba5-c174-4cd5-aee8-5b744842e6c2?format=jpeg",
    "https://cdn.cosmos.so/b29bd150-6477-420f-8efb-65ed99694421?format=jpeg",
    "https://cdn.cosmos.so/e1a0313e-7617-431d-b7f1-f1b169e6bcb4?format=jpeg",
    "https://cdn.cosmos.so/ad640c12-69fb-4186-bc3d-b1cc93986a37?format=jpeg",
    "https://cdn.cosmos.so/5cf0c3d2-e785-41a3-b0c8-a073ee2f2862?format=jpeg",
    "https://cdn.cosmos.so/938ab21c-a975-41b3-b303-418290343b09?format=jpeg",
    "https://cdn.cosmos.so/2e14a9bb-27e3-40fd-b940-cfb797a1224c?format=jpeg",
    "https://cdn.cosmos.so/81841d9f-e164-4770-aebc-cfc97d72f3ab?format=jpeg",
    "https://cdn.cosmos.so/49b81db0-37ea-4569-b0d6-04afa5115a10?format=jpeg",
    "https://cdn.cosmos.so/ade1834b-9317-44fb-8dc3-b43d29acd409?format=jpeg",
    "https://cdn.cosmos.so/621c250c-3833-45f9-862a-3f400aaf8f28?format=jpeg",
    "https://cdn.cosmos.so/f9b7eae8-e5a6-4ce6-b6e1-9ef125ba7f8e?format=jpeg",
    "https://cdn.cosmos.so/bd56ed6d-1bbd-44a4-b1a1-79b7199bbebb?format=jpeg",
  ]

  const displayItems = items.length > 0 
    ? items 
    : defaultImages.map((src, i) => (
        <MarqueeItem key={i}>
          <img
            src={src}
            alt={`Image ${i + 1}`}
            className="h-20 w-32 sm:h-24 sm:w-40 md:h-32 md:w-48 object-cover"
          />
        </MarqueeItem>
      ))

  // Dividir items en tres grupos para crear múltiples filas
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
