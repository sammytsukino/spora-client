import { describe, it, expect } from "vitest"
import { validatePasswordClient, PASSWORD_MIN_LENGTH } from "./passwordPolicy"

describe("validatePasswordClient", () => {
  it("accepts a password that satisfies every rule", () => {
    expect(validatePasswordClient("Sp0ra!Garden2026")).toBeNull()
  })

  it("rejects passwords shorter than the minimum", () => {
    expect(validatePasswordClient("Aa1!")).toMatch(
      new RegExp(`at least ${PASSWORD_MIN_LENGTH}`)
    )
  })

  it("rejects passwords without an uppercase letter", () => {
    expect(validatePasswordClient("sp0ra!garden2026")).toMatch(/uppercase/i)
  })

  it("rejects passwords without a lowercase letter", () => {
    expect(validatePasswordClient("SP0RA!GARDEN2026")).toMatch(/lowercase/i)
  })

  it("rejects passwords without a number", () => {
    expect(validatePasswordClient("Spora!Garden")).toMatch(/number/i)
  })

  it("rejects passwords without a special character", () => {
    expect(validatePasswordClient("Sp0raGarden2026")).toMatch(/special/i)
  })

  it("rejects passwords with whitespace", () => {
    expect(validatePasswordClient("Sp0ra! Garden")).toMatch(/spaces/i)
  })
})
