import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  clearFloraPreview,
  readFloraPreview,
  stashFloraPreview,
  type FloraPreview,
} from "./floraPreviewCache"

const samplePreview: FloraPreview = {
  id: "flora123",
  generation: "GEN_0",
  image: "https://example.com/t.png",
  title: "Bloom",
  excerpt: "Preview excerpt",
  author: "@grower",
  seed: "#ABC123",
}

describe("floraPreviewCache", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it("stashes and reads preview by flora id", () => {
    stashFloraPreview(samplePreview)
    expect(readFloraPreview("flora123")).toEqual(samplePreview)
  })

  it("returns null for unknown ids", () => {
    expect(readFloraPreview("missing")).toBeNull()
  })

  it("clears preview for an id", () => {
    stashFloraPreview(samplePreview)
    clearFloraPreview("flora123")
    expect(readFloraPreview("flora123")).toBeNull()
  })

  it("expires previews after ttl", () => {
    vi.useFakeTimers()
    stashFloraPreview(samplePreview)
    vi.advanceTimersByTime(5 * 60 * 1000 + 1)
    expect(readFloraPreview("flora123")).toBeNull()
  })

  it("ignores invalid stored payloads", () => {
    localStorage.setItem("spora:flora-preview:bad", "{not-json")
    expect(readFloraPreview("bad")).toBeNull()
  })
})
