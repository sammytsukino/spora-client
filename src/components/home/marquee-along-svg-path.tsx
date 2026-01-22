import React, { useCallback, useEffect, useRef } from "react"
import type { RefObject } from "react"
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
import MarqueeTextContent from "./marquee-text-content"

type SpringOptions = {
  damping?: number
  stiffness?: number
  mass?: number
  restDelta?: number
  restSpeed?: number
}

const wrap = (min: number, max: number, value: number): number => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
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

interface CSSVariableInterpolation {
  property: string
  from: number | string
  to: number | string
}

type PreserveAspectRatioMeetOrSlice = "meet" | "slice"

type PreserveAspectRatio =
  | PreserveAspectRatioAlign
  | `${Exclude<PreserveAspectRatioAlign, "none">} ${PreserveAspectRatioMeetOrSlice}`

interface MarqueeAlongSvgPathProps {
  children: React.ReactNode
  className?: string

  path: string
  pathId?: string
  preserveAspectRatio?: PreserveAspectRatio
  showPath?: boolean

  width?: string | number
  height?: string | number
  viewBox?: string

  baseVelocity?: number
  direction?: "normal" | "reverse"
  easing?: (value: number) => number
  slowdownOnHover?: boolean
  slowDownFactor?: number
  slowDownSpringConfig?: SpringOptions

  useScrollVelocity?: boolean
  scrollAwareDirection?: boolean
  scrollSpringConfig?: SpringOptions
  scrollContainer?: RefObject<HTMLElement | null> | HTMLElement | null

  repeat?: number

  draggable?: boolean
  dragSensitivity?: number
  dragVelocityDecay?: number
  dragAwareDirection?: boolean
  grabCursor?: boolean

  enableRollingZIndex?: boolean
  zIndexBase?: number
  zIndexRange?: number

  cssVariableInterpolation?: CSSVariableInterpolation[]
}

export const MarqueeAlongSvgPathBase = ({
  children,
  className,

  path,
  pathId,
  preserveAspectRatio = "xMidYMid meet",
  showPath = false,

  width = "100%",
  height = "100%",
  viewBox = "0 0 100 100",

  baseVelocity = 5,
  direction = "normal",
  easing,
  slowdownOnHover = false,
  slowDownFactor = 0.3,
  slowDownSpringConfig = { damping: 50, stiffness: 400 },

  useScrollVelocity = false,
  scrollAwareDirection = false,
  scrollSpringConfig = { damping: 50, stiffness: 400 },
  scrollContainer,

  repeat = 3,

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
  const baseOffset = useMotionValue(0)
  const pathRef = useRef<SVGPathElement>(null)
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const items = React.useMemo(() => {
    const childrenArray = React.Children.toArray(children)

    return childrenArray.flatMap((child, childIndex) =>
      Array.from({ length: repeat }, (_, repeatIndex) => {
        const itemIndex = repeatIndex * childrenArray.length + childIndex
        const key = `${childIndex}-${repeatIndex}`
        return {
          child,
          childIndex,
          repeatIndex,
          itemIndex,
          key,
        }
      })
    )
  }, [children, repeat])

  const calculateZIndex = useCallback(
    (offsetDistance: number) => {
      if (!enableRollingZIndex) {
        return undefined
      }

      const normalizedDistance = offsetDistance / 100
      return Math.floor(zIndexBase + normalizedDistance * zIndexRange)
    },
    [enableRollingZIndex, zIndexBase, zIndexRange]
  )

  const id = pathId || `marquee-path-${Math.random().toString(36).substring(7)}`

  const { scrollY } = useScroll({
    container: (scrollContainer as RefObject<HTMLDivElement | null>) || container,
  })

  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, scrollSpringConfig)

  const isHovered = useRef(false)
  const isDragging = useRef(false)
  const dragVelocity = useRef(0)

  const directionFactor = useRef(direction === "normal" ? 1 : -1)

  const hoverFactorValue = useMotionValue(1)
  const defaultVelocity = useMotionValue(1)
  const smoothHoverFactor = useSpring(hoverFactorValue, slowDownSpringConfig)

  const velocityFactor = useTransform(
    useScrollVelocity ? smoothVelocity : defaultVelocity,
    [0, 1000],
    [0, 5],
    { clamp: false }
  )

  useAnimationFrame((_, delta) => {
    if (isDragging.current && draggable) {
      baseOffset.set(baseOffset.get() + dragVelocity.current)

      dragVelocity.current *= 0.9

      if (Math.abs(dragVelocity.current) < 0.01) {
        dragVelocity.current = 0
      }

      return
    }

    if (isHovered.current) {
      hoverFactorValue.set(slowdownOnHover ? slowDownFactor : 1)
    } else {
      hoverFactorValue.set(1)
    }

    let moveBy =
      directionFactor.current *
      baseVelocity *
      (delta / 1000) *
      smoothHoverFactor.get()

    if (scrollAwareDirection && !isDragging.current) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1
      }
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

  const lastPointerPosition = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)

    if (grabCursor) {
      ;(e.currentTarget as HTMLElement).style.cursor = "grabbing"
    }

    isDragging.current = true
    lastPointerPosition.current = { x: e.clientX, y: e.clientY }

    dragVelocity.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !isDragging.current) return

    const currentPosition = { x: e.clientX, y: e.clientY }

    const deltaX = currentPosition.x - lastPointerPosition.current.x
    const deltaY = currentPosition.y - lastPointerPosition.current.y

    const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const projectedDelta = deltaX > 0 ? delta : -delta

    dragVelocity.current = projectedDelta * dragSensitivity

    lastPointerPosition.current = currentPosition
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggable) return
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    isDragging.current = false

    if (grabCursor) {
      ;(e.currentTarget as HTMLElement).style.cursor = "grab"
    }
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

      {items.map(({ child, repeatIndex, itemIndex, key }) => {
        const itemOffset = useTransform(baseOffset, (v) => {
          const position = (itemIndex * 100) / items.length
          const wrappedValue = wrap(0, 100, v + position)
          return `${easing ? easing(wrappedValue / 100) * 100 : wrappedValue}%`
        })

        const currentOffsetDistance = useMotionValue(0)

        const zIndex = useTransform(currentOffsetDistance, (value) =>
          calculateZIndex(value)
        )

        useEffect(() => {
          const unsubscribe = itemOffset.on("change", (value: string) => {
            const match = value.match(/^([\d.]+)%$/)
            if (match && match[1]) {
              currentOffsetDistance.set(parseFloat(match[1]))
            }
          })
          return unsubscribe
        }, [itemOffset, currentOffsetDistance])

        const cssVariables = Object.fromEntries(
          (cssVariableInterpolation || []).map(({ property, from, to }) => [
            property,
            useTransform(currentOffsetDistance, [0, 100], [from, to]),
          ])
        )

        return (
          <motion.div
            key={key}
            ref={(el) => {
              if (el) itemRefs.current.set(key, el)
            }}
            className={cn(
              "absolute top-0 left-0",
              draggable && grabCursor && "cursor-grab"
            )}
            style={{
              offsetPath: `path('${path}')`,
              offsetDistance: itemOffset,
              zIndex: enableRollingZIndex ? zIndex : undefined,
              ...cssVariables,
            }}
            aria-hidden={repeatIndex > 0}
            onMouseEnter={() => (isHovered.current = true)}
            onMouseLeave={() => (isHovered.current = false)}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}

const path =
  "M0,628.302 C175.7616,767.805 1163.778,977.814 1447.749,628.302C1802.715,191.4153 1576.548,-129.6633 1281.996,59.8839C987.4485,249.4308 1058.706,728.169 1545.123,801.906C1934.256,860.898 2830.68,545.82 2985,469.5"

const imgs = [
  {
    src: "https://cdn.cosmos.so/b9909337-7a53-48bc-9672-33fbd0f040a1?format=jpeg",
    link: "https://www.instagram.com/p/DCOl6YTS85e/?igsh=MXNvdHhyczl1djJ6ZA%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/ecdc9dd7-2862-4c28-abb1-dcc0947390f3?format=jpeg",
    link: "https://www.instagram.com/p/C4RTJvVpP4R/?igsh=MWZwOTNlYTVodGszMw%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/79de41ec-baa4-4ac0-a9a4-c090005ca640?format=jpeg",
    link: "https://pangrampangram.com/products/mori",
  },
  {
    src: "https://cdn.cosmos.so/1a18b312-21cd-4484-bce5-9fb7ed1c5e01?format=jpeg",
    link: "https://www.sergidelgado.com/selected-work/ampersand",
  },
  {
    src: "https://cdn.cosmos.so/d765f64f-7a66-462f-8b2d-3d7bc8d7db55?format=jpeg",
    link: "https://www.instagram.com/p/C40XmANsoe_/?igsh=MXFlZGx4cmw3ZW1qYw%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/6b9f08ea-f0c5-471f-a620-71221ff1fb65?format=jpeg",
    link: "https://abduzeedo.com/super-stylish-type-explorations",
  },
  {
    src: "https://cdn.cosmos.so/40a09525-4b00-4666-86f0-3c45f5d77605?format=jpeg",
    link: "https://www.instagram.com/p/CrhdrGjr9yK/?igshid=MTc4MmM1YmI2Ng%3D%3D",
  },
  {
    src: "https://cdn.cosmos.so/14f05ab6-b4d0-4605-9007-8a2190a249d0?format=jpeg",
    link: "https://www.instagram.com/julian.stiber/p/By5RBApiDzE/?img_index=1",
  },
  {
    src: "https://cdn.cosmos.so/d05009a2-a2f8-4a4c-a0de-e1b0379dddb8?format=jpeg",
    link: "https://www.instagram.com/p/CeT3COysRNN/?img_index=2",
  },
  {
    src: "https://cdn.cosmos.so/ba646e35-efc2-494a-961b-b40f597e6fc9?format=jpeg",
    link: "https://www.instagram.com/godfreydadich/",
  },
  {
    src: "https://cdn.cosmos.so/e899f9c3-ed48-4899-8c16-fbd5a60705da?format=jpeg",
    link: "https://www.instagram.com/p/Bty1U6BhTOW/?img_index=5",
  },
  {
    src: "https://cdn.cosmos.so/24e83c11-c607-45cd-88fb-5059960b56a0?format=jpeg",
    link: "https://www.instagram.com/p/C48dxn1LqhC/?igsh=dmV5ZWR0Z2Y3Zzlt&img_index=3",
  },
  {
    src: "https://cdn.cosmos.so/cd346bce-f415-4ea7-8060-99c5f7c1741a?format=jpeg",
    link: "https://www.instagram.com/p/C08ZDVyyRhK/?img_index=2&igsh=bHAyZjcxYW1jZDNu",
  },
]

/**
 * Componente del fondo con marquee (reutilizable en otras vistas)
 * Puede usarse independientemente del componente principal
 */
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
        baseVelocity={8}
        slowdownOnHover={true}
        draggable={true}
        repeat={5}
        dragSensitivity={0.1}
        viewBox="0 -150 3000 1000"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        grabCursor
      >
        {children ||
          imgs.map((img, i) => (
            <div
              key={i}
              className="w-14 h-20 hover:scale-150 duration-300 ease-in-out"
            >
              <img
                src={img.src}
                alt={`Example ${i}`}
                className="w-full h-full object-cover rounded-lg"
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
} = {}) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <MarqueeBackground />
      {showText && <MarqueeTextContent />}
    </div>
  )
}
