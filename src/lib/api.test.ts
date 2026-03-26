import { describe, it, expect } from "vitest"
import { API_BASE_URL, api } from "./api"

describe("api client", () => {
  it("exposes axios instance with base URL aligned to API_BASE_URL", () => {
    expect(api.defaults.baseURL).toBe(API_BASE_URL)
    expect(API_BASE_URL).toMatch(/\/api$/)
  })
})
