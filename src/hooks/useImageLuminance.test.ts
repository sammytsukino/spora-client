import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useImageLuminance } from "./useImageLuminance"

describe("useImageLuminance", () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)

    class MockImage {
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      crossOrigin = ""
      naturalWidth = 10
      naturalHeight = 10
      set src(_: string) {
        queueMicrotask(() => {
          this.onload?.()
        })
      }
    }

    vi.stubGlobal("Image", MockImage)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("returns null when no src", () => {
    const { result } = renderHook(() => useImageLuminance(undefined))
    expect(result.current).toBeNull()
  })

  it("sets dark when canvas context missing after image loads", async () => {
    const { result } = renderHook(() =>
      useImageLuminance("https://example.com/x.png")
    )
    await waitFor(() => {
      expect(result.current).toBe("dark")
    })
  })
})
