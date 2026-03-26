import { describe, it, expect } from "vitest"
import { getOptimizedThumbnailUrl } from "./cloudinary"

describe("getOptimizedThumbnailUrl", () => {
  it("returns empty string for undefined", () => {
    expect(getOptimizedThumbnailUrl(undefined)).toBe("")
  })

  it("returns original url when not cloudinary", () => {
    expect(getOptimizedThumbnailUrl("https://example.com/img.png")).toBe(
      "https://example.com/img.png"
    )
  })

  it("injects transform for cloudinary image upload urls", () => {
    const u =
      "https://res.cloudinary.com/demo/image/upload/v1/folder/abc.png"
    const out = getOptimizedThumbnailUrl(u, 100, 80)
    expect(out).toContain("/image/upload/w_100,h_80,c_fill,q_auto,f_auto/")
    expect(out).toContain("folder/abc.png")
  })
})
