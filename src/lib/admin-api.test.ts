import { describe, it, expect, vi, beforeEach } from "vitest"

const get = vi.hoisted(() => vi.fn())
const patch = vi.hoisted(() => vi.fn())
const post = vi.hoisted(() => vi.fn())

vi.mock("./api", () => ({
  api: { get, patch, post },
}))

import {
  fetchAdminMetrics,
  fetchAdminUsageCharts,
  fetchAdminUsers,
  updateUserRole,
  batchUpdateFloras,
} from "./admin-api"

beforeEach(() => {
  get.mockReset()
  patch.mockReset()
  post.mockReset()
})

describe("admin-api", () => {
  it("fetchAdminMetrics GET /admin/metrics", async () => {
    const payload = {
      users: { total: 1, active: 1 },
      floras: { total: 2, blossoming: 1, sealed: 1, hidden: 0 },
      reports: { total: 0, pending: 0 },
    }
    get.mockResolvedValueOnce({ data: payload })
    const m = await fetchAdminMetrics()
    expect(get).toHaveBeenCalledWith("/admin/metrics")
    expect(m.users.total).toBe(1)
  })

  it("fetchAdminUsageCharts GET /admin/usage/charts", async () => {
    get.mockResolvedValueOnce({ data: { florasByDay: [], newUsersByWeek: [] } })
    const c = await fetchAdminUsageCharts()
    expect(get).toHaveBeenCalledWith("/admin/usage/charts")
    expect(c.florasByDay).toEqual([])
  })

  it("fetchAdminUsers passes query params", async () => {
    get.mockResolvedValueOnce({ data: [] })
    await fetchAdminUsers({ limit: 10, role: "admin" })
    expect(get).toHaveBeenCalledWith("/admin/users", {
      params: { limit: 10, role: "admin" },
    })
  })

  it("updateUserRole PATCH admin user role", async () => {
    patch.mockResolvedValueOnce({ data: {} })
    await updateUserRole("id1", "cultivator", "because")
    expect(patch).toHaveBeenCalledWith("/admin/users/id1/role", {
      role: "cultivator",
      reason: "because",
    })
  })

  it("batchUpdateFloras PATCH batch body", async () => {
    patch.mockResolvedValueOnce({ data: { updated: 1, failed: [] } })
    await batchUpdateFloras(["a"], "hide")
    expect(patch).toHaveBeenCalledWith("/admin/floras/batch", {
      ids: ["a"],
      action: "hide",
    })
  })
})
