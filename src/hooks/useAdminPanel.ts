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

function mapApiReport(r: {
  _id: string;
  reportedBy: { username?: string } | string;
  reportedFlora?: { _id?: string; title?: string; author?: string } | string;
  reportedFloraId?: { _id?: string } | string;
  category: string;
  reason: string;
  status: string;
  createdAt: string;
}): AdminReport {
  const reporterUsername =
    typeof r.reportedBy === "object" && r.reportedBy?.username
      ? r.reportedBy.username.startsWith("@")
        ? r.reportedBy.username
        : `@${r.reportedBy.username}`
      : "@Unknown";
  const flora = (r.reportedFlora ?? r.reportedFloraId) as { _id?: string } | string;
  const targetId =
    typeof flora === "object" && flora?._id
      ? String(flora._id)
      : String(flora);
  const categoryMap: Record<string, "spam" | "abuse" | "copyright" | "other"> = {
    spam: "spam",
    harassment: "abuse",
    inappropriate: "abuse",
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
    id: r._id,
    type,
    status,
    reporterUsername,
    targetType: "flora",
    targetId,
    reason: r.reason,
    createdAt: r.createdAt,
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

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        fetchAdminMetrics(),
        fetchAdminUsageCharts(),
        fetchAdminUsers({ limit: 500 }),
        fetchAdminReports(),
        fetchAdminFlagged(),
        fetchAdminFloras({ limit: 500 }),
      ]);

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
        const m = metricsRes as { totalUsers?: number; totalFloras?: number; pendingReports?: number };
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load admin data";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleUserRoleChange = useCallback(
    async (userId: string, role: UserRole) => {
      const apiRole = role === "creator" || role === "cultivator" ? "cultivator" : "admin";
      await updateUserRole(userId, apiRole);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: apiRole as UserRole } : u
        )
      );
    },
    []
  );

  const handleUserStatusChange = useCallback(
    async (userId: string, status: UserStatus) => {
      const apiStatus =
        status === "banned" || status === "deleted" ? "deleted" : status;
      await updateUserStatus(userId, apiStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status } : u
        )
      );
      load();
    },
    [load]
  );

  const handleReportStatusChange = useCallback(
    async (reportId: string, status: ReportStatus) => {
      const apiStatus =
        status === "reviewed" ? "reviewing" : (status as "pending" | "resolved" | "dismissed");
      await updateReportStatus(reportId, apiStatus);
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, status } : r
        )
      );
      load();
    },
    [load]
  );

  const handleFlaggedStatusChange = useCallback(
    async (_itemId: string, _status: FlaggedStatus) => {
      await load();
    },
    [load]
  );

  const handleUnsignUser = useCallback(
    async (user: AdminUserSummary) => {
      await unsignUser(user.id);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, florasCount: 0 } : u
        )
      );
      load();
    },
    [load]
  );

  const handleHideFlora = useCallback(
    async (floraId: string) => {
      await hideFlora(floraId);
      setFlagged((prev) => prev.filter((f) => f.contentId !== floraId));
      setReports((prev) => prev.filter((r) => r.targetId !== floraId));
      load();
    },
    [load]
  );

  const handleBatchFloras = useCallback(
    async (floraIds: string[], action: "hide" | "unhide" | "delete") => {
      await batchUpdateFloras(floraIds, action);
      setFlagged((prev) =>
        action === "delete" ? prev.filter((f) => !floraIds.includes(f.contentId)) : prev
      );
      setReports((prev) =>
        action === "delete" ? prev.filter((r) => !floraIds.includes(r.targetId)) : prev
      );
      setAllFloras((prev) =>
        action === "delete" ? prev.filter((f) => !floraIds.includes(f._id)) : prev
      );
      load();
    },
    [load]
  );

  const handleBatchReports = useCallback(
    async (reportIds: string[], action: "resolve" | "dismiss") => {
      await batchUpdateReports(reportIds, action);
      load();
    },
    [load]
  );

  const handleBatchUsers = useCallback(
    async (userIds: string[], status: "suspend" | "ban" | "activate") => {
      await batchUpdateUserStatus(userIds, status);
      load();
    },
    [load]
  );

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
    refresh: load,
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
