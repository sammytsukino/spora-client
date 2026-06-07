import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"

const listFloras = vi.hoisted(() => vi.fn())

vi.mock("@/lib/floras", () => ({
  listFloras,
}))

vi.mock("@/lib/cloudinary", () => ({
  cldImage: (u: string | undefined) => u ?? "",
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
        authorUsername: "@grower",
        lineage: { generation: 2 },
        generative: { soilId: "soil-abc" },
      },
    ])
    const { result } = renderHook(() => useFloraThumbnails(10))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.items.length).toBeGreaterThan(0)
    const first = result.current.items[0]!
    expect(first.author).toBe("@grower")
    expect(first.generation).toBe("GEN_2")
    expect(first.seed).toMatch(/^#/)
  })

  it("merges static fallback when API returns fewer than MIN_THUMBNAILS", async () => {
    const few = Array.from({ length: 3 }, (_, i) => ({
      _id: `id-${i}`,
      shortId: `s${i}`,
      title: `T${i}`,
      text: "body",
      thumbnailUrl: `https://example.com/${i}.png`,
      authorUsername: "anon",
      lineage: { generation: Number.NaN },
    }))
    listFloras.mockResolvedValue(few)
    const { result } = renderHook(() => useFloraThumbnails(20))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    expect(result.current.items.length).toBeGreaterThanOrEqual(3)
    const anon = result.current.items.find((x) => x.author === "@anon")
    expect(anon).toBeDefined()
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
