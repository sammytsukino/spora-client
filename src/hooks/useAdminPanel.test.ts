import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, waitFor, act } from "@testing-library/react"

const metricsPayload = {
  users: { total: 2, active: 2 },
  floras: { total: 3, blossoming: 1, sealed: 1, hidden: 1 },
  reports: { total: 1, pending: 0 },
  flaggedContent: 0,
  growth: {
    usersLast7Days: 1,
    usersPrev7Days: 1,
    usersGrowth: 0,
    florasLast7Days: 1,
    florasPrev7Days: 1,
    florasGrowth: 0,
  },
}

const fetchAdminMetrics = vi.hoisted(() => vi.fn())
const fetchAdminUsageCharts = vi.hoisted(() => vi.fn())
const fetchAdminUsers = vi.hoisted(() => vi.fn())
const fetchAdminReports = vi.hoisted(() => vi.fn())
const fetchAdminFlagged = vi.hoisted(() => vi.fn())
const fetchAdminFloras = vi.hoisted(() => vi.fn())
const updateUserRole = vi.hoisted(() => vi.fn())
const batchUpdateFloras = vi.hoisted(() => vi.fn())
const updateUserStatus = vi.hoisted(() => vi.fn())
const updateReportStatus = vi.hoisted(() => vi.fn())
const unsignUser = vi.hoisted(() => vi.fn())
const hideFlora = vi.hoisted(() => vi.fn())
const batchUpdateReports = vi.hoisted(() => vi.fn())
const batchUpdateUserStatus = vi.hoisted(() => vi.fn())

vi.mock("@/lib/admin-api", () => ({
  fetchAdminMetrics,
  fetchAdminUsageCharts,
  fetchAdminUsers,
  fetchAdminReports,
  fetchAdminFlagged,
  fetchAdminFloras,
  updateUserRole,
  updateUserStatus,
  updateReportStatus,
  unsignUser,
  hideFlora,
  batchUpdateFloras,
  batchUpdateReports,
  batchUpdateUserStatus,
}))

import { useAdminPanel } from "./useAdminPanel"

beforeEach(() => {
  fetchAdminMetrics.mockResolvedValue(metricsPayload)
  fetchAdminUsageCharts.mockResolvedValue({
    florasByDay: [{ label: "Mon", value: 1 }],
    newUsersByWeek: [{ label: "W1", value: 2 }],
  })
  fetchAdminUsers.mockResolvedValue([
    {
      _id: "u1",
      username: "a",
      email: "a@a.com",
      role: "cultivator" as const,
      accountStatus: "active" as const,
      createdAt: "2025-01-01T00:00:00Z",
      florasCount: 0,
    },
  ])
  fetchAdminReports.mockResolvedValue([])
  fetchAdminFlagged.mockResolvedValue([])
  fetchAdminFloras.mockResolvedValue([])
  updateUserRole.mockResolvedValue(undefined)
  batchUpdateFloras.mockResolvedValue({ updated: 0, failed: [] })
  updateUserStatus.mockResolvedValue(undefined)
  updateReportStatus.mockResolvedValue({ _id: "r1" } as never)
  unsignUser.mockResolvedValue({ florasAnonymized: 0 })
  hideFlora.mockResolvedValue(undefined)
  batchUpdateReports.mockResolvedValue({ updated: 0, failed: [] })
  batchUpdateUserStatus.mockResolvedValue({ updated: 0, failed: [] })
})

describe("useAdminPanel", () => {
  it("loads admin data on mount", async () => {
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.metrics?.totalUsers).toBe(2)
    expect(result.current.users.length).toBe(1)
    expect(result.current.florasByDay.length).toBe(1)
  })

  it("onUserRoleChange calls API and updates local state", async () => {
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.onUserRoleChange("u1", "admin")
    })

    expect(updateUserRole).toHaveBeenCalledWith("u1", "admin")
    expect(result.current.users[0]?.role).toBe("admin")
  })

  it("onUserStatusChange and onBatchFloras call admin API", async () => {
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.onUserStatusChange("u1", "suspended")
    })
    expect(updateUserStatus).toHaveBeenCalledWith("u1", "suspended")

    await act(async () => {
      await result.current.onBatchFloras(["f1"], "hide")
    })
    expect(batchUpdateFloras).toHaveBeenCalledWith(["f1"], "hide")
  })

  it("invokes report, flagged, unsign, hide, and batch user handlers", async () => {
    fetchAdminReports.mockResolvedValueOnce([
      {
        _id: "r1",
        reportedBy: { username: "rep" },
        reportedFlora: { _id: "f1", title: "T" },
        category: "spam",
        reason: "x",
        status: "pending",
        createdAt: "2025-01-01T00:00:00Z",
      },
    ])
    fetchAdminFlagged.mockResolvedValueOnce([
      {
        _id: "f1",
        title: "T",
        text: "body",
        reportCount: 1,
        createdAt: "2025-01-01T00:00:00Z",
      },
    ])

    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.onReportStatusChange("r1", "resolved")
    })
    expect(updateReportStatus).toHaveBeenCalled()

    await act(async () => {
      await result.current.onFlaggedStatusChange("x", "approved")
    })

    await act(async () => {
      await result.current.onUnsignUser(result.current.users[0]!)
    })
    expect(unsignUser).toHaveBeenCalled()

    await act(async () => {
      await result.current.onHideFlora("f1")
    })
    expect(hideFlora).toHaveBeenCalledWith("f1")

    await act(async () => {
      await result.current.onBatchReports(["r1"], "dismiss")
    })
    expect(batchUpdateReports).toHaveBeenCalled()

    await act(async () => {
      await result.current.onBatchUsers(["u1"], "activate")
    })
    expect(batchUpdateUserStatus).toHaveBeenCalled()
  })
})
