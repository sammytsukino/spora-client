import React, { useEffect, useMemo } from "react"
import type { ElementType, HTMLAttributes } from "react"
import type { DOMKeyframesDefinition, AnimationOptions } from "motion"
import { useAnimate } from "motion/react"

import { cn } from "@/lib/utils"
import CyclingLogo from "./cycling-logo"

interface ImageTrailProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The content to be displayed
   */
  children: React.ReactNode

  /**
   * HTML Tag
   */
  as?: ElementType

  /**
   * How much distance in pixels the mouse has to travel to trigger of an element to appear.
   */
  threshold?: number

  /**
   * The intensity for the momentum movement after showing the element. The value will be clamped > 0 and <= 1.0. Defaults to 0.3.
   */
  intensity?: number

  /**
   * Animation Keyframes for defining the animation sequence. Example: { scale: [0, 1, 1, 0] }
   */
  keyframes?: DOMKeyframesDefinition

  /**
   * Options for the animation/keyframes. Example: { duration: 1, times: [0, 0.1, 0.9, 1] }
   */
  keyframesOptions?: AnimationOptions

  /**
   * Animation keyframes for the x and y positions after showing the element. Describes how the element should try to arrive at the mouse position.
   */
  trailElementAnimationKeyframes?: {
    x?: AnimationOptions
    y?: AnimationOptions
  }

  /**
   * The number of times the children will be repeated. Defaults to 3.
   */
  repeatChildren?: number

  /**
   * The base zIndex for all elements. Defaults to 0.
   */
  baseZIndex?: number

  /**
   * Controls stacking order behavior.
   * - "new-on-top": newer elements stack above older ones (default)
   * - "old-on-top": older elements stay visually on top
   */
  zIndexDirection?: "new-on-top" | "old-on-top"
}

interface ImageTrailItemProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * HTML Tag
   */
  as?: ElementType

  /**
   * The content to be displayed
   */
  children: React.ReactNode
}

const MathUtils = {
  lerp: (a: number, b: number, n: number) => (1 - n) * a + n * b,
  distance: (x1: number, y1: number, x2: number, y2: number) =>
    Math.hypot(x2 - x1, y2 - y1),
}

const ImageTrailBase = ({
  className,
  as = "div",
  children,
  threshold = 100,
  intensity = 0.3,
  keyframes,
  keyframesOptions,
  repeatChildren = 3,
  trailElementAnimationKeyframes = {
    x: { duration: 1, type: "tween", ease: "easeOut" },
    y: { duration: 1, type: "tween", ease: "easeOut" },
  },
  baseZIndex = 0,
  zIndexDirection = "new-on-top",
  ...props
}: ImageTrailProps) => {
  const allImages = React.useRef<NodeListOf<HTMLElement>>(undefined)
  const currentId = React.useRef(0)
  const lastMousePos = React.useRef({ x: 0, y: 0 })
  const cachedMousePos = React.useRef({ x: 0, y: 0 })
  const [containerRef, animate] = useAnimate()
  const zIndices = React.useRef<number[]>([])

  const clampedIntensity = useMemo(
    () => Math.max(0.0001, Math.min(1, intensity)),
    [intensity]
  )

  useEffect(() => {
    allImages.current = containerRef?.current?.querySelectorAll(
      ".image-trail-item"
    ) as NodeListOf<HTMLElement>

    zIndices.current = Array.from(
      { length: allImages.current.length },
      (_, index) => index
    )
  }, [containerRef, allImages])

  const handleMouseMove = (e: React.MouseEvent) => {
    const containerRect = containerRef?.current?.getBoundingClientRect()
    const mousePos = {
      x: e.clientX - (containerRect?.left || 0),
      y: e.clientY - (containerRect?.top || 0),
    }

    cachedMousePos.current.x = MathUtils.lerp(
      cachedMousePos.current.x || mousePos.x,
      mousePos.x,
      clampedIntensity
    )

    cachedMousePos.current.y = MathUtils.lerp(
      cachedMousePos.current.y || mousePos.y,
      mousePos.y,
      clampedIntensity
    )

    const distance = MathUtils.distance(
      mousePos.x,
      mousePos.y,
      lastMousePos.current.x,
      lastMousePos.current.y
    )

    if (distance > threshold && allImages?.current) {
      const N = allImages.current.length
      const current = currentId.current

      if (zIndexDirection === "new-on-top") {
        for (let i = 0; i < N; i++) {
          if (i !== current) {
            zIndices.current[i] -= 1
          }
        }
        zIndices.current[current] = N - 1
      } else {
        for (let i = 0; i < N; i++) {
          if (i !== current) {
            zIndices.current[i] += 1
          }
        }
        zIndices.current[current] = 0
      }

      allImages.current[current].style.display = "block"
      allImages.current.forEach((img, index) => {
        img.style.zIndex = String(zIndices.current[index] + baseZIndex)
      })

      animate(
        allImages.current[currentId.current],
        {
          x: [
            cachedMousePos.current.x -
              allImages.current[currentId.current].offsetWidth / 2,
            mousePos.x - allImages.current[currentId.current].offsetWidth / 2,
          ],
          y: [
            cachedMousePos.current.y -
              allImages.current[currentId.current].offsetHeight / 2,
            mousePos.y -
              allImages.current?.[currentId.current].offsetHeight / 2,
          ],
          ...keyframes,
        },
        {
          ...trailElementAnimationKeyframes.x,
          ...trailElementAnimationKeyframes.y,
          ...keyframesOptions,
        }
      )
      currentId.current = (current + 1) % N
      lastMousePos.current = { x: mousePos.x, y: mousePos.y }
    }
  }

  const ElementTag = as ?? "div"

  return (
    <ElementTag
      className={cn("h-full w-full relative", className)}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      {...props}
    >
      {Array.from({ length: repeatChildren }).map(() => (
        <>{children}</>
      ))}
    </ElementTag>
  )
}

export const ImageTrailItem = ({
  className,
  children,
  as = "div",
  ...props
}: ImageTrailItemProps) => {
  const ElementTag = as ?? "div"
  
  return (
    <ElementTag
      {...props}
      className={cn(
        "absolute top-0 left-0 will-change-transform hidden",
        className,
        "image-trail-item"
      )}
    >
      {children}
    </ElementTag>
  )
}

const images = [
  "https://cdn.cosmos.so/7dc46d69-ad3b-4942-ab84-511ae786892e?format=jpeg",
  "https://cdn.cosmos.so/cb5c5995-4ba7-4519-a0e8-aa6427cc0a90?format=jpeg",
  "https://cdn.cosmos.so/264d0ae9-f2e9-4deb-843c-229e70bbe4cc?format=jpeg",
  "https://cdn.cosmos.so/223c2fad-7dcb-46e0-9f00-826edcf8d7b1?format=jpeg",
  "https://cdn.cosmos.so/48e640ee-75e1-4390-a34a-b790785f033a?format=jpeg",
  "https://cdn.cosmos.so/d9c19f7c-d605-4257-8546-dafe0daa250f.?format=jpeg",
  "https://cdn.cosmos.so/5ff27be0-bed8-4779-b520-6896e68e7e4d?format=jpeg",
  "https://cdn.cosmos.so/9098d86e-b3f7-425f-be96-40df45c82342?format=jpeg",
  "https://cdn.cosmos.so/6a1d9c63-5b32-4a22-b03e-5dc63164ad8a?format=jpeg",
]

export default function ImageTrail() {
  return (
    <div className="w-dvw h-dvh relative text-foreground dark:text-muted overflow-hidden" style={{ backgroundColor: '#E9E9E9' }}>
      <ImageTrailBase
        threshold={100}
        intensity={1}
        keyframes={{ scale: [1, 2] }}
        keyframesOptions={{
          scale: { duration: 1, times: [1, 1] },
        }}
        repeatChildren={1}
      >
        {images.map((url, index) => (
          <ImageTrailItem key={index}>
            <div className="w-20 sm:w-28 h-full relative overflow-hidden">
              <img src={url} alt="image" className="object-cover" />
            </div>
          </ImageTrailItem>
        ))}
      </ImageTrailBase>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-20 pointer-events-none z-10">
        <p className="font-bizud-mincho-bold text-lg sm:text-xl md:text-2xl tracking-wide mb-2">
          not revolutionary
        </p>

        <CyclingLogo
          logos={[
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903352/4_wxvxkj.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903351/3_yni4c2.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903330/0_b471dn.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903331/2_gnhbhj.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903330/1_riof7w.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903329/11_gjupa0.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903329/12_nizkdg.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903329/13_z6rhv6.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903328/10_cgfww1.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903328/8_lvrwmb.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903328/9_ntwap1.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903327/7_pi1uzh.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903327/5_nmjyqc.svg",
            "https://res.cloudinary.com/dsy30p7gf/image/upload/v1767903327/6_hi73sd.svg",
          ]}
          width="50vw"
          height="10vw"
          cycleDuration={0.20}
        />

        <p className="font-bizud-mincho-bold text-lg sm:text-xl md:text-2xl tracking-wide mt-2">
          but evolutionary
        </p>
      </div>
    </div>
  )
}
