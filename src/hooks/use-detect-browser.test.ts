import { describe, it, expect, vi, afterEach } from "vitest"
import { renderHook } from "@testing-library/react"
import useDetectBrowser from "./use-detect-browser"

describe("useDetectBrowser", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("detects Chrome when user agent includes chrome", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
      "Mozilla/5.0 Chrome/120.0"
    )
    const { result } = renderHook(() => useDetectBrowser())
    expect(result.current).toBe("Chrome")
  })

  it("returns Unknown for unrecognized agent", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Bot/1.0")
    const { result } = renderHook(() => useDetectBrowser())
    expect(result.current).toBe("Unknown")
  })

  it("detects Firefox", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
      "Mozilla/5.0 Firefox/120.0"
    )
    const { result } = renderHook(() => useDetectBrowser())
    expect(result.current).toBe("Firefox")
  })

  it("detects Safari (no chrome token)", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
      "Mozilla/5.0 Version/17.0 Safari/605"
    )
    const { result } = renderHook(() => useDetectBrowser())
    expect(result.current).toBe("Safari")
  })

  it("detects Edge when token edge appears", () => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
      "Mozilla/5.0 Edge/12.0"
    )
    const { result } = renderHook(() => useDetectBrowser())
    expect(result.current).toBe("Edge")
  })
})
