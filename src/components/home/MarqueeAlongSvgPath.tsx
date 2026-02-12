import React, { useCallback, useEffect, useId, useRef } from "react"
import type { RefObject } from "react"
import type { MotionValue } from "motion"
import { transform } from "motion"
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react"

import { cn } from "@/lib/utils"
import MarqueeTextContent from "./MarqueeTextContent"

type SpringOptions = {
  damping?: number
  stiffness?: number
  mass?: number
  restDelta?: number
  restSpeed?: number
}

type PreserveAspectRatioAlign =
  | "none"
  | "xMinYMin"
  | "xMidYMin"
  | "xMaxYMin"
  | "xMinYMid"
  | "xMidYMid"
  | "xMaxYMid"
  | "xMinYMax"
  | "xMidYMax"
  | "xMaxYMax"

type PreserveAspectRatioMeetOrSlice = "meet" | "slice"

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`

interface CSSVariableInterpolation {
  property: string
  from: number | string
  to: number | string
}

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode
  className?: string

  path: string
  pathId?: string
  showPath?: boolean

  width?: string | number
  height?: string | number
  viewBox?: string
  preserveAspectRatio?: PreserveAspectRatio

  baseVelocity?: number
  direction?: "normal" | "reverse"
  easing?: (value: number) => number
  repeat?: number

  slowdownOnHover?: boolean
  slowDownFactor?: number
  slowDownSpringConfig?: SpringOptions

  useScrollVelocity?: boolean
  scrollAwareDirection?: boolean
  scrollSpringConfig?: SpringOptions
  scrollContainer?: RefObject<HTMLElement | null> | HTMLElement | null

  draggable?: boolean
  dragSensitivity?: number
  dragVelocityDecay?: number
  dragAwareDirection?: boolean
  grabCursor?: boolean

  enableRollingZIndex?: boolean
  zIndexBase?: number
  zIndexRange?: number

  cssVariableInterpolation?: CSSVariableInterpolation[]

  responsive?: boolean
}

const wrap = (min: number, max: number, value: number): number => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

export const MarqueeAlongSvgPathBase = ({
  children,
  className,

  path,
  pathId,
  showPath = false,

  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",
  preserveAspectRatio = "xMidYMid meet",

  baseVelocity = 5,
  direction = "normal",
  easing,
  repeat = 3,

  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },

  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,

  draggable = false,
  dragSensitivity = 0.2,
  dragVelocityDecay = 0.96,
  dragAwareDirection = false,
  grabCursor = false,

  enableRollingZIndex = true,
  zIndexBase = 1,
  zIndexRange = 10,

  cssVariableInterpolation = [],

}: MarqueeAlongSvgPathProps) => {
  const container = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  
  const isHovered = useRef(false)
  const isDragging = useRef(false)
  const dragVelocity = useRef(0)
  const directionFactor = useRef(direction === "normal" ? 1 : -1)
  const lastPointerPosition = useRef({ x: 0, y: 0 })

  const baseOffset = useMotionValue(0)
  const hoverFactorValue = useMotionValue(1)
  const defaultVelocity = useMotionValue(1)

  const { scrollY } = useScroll({
    container: (scrollContainer as RefObject<HTMLDivElement | null>) || container,
  })

  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig)
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig)

  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false }
  )

  const items = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children)
    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => ({
        child,
        childIndex,
        repeatIndex,
        itemIndex: repeatIndex * childrenArray.length + childIndex,
        key: `${childIndex}-${repeatIndex}`,
      }))
    )
  }, [children, repeat])

  const calculateZIndex = useCallback(
    (offsetDistance: number) => {
      const normalizedDistance = offsetDistance / 100
      return Math.floor(zIndexBase + normalizedDistance * zIndexRange)
    },
    [zIndexBase, zIndexRange]
  )

  const reactId = useId()
  const id = pathId || `marquee-path-${reactId.replace(/:/g, "")}`

  useAnimationFrame((_, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current)
      dragVelocity.current *= 0.9
      if (Math.abs(dragVelocity.current) < 0.01) {
        dragVelocity.current = 0
      }
      return
    }

    hoverFactorValue.set(
      isHovered.current && slowdownOnHover ? slowDownFactor : 1
    )

    let moveBy =
      directionFactor.current *
      baseVelocity *
      (delta / 1000) *
      smoothHoverFactor.get()

    if (scrollAwareDirection && !isDragging.current) {
      const vel = velocityFactor.get()
      if (vel < 0) directionFactor.current = -1
      else if (vel > 0) directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()

    if (draggable) {
      moveBy += dragVelocity.current

      if (dragAwareDirection && Math.abs(dragVelocity.current) > 0.1) {
        directionFactor.current = Math.sign(dragVelocity.current)
      }

      if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
        dragVelocity.current *= dragVelocityDecay
      } else if (!isDragging.current) {
        dragVelocity.current = 0
      }
    }

    baseOffset.set(baseOffset.get() + moveBy)
  })

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)
    if (grabCursor) target.style.cursor = "grabbing"
    isDragging.current = true
    lastPointerPosition.current = { x: e.clientX, y: e.clientY }
    dragVelocity.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !isDragging.current) return

    const current = { x: e.clientX, y: e.clientY }
    const deltaX = current.x - lastPointerPosition.current.x
    const deltaY = current.y - lastPointerPosition.current.y
    const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const projectedDelta = deltaX > 0 ? delta : -delta

    dragVelocity.current = projectedDelta * dragSensitivity
    lastPointerPosition.current = current
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return
    const target = e.currentTarget as HTMLElement
    target.releasePointerCapture(e.pointerId)
    isDragging.current = false
    if (grabCursor) target.style.cursor = "grab"
  }

  return (
    <div
      ref={container}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn("relative", className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        className="w-full h-full"
      >
        <path
          id={id}
          d={path}
          stroke={showPath ? "currentColor" : "none"}
          fill="none"
          ref={pathRef}
        />
      </svg>

      {items.map(({ child, repeatIndex, itemIndex, key }) => (
        <MarqueeItem
          key={key}
          child={child}
          itemIndex={itemIndex}
          itemsLength={items.length}
          baseOffset={baseOffset}
          easing={easing}
          path={path}
          calculateZIndex={calculateZIndex}
          cssVariableInterpolation={cssVariableInterpolation}
          draggable={draggable}
          grabCursor={grabCursor}
          enableRollingZIndex={enableRollingZIndex}
          ariaHidden={repeatIndex > 0}
          onHoverChange={(hovered) => {
            isHovered.current = hovered
          }}
        />
      ))}
    </div>
  )
}

interface MarqueeItemProps {
  child: React.ReactNode
  itemIndex: number
  itemsLength: number
  baseOffset: MotionValue<number>
  easing?: (value: number) => number
  path: string
  calculateZIndex: (offsetDistance: number) => number
  cssVariableInterpolation: CSSVariableInterpolation[]
  draggable: boolean
  grabCursor: boolean
  enableRollingZIndex: boolean
  ariaHidden: boolean
  onHoverChange: (hovered: boolean) => void
}

const MarqueeItem = ({
  child,
  itemIndex,
  itemsLength,
  baseOffset,
  easing,
  path,
  calculateZIndex,
  cssVariableInterpolation,
  draggable,
  grabCursor,
  enableRollingZIndex,
  ariaHidden,
  onHoverChange,
}: MarqueeItemProps) => {
  const itemRef = useRef<HTMLDivElement | null>(null)

  const itemOffset = useTransform(baseOffset, (v) => {
    const position = (itemIndex * 100) / itemsLength
    const wrappedValue = wrap(0, 100, v + position)
    return `${easing ? easing(wrappedValue / 100) * 100 : wrappedValue}%`
  })

  const currentOffsetDistance = useMotionValue(0)
  const zIndex = useTransform(currentOffsetDistance, calculateZIndex)

  useEffect(() => {
    const unsubscribe = itemOffset.on("change", (value: string) => {
      const match = value.match(/^([\d.]+)%$/)
      if (match?.[1]) {
        currentOffsetDistance.set(parseFloat(match[1]))
      }
    })
    return unsubscribe
  }, [itemOffset, currentOffsetDistance])

  useEffect(() => {
    if (!itemRef.current || cssVariableInterpolation.length === 0) return undefined

    const interpolators = cssVariableInterpolation.map(({ property, from, to }) => ({
      property,
      interpolate: transform([0, 100], [from, to]),
    }))

    const unsubscribe = currentOffsetDistance.on("change", (value) => {
      const el = itemRef.current
      if (!el) return
      interpolators.forEach(({ property, interpolate }) => {
        el.style.setProperty(property, String(interpolate(value)))
      })
    })

    return unsubscribe
  }, [cssVariableInterpolation, currentOffsetDistance])

  return (
    <motion.div
      ref={itemRef}
      className={cn("absolute top-0 left-0", draggable && grabCursor && "cursor-grab")}
      style={{
        offsetPath: `path('${path}')`,
        offsetDistance: itemOffset,
        zIndex: enableRollingZIndex ? zIndex : undefined,
      }}
      aria-hidden={ariaHidden}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      {child}
    </motion.div>
  )
}

const path =
  "M.43,420.62c52.72,68.49,109.19,137.1,185.23,195.06,148.97,114.13,423.68,239.51,652.56,182.16,289.78-71.72,544.96-445.73,531.22-650.01-3.97-83.39-65.57-163.07-200.2-144.6-175.72,28.63-302.34,179.08-339.84,294.57-72.36,201.33,34.88,471.46,378.03,497.1,313.54,18.39,633.89-101.06,840.03-273.18,136.07-113.61,285.75-246.67,442.57-515.23"

const imgs = [
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-22_akcm8r.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-21_dzwlna.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-20_fww5yp.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532657/img-19_haco8y.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532656/img-18_djc6db.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-17_e6uarr.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-16_gf9k7x.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-15_wpwz9h.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-14_gbx118.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532652/img-13_qncmyd.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532651/img-12_swbm8v.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532648/img-11_la2ekj.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532648/img-10_kb18zx.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532648/img-9_szhd9n.png",
]

export function MarqueeBackground({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    
    
    <div className={className || "w-full h-full relative overflow-hidden"}>
      <MarqueeAlongSvgPathBase
        path={path}
        baseVelocity={3}
        slowdownOnHover={true}
        draggable={true}
        repeat={5}
        dragSensitivity={0.1}
        viewBox="0 -160 2500 1100"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full"
        grabCursor
      >
        {children ||
          imgs.map((src, i) => (
            <div
              key={i}
              className="w-14 h-20 hover:scale-150 duration-300 ease-in-out"
            >
              <img
                src={src}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          ))}
      </MarqueeAlongSvgPathBase>
    </div>
  )
}

export default function MarqueeAlongSvgPath({
  showText = false,
}: {
  showText?: boolean
}) {
  return (
    <div className="w-full relative overflow-hidden min-h-[36vh] sm:min-h-[50vh] md:min-h-[80vh]">
      <div className="absolute inset-0 w-full h-full md:hidden bg-linear-to-b from-(--spora-accent-secondary) to-(--spora-secondary)" />
      <MarqueeBackground className="absolute inset-0 w-full h-full overflow-hidden" />
      {showText && <MarqueeTextContent />}
    </div>
  )
}