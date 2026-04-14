import { useState, useEffect, useCallback } from "react";
import {
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
} from "@/lib/admin-api";
import type {
  AdminMetricsResponse,
  AdminUsageChartsResponse,
  ApiUser,
  ApiReport,
  ApiFlaggedFlora,
  ApiFlora,
} from "@/lib/admin-api";
import type {
  AdminMetricsData,
  AdminReport,
  AdminUserSummary,
  AdminFlaggedItem,
  AdminUsageDataPoint,
  ReportStatus,
  UserRole,
  UserStatus,
  FlaggedStatus,
} from "@/data/admin-data";
import { getMutationErrorMessage } from "@/lib/mutationError";

function mapApiUser(u: {
  _id: string;
  username: string;
  email: string;
  role: "cultivator" | "admin";
  accountStatus: string;
  createdAt: string;
  florasCount?: number;
}): AdminUserSummary {
  const status: UserStatus =
    u.accountStatus === "deleted" ? "banned" : (u.accountStatus as UserStatus);
  const role: UserRole = u.role === "cultivator" ? "cultivator" : "admin";
  return {
    id: u._id,
    username: u.username.startsWith("@") ? u.username : `@${u.username}`,
    email: u.email,
    role,
    status,
    florasCount: u.florasCount ?? 0,
    joinedAt: new Date(u.createdAt).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}

function mapApiReport(r: ApiReport): AdminReport {
  const reporterUsername =
    r.source === "language_screen"
      ? "System"
      : typeof r.reportedBy === "object" && r.reportedBy?.username
        ? r.reportedBy.username.startsWith("@")
          ? r.reportedBy.username
          : `@${r.reportedBy.username}`
        : "@Unknown";
  const flora = (r.reportedFlora ?? r.reportedFloraId) as { _id?: string } | string;
  const targetId =
    typeof flora === "object"
      ? flora?._id
        ? String(flora._id)
        : ""
      : typeof flora === "string"
        ? flora
        : "";
  const categoryMap: Record<string, AdminReport["type"]> = {
    spam: "spam",
    harassment: "abuse",
    inappropriate: "abuse",
    copyright: "copyright",
    language_review: "language_review",
    other: "other",
  };
  const type = categoryMap[r.category] ?? "other";
  const statusMap: Record<string, ReportStatus> = {
    pending: "pending",
    reviewing: "reviewing",
    resolved: "resolved",
    dismissed: "dismissed",
  };
  const status = (statusMap[r.status] ?? "pending") as ReportStatus;
  return {
    id: String(r._id),
    type,
    status,
    reporterUsername,
    targetType: "flora",
    targetId,
    reason: r.reason,
    createdAt: r.createdAt,
    source: r.source,
  };
}

function mapApiFlagged(f: {
  _id: string;
  title: string;
  text: string;
  author?: { username?: string };
  reportCount: number;
  createdAt: string;
}): AdminFlaggedItem {
  return {
    id: f._id,
    contentType: "flora",
    contentId: f._id,
    contentPreview: `${f.title} — excerpt: "${(f.text || "").slice(0, 80)}..."`,
    reason: `${f.reportCount} report(s) pending`,
    reportedBy: "@Community",
    status: "pending",
    flaggedAt: f.createdAt,
  };
}

type LoadOptions = { quiet?: boolean };

export function useAdminPanel() {
  const [metrics, setMetrics] = useState<AdminMetricsData | null>(null);
  const [florasByDay, setFlorasByDay] = useState<AdminUsageDataPoint[]>([]);
  const [newUsersByWeek, setNewUsersByWeek] = useState<AdminUsageDataPoint[]>([]);
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [flagged, setFlagged] = useState<AdminFlaggedItem[]>([]);
  const [allFloras, setAllFloras] = useState<ApiFlora[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyFetchedData = useCallback(
    (
      results: PromiseSettledResult<
        | AdminMetricsResponse
        | AdminUsageChartsResponse
        | ApiUser[]
        | ApiReport[]
        | ApiFlaggedFlora[]
        | ApiFlora[]
      >[]
    ) => {
      const [
        metricsRes,
        chartsRes,
        usersRes,
        reportsRes,
        flaggedRes,
        florasRes,
      ] = results.map((r) => (r.status === "fulfilled" ? r.value : null)) as [
        AdminMetricsResponse | null,
        AdminUsageChartsResponse | null,
        ApiUser[] | null,
        ApiReport[] | null,
        ApiFlaggedFlora[] | null,
        ApiFlora[] | null,
      ];

      const errs = results
        .map((r) => (r.status === "rejected" ? r.reason : null))
        .filter(Boolean);
      if (errs.length > 0) {
        const firstErr = errs[0] as Error & { response?: { status?: number } };
        const msg =
          firstErr?.response?.status === 404
            ? "Admin API not found (404). Ensure the backend is running and uses the latest routes."
            : firstErr instanceof Error
              ? firstErr.message
              : "Failed to load admin data";
        setError(msg);
      } else {
        setError(null);
      }

      if (metricsRes && "users" in metricsRes && "floras" in metricsRes) {
        setMetrics({
          totalUsers: metricsRes.users.total,
          totalFloras: metricsRes.floras.total,
          totalBlossoming: metricsRes.floras.blossoming ?? 0,
          totalSealed: metricsRes.floras.sealed ?? 0,
          totalHidden: metricsRes.floras.hidden ?? 0,
          pendingReports: metricsRes.reports.pending,
          flaggedContent: metricsRes.flaggedContent ?? 0,
          growth: metricsRes.growth,
        });
      } else if (metricsRes && "totalUsers" in metricsRes) {
        const m = metricsRes as {
          totalUsers?: number;
          totalFloras?: number;
          pendingReports?: number;
        };
        setMetrics({
          totalUsers: m.totalUsers ?? 0,
          totalFloras: m.totalFloras ?? 0,
          totalBlossoming: 0,
          totalSealed: 0,
          totalHidden: 0,
          pendingReports: m.pendingReports ?? 0,
          flaggedContent: 0,
        });
      }
      if (chartsRes?.florasByDay) setFlorasByDay(chartsRes.florasByDay);
      if (chartsRes?.newUsersByWeek) setNewUsersByWeek(chartsRes.newUsersByWeek);
      if (Array.isArray(usersRes)) setUsers(usersRes.map(mapApiUser));
      if (Array.isArray(reportsRes)) setReports(reportsRes.map(mapApiReport));
      if (Array.isArray(flaggedRes)) setFlagged(flaggedRes.map(mapApiFlagged));
      if (Array.isArray(florasRes)) setAllFloras(florasRes);
    },
    []
  );

  const load = useCallback(
    async (options?: LoadOptions) => {
      const quiet = options?.quiet === true;
      if (!quiet) {
        setLoading(true);
        setError(null);
      }
      try {
        const results = await Promise.allSettled([
          fetchAdminMetrics(),
          fetchAdminUsageCharts(),
          fetchAdminUsers({ limit: 500 }),
          fetchAdminReports(),
          fetchAdminFlagged(),
          fetchAdminFloras({ limit: 500 }),
        ]);
        applyFetchedData(results);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load admin data";
        setError(msg);
      } finally {
        if (!quiet) setLoading(false);
      }
    },
    [applyFetchedData]
  );

  useEffect(() => {
    void load();
  }, [load]);

  const handleUserRoleChange = useCallback(async (userId: string, role: UserRole) => {
    const apiRole = role === "creator" || role === "cultivator" ? "cultivator" : "admin";
    try {
      await updateUserRole(userId, apiRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: apiRole as UserRole } : u))
      );
    } catch (e) {
      setError(getMutationErrorMessage(e));
      await load({ quiet: true });
      throw e;
    }
  }, [load]);

  const handleUserStatusChange = useCallback(
    async (userId: string, status: UserStatus) => {
      const apiStatus =
        status === "banned" || status === "deleted" ? "deleted" : status;
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status } : u))
      );
      try {
        await updateUserStatus(userId, apiStatus);
      } catch (e) {
        setError(getMutationErrorMessage(e));
        await load({ quiet: true });
        throw e;
      }
      await load({ quiet: true });
    },
    [load]
  );

  const handleReportStatusChange = useCallback(
    async (reportId: string, status: ReportStatus) => {
      const apiStatus =
        status === "reviewed" ? "reviewing" : (status as "pending" | "resolved" | "dismissed");
      const idKey = String(reportId).trim();
      setReports((prev) =>
        prev.map((r) => (r.id === idKey ? { ...r, status } : r))
      );
      try {
        const raw = await updateReportStatus(idKey, apiStatus);
        const mapped = mapApiReport(raw as ApiReport);
        setReports((prev) => prev.map((r) => (r.id === idKey ? mapped : r)));
      } catch (e) {
        setError(getMutationErrorMessage(e));
        await load({ quiet: true });
        throw e;
      }
    },
    [load]
  );

  const handleFlaggedStatusChange = useCallback(
    async (_itemId: string, _status: FlaggedStatus) => {
      await load({ quiet: true });
    },
    [load]
  );

  const handleUnsignUser = useCallback(
    async (user: AdminUserSummary) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, florasCount: 0 } : u))
      );
      try {
        await unsignUser(user.id);
      } catch (e) {
        setError(getMutationErrorMessage(e));
        await load({ quiet: true });
        throw e;
      }
      await load({ quiet: true });
    },
    [load]
  );

  const handleHideFlora = useCallback(
    async (floraId: string) => {
      setFlagged((prev) => prev.filter((f) => f.contentId !== floraId));
      setReports((prev) => prev.filter((r) => r.targetId !== floraId));
      try {
        await hideFlora(floraId);
      } catch (e) {
        setError(getMutationErrorMessage(e));
        await load({ quiet: true });
        throw e;
      }
      await load({ quiet: true });
    },
    [load]
  );

  const handleBatchFloras = useCallback(
    async (floraIds: string[], action: "hide" | "unhide" | "delete") => {
      if (action === "delete") {
        setFlagged((prev) => prev.filter((f) => !floraIds.includes(f.contentId)));
        setReports((prev) => prev.filter((r) => !floraIds.includes(r.targetId)));
        setAllFloras((prev) => prev.filter((f) => !floraIds.includes(f._id)));
      } else if (action === "hide") {
        setFlagged((prev) => prev.filter((f) => !floraIds.includes(f.contentId)));
        setAllFloras((prev) =>
          prev.map((f) =>
            floraIds.includes(f._id) ? { ...f, isHidden: true } : f
          )
        );
      } else {
        setAllFloras((prev) =>
          prev.map((f) =>
            floraIds.includes(f._id) ? { ...f, isHidden: false } : f
          )
        );
      }
      try {
        const result = await batchUpdateFloras(floraIds, action);
        const failed = result.failed?.length ?? 0;
        const updated = result.updated ?? 0;
        if (failed > 0) {
          await load({ quiet: true });
          if (updated === 0) {
            setError(`${failed} flora(s) could not be updated.`);
          } else {
            setError(`${failed} flora(s) failed; ${updated} were updated.`);
          }
          return;
        }
      } catch (e) {
        setError(getMutationErrorMessage(e));
        await load({ quiet: true });
        throw e;
      }
      await load({ quiet: true });
    },
    [load]
  );

  const handleBatchReports = useCallback(
    async (reportIds: string[], action: "resolve" | "dismiss") => {
      const trimmed = reportIds.map((id) => String(id).trim()).filter(Boolean);
      const newStatus: ReportStatus = action === "resolve" ? "resolved" : "dismissed";
      setReports((prev) =>
        prev.map((r) =>
          trimmed.includes(r.id) ? { ...r, status: newStatus } : r
        )
      );
      try {
        const result = await batchUpdateReports(trimmed, action);
        const failed = result.failed?.length ?? 0;
        const updated = result.updated ?? 0;
        if (failed > 0) {
          await load({ quiet: true });
          if (updated === 0) {
            setError(
              `${failed} report(s) could not be updated. Check that selections are valid.`
            );
          } else {
            setError(`${failed} report(s) failed; ${updated} were updated.`);
          }
          return;
        }
      } catch (e) {
        setError(getMutationErrorMessage(e));
        await load({ quiet: true });
        throw e;
      }
      await load({ quiet: true });
    },
    [load]
  );

  const handleBatchUsers = useCallback(
    async (userIds: string[], batchAction: "suspend" | "ban" | "activate") => {
      const nextStatus: UserStatus =
        batchAction === "suspend"
          ? "suspended"
          : batchAction === "ban"
            ? "banned"
            : "active";
      setUsers((prev) =>
        prev.map((u) =>
          userIds.includes(u.id) ? { ...u, status: nextStatus } : u
        )
      );
      try {
        const result = await batchUpdateUserStatus(userIds, batchAction);
        const failed = result.failed?.length ?? 0;
        const updated = result.updated ?? 0;
        if (failed > 0) {
          await load({ quiet: true });
          if (updated === 0) {
            setError(`${failed} user(s) could not be updated.`);
          } else {
            setError(`${failed} user(s) failed; ${updated} were updated.`);
          }
          return;
        }
      } catch (e) {
        setError(getMutationErrorMessage(e));
        await load({ quiet: true });
        throw e;
      }
      await load({ quiet: true });
    },
    [load]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    metrics,
    florasByDay,
    newUsersByWeek,
    users,
    reports,
    flagged,
    allFloras,
    loading,
    error,
    clearError,
    refresh: () => load(),
    onUserRoleChange: handleUserRoleChange,
    onUserStatusChange: handleUserStatusChange,
    onReportStatusChange: handleReportStatusChange,
    onFlaggedStatusChange: handleFlaggedStatusChange,
    onUnsignUser: handleUnsignUser,
    onHideFlora: handleHideFlora,
    onBatchFloras: handleBatchFloras,
    onBatchReports: handleBatchReports,
    onBatchUsers: handleBatchUsers,
  };
}
