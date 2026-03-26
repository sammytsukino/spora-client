import { describe, it, expect, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import type { RefObject } from "react"
import { useDimensions } from "./use-dimensions"

describe("useDimensions", () => {
  it("reads bounding rect from ref target after mount", async () => {
    const el = document.createElement("div")
    vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
      width: 100,
      height: 50,
      top: 0,
      left: 0,
      bottom: 50,
      right: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })

    const ref: RefObject<HTMLElement | null> = { current: el }

    const { result } = renderHook(() => useDimensions(ref))

    await waitFor(() => {
      expect(result.current.width).toBe(100)
      expect(result.current.height).toBe(50)
    })
  })
})
