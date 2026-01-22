import { useMemo } from "react"

export default function useDetectBrowser(): string {
  const browserName = useMemo(() => {
    if (typeof window === "undefined") return "Unknown"
    
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
      return "Safari"
    } else if (userAgent.includes("firefox")) {
      return "Firefox"
    } else if (userAgent.includes("chrome")) {
      return "Chrome"
    } else if (userAgent.includes("edge")) {
      return "Edge"
    } else {
      return "Unknown"
    }
  }, [])

  return browserName
}

