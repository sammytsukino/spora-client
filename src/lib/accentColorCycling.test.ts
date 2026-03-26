import { describe, it, expect, vi, afterEach } from "vitest"
import { initAccentColorCycling } from "./accentColorCycling"

describe("initAccentColorCycling", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.documentElement.style.removeProperty("--spora-accent-secondary")
    document.documentElement.style.removeProperty("--spora-accent")
  })

  it("removes accent css vars when cycling disabled", () => {
    document.documentElement.style.setProperty("--spora-accent-secondary", "red")
    initAccentColorCycling()
    expect(
      document.documentElement.style.getPropertyValue("--spora-accent-secondary")
    ).toBe("")
  })

  it("is safe to call twice", () => {
    const raf = vi.spyOn(window, "requestAnimationFrame")
    initAccentColorCycling()
    initAccentColorCycling()
    expect(raf).not.toHaveBeenCalled()
  })
})
