import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

const listFloras = vi.hoisted(() => vi.fn())

vi.mock("@/lib/floras", () => ({
  listFloras,
}))

vi.mock("@/lib/cloudinary", () => ({
  getOptimizedThumbnailUrl: (u: string) => u,
}))

import { useFloraThumbnails } from "./useFloraThumbnails"

beforeEach(() => {
  listFloras.mockReset()
})

describe("useFloraThumbnails", () => {
  it("loads thumbnails from API when enough results", async () => {
    listFloras.mockResolvedValue([
      {
        _id: "1",
        title: "a",
        text: "t",
        thumbnailUrl: "https://example.com/a.png",
      },
    ])
    const { result } = renderHook(() => useFloraThumbnails(10))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.items.length).toBeGreaterThan(0)
  })

  it("falls back on error", async () => {
    listFloras.mockRejectedValue(new Error("fail"))
    const { result } = renderHook(() => useFloraThumbnails(10))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.items.length).toBeGreaterThan(0)
  })
})
