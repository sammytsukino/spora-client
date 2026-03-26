import { describe, it, expect } from "vitest"
import { extractMorphology } from "./morphology"

describe("extractMorphology", () => {
  it("returns null for empty input", () => {
    expect(extractMorphology("")).toBeNull()
    expect(extractMorphology("   ")).toBeNull()
    expect(extractMorphology(null)).toBeNull()
    expect(extractMorphology(undefined)).toBeNull()
  })

  it("returns metrics for plain text", () => {
    const r = extractMorphology("hello world test")
    expect(r).not.toBeNull()
    expect(r?.dominantMood).toBeTypeOf("string")
    expect(r?.sentimentStrength).toBeGreaterThanOrEqual(0)
    expect(r?.vowelDensity).toBeGreaterThan(0)
    expect(r?.avgLengthDelta).toBeGreaterThanOrEqual(0)
  })

  it("handles single word", () => {
    const r = extractMorphology("hello")
    expect(r).not.toBeNull()
    expect(r?.avgLengthDelta).toBe(0)
  })
})
