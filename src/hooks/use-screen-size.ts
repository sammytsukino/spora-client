import { useEffect, useState } from "react"

interface ScreenSize {
  width: number
  height: number
  lessThan: (breakpoint: string) => boolean
  greaterThan: (breakpoint: string) => boolean
}

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
}

export default function useScreenSize(): ScreenSize {
  const [width, setWidth] = useState<number>(window.innerWidth)
  const [height, setHeight] = useState<number>(window.innerHeight)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const lessThan = (breakpoint: string): boolean => {
    const bp = breakpoints[breakpoint as keyof typeof breakpoints]
    return bp ? width < bp : false
  }

  const greaterThan = (breakpoint: string): boolean => {
    const bp = breakpoints[breakpoint as keyof typeof breakpoints]
    return bp ? width > bp : false
  }

  return {
    width,
    height,
    lessThan,
    greaterThan,
  }
}

