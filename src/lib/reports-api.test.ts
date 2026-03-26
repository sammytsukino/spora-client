import { describe, it, expect, vi, beforeEach } from "vitest"

const post = vi.hoisted(() => vi.fn())

vi.mock("./api", () => ({
  api: { post },
}))

import { createReport } from "./reports-api"

beforeEach(() => {
  post.mockReset()
})

describe("createReport", () => {
  it("posts trimmed reason and optional description", async () => {
    post.mockResolvedValueOnce({})
    await createReport(
      "fid",
      "spam",
      "x".repeat(120),
      "d".repeat(600)
    )
    expect(post).toHaveBeenCalledWith("/reports", {
      reportedFloraId: "fid",
      category: "spam",
      reason: "x".repeat(100),
      description: "d".repeat(500),
    })
  })
})
