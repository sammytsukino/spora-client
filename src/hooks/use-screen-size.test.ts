import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import useScreenSize from "./use-screen-size"

describe("useScreenSize", () => {
  beforeEach(() => {
    vi.stubGlobal("innerWidth", 800)
    vi.stubGlobal("innerHeight", 600)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("exposes dimensions and breakpoint helpers", () => {
    const { result } = renderHook(() => useScreenSize())
    expect(result.current.width).toBe(800)
    expect(result.current.height).toBe(600)
    expect(result.current.lessThan("lg")).toBe(true)
    expect(result.current.greaterThan("sm")).toBe(true)
    expect(result.current.lessThan("not-a-breakpoint")).toBe(false)
    expect(result.current.greaterThan("unknown")).toBe(false)
  })

  it("updates on window resize", () => {
    const { result } = renderHook(() => useScreenSize())
    act(() => {
      vi.stubGlobal("innerWidth", 1200)
      window.dispatchEvent(new Event("resize"))
    })
    expect(result.current.width).toBe(1200)
  })
})
