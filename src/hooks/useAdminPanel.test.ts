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

  it("sets 404-specific error when a fetch rejects with 404", async () => {
    fetchAdminMetrics.mockRejectedValueOnce({ response: { status: 404 } })
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.error).toMatch(/404/i)
  })

  it("sets generic message when rejection is not an Error instance", async () => {
    fetchAdminMetrics.mockRejectedValueOnce("weird")
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.error).toBe("Failed to load admin data")
  })

  it("maps legacy metrics payload without nested users/floras", async () => {
    fetchAdminMetrics.mockResolvedValueOnce({
      totalUsers: 9,
      totalFloras: 4,
      pendingReports: 2,
    })
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.metrics?.totalUsers).toBe(9)
    expect(result.current.metrics?.totalFloras).toBe(4)
    expect(result.current.metrics?.totalBlossoming).toBe(0)
  })

  it("maps admin users, reports, and flora targets for list display", async () => {
    fetchAdminUsers.mockResolvedValueOnce([
      {
        _id: "u1",
        username: "@already",
        email: "a@a.com",
        role: "admin" as const,
        accountStatus: "deleted" as const,
        createdAt: "2025-02-02T00:00:00Z",
        florasCount: 5,
      },
    ])
    fetchAdminReports.mockResolvedValueOnce([
      {
        _id: "r1",
        source: "language_screen" as const,
        reportedBy: null,
        reportedFloraId: "flora-string-id",
        category: "copyright",
        reason: "x",
        status: "reviewing",
        createdAt: "2025-01-01T00:00:00Z",
      },
      {
        _id: "r2",
        reportedBy: { username: "plain" },
        reportedFlora: {},
        category: "unknown_cat",
        reason: "y",
        status: "unknown_stat",
        createdAt: "2025-01-02T00:00:00Z",
      },
      {
        _id: "r3",
        reportedBy: "not-an-object",
        reportedFlora: { _id: "nested" },
        category: "spam",
        reason: "z",
        status: "pending",
        createdAt: "2025-01-03T00:00:00Z",
      },
    ])

    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.users[0]?.status).toBe("banned")
    expect(result.current.users[0]?.username).toBe("@already")
    expect(result.current.users[0]?.role).toBe("admin")
    expect(result.current.reports[0]?.reporterUsername).toBe("System")
    expect(result.current.reports[0]?.targetId).toBe("flora-string-id")
    expect(result.current.reports[1]?.reporterUsername).toBe("@plain")
    expect(result.current.reports[1]?.targetId).toBe("")
    expect(result.current.reports[1]?.type).toBe("other")
    expect(result.current.reports[2]?.reporterUsername).toBe("@Unknown")
    expect(result.current.reports[2]?.targetId).toBe("nested")
  })

  it("onUserRoleChange maps creator to cultivator API role", async () => {
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.onUserRoleChange("u1", "creator")
    })
    expect(updateUserRole).toHaveBeenCalledWith("u1", "cultivator")
  })

  it("onUserRoleChange rethrows and triggers quiet reload after failure", async () => {
    updateUserRole.mockRejectedValueOnce(new Error("role denied"))
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await expect(
      act(async () => {
        await result.current.onUserRoleChange("u1", "admin")
      })
    ).rejects.toThrow("role denied")

    await waitFor(() => {
      expect(fetchAdminMetrics.mock.calls.length).toBeGreaterThanOrEqual(2)
    })
  })

  it("onBatchFloras surfaces partial failure counts", async () => {
    fetchAdminFloras.mockResolvedValueOnce([
      { _id: "f1", title: "A", text: "t", authorUsername: "x" },
    ])
    batchUpdateFloras.mockResolvedValueOnce({ updated: 0, failed: ["f1"] })

    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.onBatchFloras(["f1"], "hide")
    })

    await waitFor(() => {
      expect(result.current.error).toMatch(/could not be updated/i)
    })
  })

  it("onBatchFloras surfaces mixed failure and success", async () => {
    batchUpdateFloras.mockResolvedValueOnce({ updated: 2, failed: ["bad"] })

    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.onBatchFloras(["f1"], "unhide")
    })

    await waitFor(() => {
      expect(result.current.error).toMatch(/failed; 2 were updated/i)
    })
  })

  it("onBatchReports surfaces failure messages", async () => {
    batchUpdateReports.mockResolvedValueOnce({ updated: 0, failed: ["r9"] })

    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.onBatchReports(["r9"], "resolve")
    })

    await waitFor(() => {
      expect(result.current.error).toMatch(/report\(s\) could not be updated/i)
    })
  })

  it("onBatchUsers surfaces mixed batch outcome", async () => {
    batchUpdateUserStatus.mockResolvedValueOnce({ updated: 1, failed: ["u2"] })

    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await act(async () => {
      await result.current.onBatchUsers(["u1", "u2"], "suspend")
    })

    await waitFor(() => {
      expect(result.current.error).toMatch(/user\(s\) failed/i)
    })
  })

  it("onUserStatusChange rethrows and triggers quiet reload after failure", async () => {
    updateUserStatus.mockRejectedValueOnce(new Error("status fail"))
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    await expect(
      act(async () => {
        await result.current.onUserStatusChange("u1", "suspended")
      })
    ).rejects.toThrow("status fail")

    await waitFor(() => {
      expect(fetchAdminUsers.mock.calls.length).toBeGreaterThanOrEqual(2)
    })
  })

  it("clearError resets error state", async () => {
    fetchAdminMetrics.mockRejectedValueOnce({ response: { status: 500 } })
    const { result } = renderHook(() => useAdminPanel())

    await waitFor(() => {
      expect(result.current.error).toBeTruthy()
    })

    act(() => {
      result.current.clearError()
    })
    expect(result.current.error).toBeNull()
  })
})
