import React, { useEffect, useMemo } from "react"
import type { HTMLAttributes } from "react"
import type { DOMKeyframesDefinition, AnimationOptions } from "motion"
import { useAnimate } from "motion/react"

import { cn } from "@/lib/utils"

interface ImageTrailProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  threshold?: number
  intensity?: number
  keyframes?: DOMKeyframesDefinition
  keyframesOptions?: AnimationOptions
  trailElementAnimationKeyframes?: {
    x?: AnimationOptions
    y?: AnimationOptions
  }
  repeatChildren?: number
  baseZIndex?: number
  zIndexDirection?: "new-on-top" | "old-on-top"
}

interface ImageTrailItemProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const MathUtils = {
  lerp: (a: number, b: number, n: number) => (1 - n) * a + n * b,
  distance: (x1: number, y1: number, x2: number, y2: number) =>
    Math.hypot(x2 - x1, y2 - y1),
}

const ImageTrailBase = ({
  className,
  children,
  threshold = 50,
  intensity = 0.1,
  keyframes,
  keyframesOptions,
  repeatChildren = 1,
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

  return (
    <div
      className={cn("h-full w-full relative", className)}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      {...props}
    >
      {Array.from({ length: repeatChildren }).map((_, index) => (
        <React.Fragment key={index}>{children}</React.Fragment>
      ))}
    </div>
  )
}

export const ImageTrailItem = ({
  className,
  children,
  ...props
}: ImageTrailItemProps) => {
  return (
    <div
      {...props}
      className={cn(
        "absolute top-0 left-0 will-change-transform hidden",
        className,
        "image-trail-item"
      )}
    >
      {children}
    </div>
  )
}

const images = [
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
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532648/img-8_hwuplt.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532647/img-7_ib8m6b.png",
  "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532645/img-6_qmsbif.png",
]

export default function ImageTrail() {
  return (
    <div className="w-full h-full relative z-0 text-foreground dark:text-muted overflow-hidden" style={{ backgroundColor: "transparent" }}>
      <ImageTrailBase
        threshold={100}
        intensity={1}
        keyframes={{ scale: [1, 2] }}
        keyframesOptions={{
          scale: { duration: 0.3, times: [4, 1] },
        }}
        repeatChildren={1}
        baseZIndex={-10}
      >
        {images.map((url, index) => (
          <ImageTrailItem key={index}>
            <div className="w-20 sm:w-28 h-full relative overflow-hidden">
              <img src={url} alt="image" className="object-cover" />
            </div>
          </ImageTrailItem>
        ))}
      </ImageTrailBase>
    </div>
  )
}
