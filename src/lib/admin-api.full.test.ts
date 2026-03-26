import { describe, it, expect, vi, beforeEach } from "vitest"

const get = vi.hoisted(() => vi.fn())
const patch = vi.hoisted(() => vi.fn())
const post = vi.hoisted(() => vi.fn())

vi.mock("./api", () => ({
  api: { get, patch, post },
}))

import {
  fetchAdminFlagged,
  fetchAdminFloras,
  updateUserStatus,
  updateReportStatus,
  unsignUser,
  hideFlora,
  unhideFlora,
  batchUpdateReports,
  batchUpdateUserStatus,
} from "./admin-api"

beforeEach(() => {
  get.mockReset()
  patch.mockReset()
  post.mockReset()
})

describe("admin-api remaining endpoints", () => {
  it("fetchAdminFlagged", async () => {
    get.mockResolvedValueOnce({ data: [] })
    await fetchAdminFlagged()
    expect(get).toHaveBeenCalledWith("/admin/flagged")
  })

  it("fetchAdminFloras builds query string", async () => {
    get.mockResolvedValueOnce({ data: [] })
    await fetchAdminFloras({ limit: 5, hidden: true })
    expect(get).toHaveBeenCalledWith("/admin/floras?limit=5&hidden=true")
  })

  it("updateUserStatus", async () => {
    patch.mockResolvedValueOnce({})
    await updateUserStatus("u1", "suspended", "spam")
    expect(patch).toHaveBeenCalledWith("/admin/users/u1/status", {
      status: "suspended",
      reason: "spam",
    })
  })

  it("updateReportStatus", async () => {
    patch.mockResolvedValueOnce({ data: { _id: "r1" } })
    const r = await updateReportStatus("r1", "resolved", "ok")
    expect(patch).toHaveBeenCalledWith("/admin/reports/r1", {
      status: "resolved",
      adminNotes: "ok",
    })
    expect(r._id).toBe("r1")
  })

  it("unsignUser", async () => {
    post.mockResolvedValueOnce({ data: { florasAnonymized: 2 } })
    const out = await unsignUser("u1", "reason")
    expect(post).toHaveBeenCalledWith("/admin/users/u1/unsign", {
      reason: "reason",
    })
    expect(out.florasAnonymized).toBe(2)
  })

  it("hideFlora and unhideFlora", async () => {
    patch.mockResolvedValue({})
    await hideFlora("f1", "bad")
    expect(patch).toHaveBeenCalledWith("/admin/floras/f1/status", {
      isHidden: true,
      reason: "bad",
    })
    await unhideFlora("f1")
    expect(patch).toHaveBeenCalledWith("/admin/floras/f1/status", {
      isHidden: false,
      reason: undefined,
    })
  })

  it("batchUpdateReports and batchUpdateUserStatus", async () => {
    patch.mockResolvedValueOnce({ data: { updated: 1, failed: [] } })
    await batchUpdateReports(["a"], "resolve")
    expect(patch).toHaveBeenCalledWith("/admin/reports/batch", {
      ids: ["a"],
      action: "resolve",
    })
    patch.mockResolvedValueOnce({ data: { updated: 1, failed: [] } })
    await batchUpdateUserStatus(["u"], "ban")
    expect(patch).toHaveBeenCalledWith("/admin/users/batch", {
      ids: ["u"],
      action: "ban",
    })
  })
})
