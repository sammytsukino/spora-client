import { describe, it, expect } from "vitest"
import { validatePasswordClient, PASSWORD_MIN_LENGTH } from "./passwordPolicy"
import {
  STRONG_FIXTURE,
  TOO_SHORT_FIXTURE,
  NO_UPPER_FIXTURE,
  NO_LOWER_FIXTURE,
  NO_DIGIT_FIXTURE,
  NO_SPECIAL_FIXTURE,
  WHITESPACE_FIXTURE,
} from "@/test/passwordFixtures"

describe("validatePasswordClient", () => {
  it("accepts a password that satisfies every rule", () => {
    expect(validatePasswordClient(STRONG_FIXTURE)).toBeNull()
  })

  it("rejects passwords shorter than the minimum", () => {
    expect(validatePasswordClient(TOO_SHORT_FIXTURE)).toMatch(
      new RegExp(`at least ${PASSWORD_MIN_LENGTH}`)
    )
  })

  it("rejects passwords without an uppercase letter", () => {
    expect(validatePasswordClient(NO_UPPER_FIXTURE)).toMatch(/uppercase/i)
  })

  it("rejects passwords without a lowercase letter", () => {
    expect(validatePasswordClient(NO_LOWER_FIXTURE)).toMatch(/lowercase/i)
  })

  it("rejects passwords without a number", () => {
    expect(validatePasswordClient(NO_DIGIT_FIXTURE)).toMatch(/number/i)
  })

  it("rejects passwords without a special character", () => {
    expect(validatePasswordClient(NO_SPECIAL_FIXTURE)).toMatch(/special/i)
  })

  it("rejects passwords with whitespace", () => {
    expect(validatePasswordClient(WHITESPACE_FIXTURE)).toMatch(/spaces/i)
  })
})
