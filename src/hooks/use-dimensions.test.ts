import { describe, it, expect, vi, afterEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"
import type { RefObject } from "react"
import { useDimensions } from "./use-dimensions"

function rect(w: number, h: number) {
  return {
    width: w,
    height: h,
    top: 0,
    left: 0,
    bottom: h,
    right: w,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }
}

describe("useDimensions", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("keeps zero size when ref is null", () => {
    const ref: RefObject<HTMLElement | null> = { current: null }
    const { result } = renderHook(() => useDimensions(ref))
    expect(result.current).toEqual({ width: 0, height: 0 })
  })

  it("reads bounding rect from ref target after mount", async () => {
    const el = document.createElement("div")
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue(rect(100, 50))

    const ref: RefObject<HTMLElement | null> = { current: el }

    const { result } = renderHook(() => useDimensions(ref))

    await waitFor(() => {
      expect(result.current.width).toBe(100)
      expect(result.current.height).toBe(50)
    })
  })

  it("skips state update when rect unchanged and reacts to resize", async () => {
    const el = document.createElement("div")
    const spy = vi.spyOn(el, "getBoundingClientRect")
    spy.mockReturnValue(rect(80, 40))

    const ref: RefObject<HTMLElement | null> = { current: el }
    const { result } = renderHook(() => useDimensions(ref))

    await waitFor(() => {
      expect(result.current).toEqual({ width: 80, height: 40 })
    })

    spy.mockReturnValue(rect(80, 40))
    await act(async () => {
      window.dispatchEvent(new Event("resize"))
    })
    expect(result.current).toEqual({ width: 80, height: 40 })

    spy.mockReturnValue(rect(200, 40))
    await act(async () => {
      window.dispatchEvent(new Event("resize"))
    })

    await waitFor(() => {
      expect(result.current).toEqual({ width: 200, height: 40 })
    })
  })
})
