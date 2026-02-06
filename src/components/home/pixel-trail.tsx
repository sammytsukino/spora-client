import React, { useCallback, useMemo, useRef } from "react"
import { motion, useAnimationControls } from "motion/react"
import { v4 as uuidv4 } from "uuid"

import { cn } from "@/lib/utils"
import { useDimensions } from "@/hooks/use-dimensions"

const pixelAnimateMap = new WeakMap<HTMLElement, () => void>()

interface PixelTrailProps {
  pixelSize: number
  fadeDuration?: number
  delay?: number
  colors?: string[]
  colorDarken?: number
  className?: string
  pixelClassName?: string
}

const PixelTrail: React.FC<PixelTrailProps> = ({
  pixelSize = 100,
  fadeDuration = 500,
  delay = 0,
  colors,
  colorDarken = 0.9,
  className,
  pixelClassName,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const dimensions = useDimensions(containerRef)
  const trailId = useRef(uuidv4())
  const mousePosition = useRef({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.floor((e.clientX - rect.left) / pixelSize)
      const y = Math.floor((e.clientY - rect.top) / pixelSize)

      mousePosition.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      const pixelElement = document.getElementById(
        `${trailId.current}-pixel-${x}-${y}`
      )
      if (pixelElement) {
        const animatePixel = pixelAnimateMap.get(pixelElement)
        if (animatePixel) animatePixel()
      }
    },
    [pixelSize]
  )

  const columns = useMemo(
    () => Math.ceil(dimensions.width / pixelSize),
    [dimensions.width, pixelSize]
  )
  const rows = useMemo(
    () => Math.ceil(dimensions.height / pixelSize),
    [dimensions.height, pixelSize]
  )

  const tonedColors = useMemo(() => {
    if (!colors || colors.length === 0) return undefined

    const safeFactor = Math.min(1, Math.max(0, colorDarken))
    return colors.map((color) => darkenHex(color, safeFactor))
  }, [colors, colorDarken])

  const getPixelGradient = useCallback(
    (col: number, row: number) => {
      const palette = tonedColors ?? colors
      if (!palette || palette.length === 0) return undefined

      const width = dimensions.width || 1
      const height = dimensions.height || 1
      const mouseX = mousePosition.current.x / width
      const mouseY = mousePosition.current.y / height
      const colT = columns > 0 ? col / columns : 0
      const rowT = rows > 0 ? row / rows : 0
      const t = (mouseX * 0.55 + mouseY * 0.35 + colT * 0.05 + rowT * 0.05) % 1
      const index = Math.floor(t * palette.length)
      const nextIndex = (index + 1) % palette.length

      return `linear-gradient(180deg, ${palette[index]} 0%, ${palette[nextIndex]} 100%)`
    },
    [colors, columns, dimensions.height, dimensions.width, rows, tonedColors]
  )

  const pixelGrid = useMemo(
    () =>
      Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: columns }).map((_, colIndex) => ({
          rowIndex,
          colIndex,
        }))
      ),
    [rows, columns]
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-auto",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      {pixelGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map(({ colIndex }) => (
            <PixelDot
              key={`${colIndex}-${rowIndex}`}
              id={`${trailId.current}-pixel-${colIndex}-${rowIndex}`}
              col={colIndex}
              row={rowIndex}
              size={pixelSize}
              fadeDuration={fadeDuration}
              delay={delay}
              getGradient={getPixelGradient}
              className={pixelClassName}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default PixelTrail

interface PixelDotProps {
  id: string
  col: number
  row: number
  size: number
  fadeDuration: number
  delay: number
  getGradient?: (col: number, row: number) => string | undefined
  className?: string
}

const PixelDot: React.FC<PixelDotProps> = React.memo(
  ({ id, col, row, size, fadeDuration, delay, getGradient, className }) => {
    const controls = useAnimationControls()
    const nodeRef = useRef<HTMLDivElement | null>(null)

    const animatePixel = useCallback(() => {
      if (nodeRef.current && getGradient) {
        const gradient = getGradient(col, row)
        if (gradient) nodeRef.current.style.backgroundImage = gradient
      }

      controls.start({
        opacity: [1, 0],
        transition: { duration: fadeDuration / 1000, delay: delay / 1000 },
      })
    }, [col, delay, fadeDuration, getGradient, row, controls])

    const ref = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          nodeRef.current = node
          pixelAnimateMap.set(node, animatePixel)
        }
      },
      [animatePixel]
    )

    return (
      <motion.div
        id={id}
        ref={ref}
        className={cn("cursor-pointer-none", className)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        initial={{ opacity: 0 }}
        animate={controls}
        exit={{ opacity: 0 }}
      />
    )
  }
)

PixelDot.displayName = "PixelDot"

const darkenHex = (hex: string, factor: number) => {
  const normalized = hex.startsWith("#") ? hex.slice(1) : hex
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((ch) => `${ch}${ch}`)
          .join("")
      : normalized

  if (full.length !== 6) return hex

  const toHex = (value: number) =>
    Math.round(value).toString(16).padStart(2, "0")

  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)

  const clamp = (value: number) => Math.min(255, Math.max(0, value))

  return `#${toHex(clamp(r * factor))}${toHex(clamp(g * factor))}${toHex(
    clamp(b * factor)
  )}`
}
