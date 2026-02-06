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
  rows?: 1 | 2 | 3
}

const MarqueeItem = ({ children }: { children: React.ReactNode }) => (
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
  rows = 3,
}: SimpleMarqueeProps) {
  const defaultImages = [
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
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532645/img-5_vjq8n7.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532645/img-4_aqvxp1.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532644/img-3_lliaa8.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532641/img-2_nzhkha.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532641/img-1_udglua.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532640/img-0_ioib2p.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532640/img-42_xvth2k.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532640/img-41_uiqo53.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532640/img-40_igwvyl.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532635/img-39_nxcwr9.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532635/img-38_s25crl.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532635/img-37_hwxtlq.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532634/img-36_spfjwb.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532634/img-35_zeyrtn.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532634/img-34_euvf80.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532632/img-33_bnpq17.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532632/img-32_g3gqy8.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532627/img-31_xxdmdc.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532627/img-29_k7rpus.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532627/img-30_ngmjrl.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532627/img-28_ttg3cg.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532627/img-27_bzyii3.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532626/img-24_xw9s6d.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532626/img-25_riiddk.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532626/img-26_gxvw9g.png",
    "https://res.cloudinary.com/dsy30p7gf/image/upload/v1769532626/img-23_tk2fzq.png"
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

  const rowItems = (() => {
    if (rows === 1) {
      return [displayItems]
    }

    if (rows === 2) {
      const midpoint = Math.ceil(displayItems.length / 2)
      return [
        displayItems.slice(0, midpoint),
        displayItems.slice(midpoint),
      ]
    }

    const firstThird = displayItems.slice(0, Math.floor(displayItems.length / 3))
    const secondThird = displayItems.slice(
      Math.floor(displayItems.length / 3),
      Math.floor((2 * displayItems.length) / 3)
    )
    const lastThird = displayItems.slice(Math.floor((2 * displayItems.length) / 3))

    return [firstThird, secondThird, lastThird]
  })()

  return (
    <div
      className={cn(
        "flex w-full h-full relative justify-center items-center flex-col overflow-hidden",
        className
      )}
    >
      <div className="w-full h-full flex flex-col justify-center items-center space-y-2 sm:space-y-3 md:space-y-4 py-8">
        {rowItems.map((row, rowIndex) => (
          <MarqueeRow
            key={`row-${rowIndex}`}
            className="w-full"
            baseVelocity={baseVelocity}
            repeat={repeat}
            slowDownFactor={slowDownFactor}
            slowdownOnHover={slowdownOnHover}
            slowDownSpringConfig={slowDownSpringConfig}
            direction={
              rowIndex % 2 === 0
                ? direction
                : direction === "left"
                  ? "right"
                  : "left"
            }
          >
            {row}
          </MarqueeRow>
        ))}
      </div>
    </div>
  )
}
