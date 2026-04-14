import { useLayoutEffect, useState } from "react"
import type { RefObject } from "react"

interface Dimensions {
  width: number
  height: number
}

export function useDimensions(
  ref: RefObject<HTMLElement | SVGElement | null>
): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const updateDimensions = () => {
      const node = ref.current
      if (!node) return
      const { width, height } = node.getBoundingClientRect()
      setDimensions((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height }
      )
    }

    updateDimensions()

    const ro = new ResizeObserver(updateDimensions)
    ro.observe(el)

    window.addEventListener("resize", updateDimensions)

    return () => {
      ro.disconnect()
      window.removeEventListener("resize", updateDimensions)
    }
  }, [ref])

  return dimensions
}
