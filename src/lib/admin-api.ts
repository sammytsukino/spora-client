import { api } from "./api";

export interface AdminMetricsResponse {
  users: { total: number; active: number };
  floras: {
    total: number;
    blossoming?: number;
    sealed?: number;
    hidden?: number;
  };
  reports: { total: number; pending: number };
  flaggedContent?: number;
  growth?: {
    usersLast7Days: number;
    usersPrev7Days: number;
    usersGrowth: number;
    florasLast7Days: number;
    florasPrev7Days: number;
    florasGrowth: number;
  };
}

export interface ApiFlora {
  _id: string;
  title: string;
  text: string;
  author?: { username?: string };
  authorUsername?: string;
  status?: string;
  isHidden?: boolean;
  thumbnailUrl?: string;
  createdAt?: string;
}

export interface AdminUsageChartsResponse {
  florasByDay: { label: string; value: number }[];
  newUsersByWeek: { label: string; value: number }[];
}

export interface ApiUser {
  _id: string;
  username: string;
  displayName?: string;
  email: string;
  role: "cultivator" | "admin";
  accountStatus: "active" | "suspended" | "deleted";
  createdAt: string;
}

export interface ApiReport {
  _id: string;
  reportedBy: { username?: string } | string | null;
  reportedFlora?: { title?: string; author?: string } | string;
  reportedFloraId?: { title?: string; authorUsername?: string } | string;
  category: string;
  reason: string;
  status: "pending" | "reviewing" | "resolved" | "dismissed";
  createdAt: string;
  source?: "user" | "language_screen";
}

export interface ApiFlaggedFlora {
  _id: string;
  title: string;
  text: string;
  author?: { username?: string; displayName?: string };
  reportCount: number;
  createdAt: string;
}

export interface AdminReportSignalResponse {
  pendingCount: number;
  latestPendingAt: string | null;
}

export async function fetchAdminMetrics(): Promise<AdminMetricsResponse> {
  const { data } = await api.get<AdminMetricsResponse>("/admin/metrics");
  return data;
}

export async function fetchAdminUsageCharts(): Promise<AdminUsageChartsResponse> {
  const { data } = await api.get<AdminUsageChartsResponse>("/admin/usage/charts");
  return data;
}

export async function fetchAdminUsers(params?: {
  limit?: number;
  skip?: number;
  role?: string;
  status?: string;
}): Promise<ApiUser[]> {
  const { data } = await api.get<ApiUser[]>("/admin/users", { params });
  return data;
}

export async function fetchAdminReports(params?: {
  limit?: number;
  skip?: number;
  status?: string;
}): Promise<ApiReport[]> {
  const { data } = await api.get<ApiReport[]>("/admin/reports", { params });
  return data;
}

export async function fetchAdminReportSignal(): Promise<AdminReportSignalResponse> {
  const { data } = await api.get<AdminReportSignalResponse>("/admin/reports/signal");
  return data;
}

export async function fetchAdminFlagged(): Promise<ApiFlaggedFlora[]> {
  const { data } = await api.get<ApiFlaggedFlora[]>("/admin/flagged");
  return data;
}

export async function updateUserRole(
  userId: string,
  role: "cultivator" | "admin",
  reason?: string
): Promise<void> {
  await api.patch(`/admin/users/${userId}/role`, { role, reason });
}

export async function updateUserStatus(
  userId: string,
  status: "active" | "suspended" | "deleted",
  reason?: string
): Promise<void> {
  await api.patch(`/admin/users/${userId}/status`, { status, reason });
}

export async function updateReportStatus(
  reportId: string,
  status: "pending" | "reviewing" | "resolved" | "dismissed",
  adminNotes?: string
): Promise<ApiReport> {
  const { data } = await api.patch<ApiReport>(`/admin/reports/${reportId}`, {
    status,
    adminNotes,
  });
  return data;
}

export async function unsignUser(userId: string, reason?: string): Promise<{ florasAnonymized: number }> {
  const { data } = await api.post<{ florasAnonymized: number }>(`/admin/users/${userId}/unsign`, {
    reason,
  });
  return data;
}

export async function hideFlora(floraId: string, reason?: string): Promise<void> {
  await api.patch(`/admin/floras/${floraId}/status`, { isHidden: true, reason });
}

export async function unhideFlora(floraId: string, reason?: string): Promise<void> {
  await api.patch(`/admin/floras/${floraId}/status`, { isHidden: false, reason });
}

export async function batchUpdateFloras(
  ids: string[],
  action: "hide" | "unhide" | "delete"
): Promise<{ updated: number; failed: string[] }> {
  const { data } = await api.patch<{ updated: number; failed: string[] }>(
    "/admin/floras/batch",
    { ids, action }
  );
  return data;
}

export async function batchUpdateReports(
  ids: string[],
  action: "resolve" | "dismiss"
): Promise<{ updated: number; failed: string[] }> {
  const { data } = await api.patch<{ updated: number; failed: string[] }>(
    "/admin/reports/batch",
    { ids, action }
  );
  return data;
}

export async function batchUpdateUserStatus(
  ids: string[],
  status: "suspend" | "ban" | "activate"
): Promise<{ updated: number; failed: string[] }> {
  const { data } = await api.patch<{ updated: number; failed: string[] }>(
    "/admin/users/batch",
    { ids, action: status }
  );
  return data;
}

export async function fetchAdminFloras(params?: {
  limit?: number;
  skip?: number;
  status?: string;
  hidden?: boolean;
}): Promise<ApiFlora[]> {
  const q = new URLSearchParams();
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.skip) q.set("skip", String(params.skip));
  if (params?.status) q.set("status", params.status);
  if (params?.hidden !== undefined) q.set("hidden", String(params.hidden));
  const { data } = await api.get<ApiFlora[]>(`/admin/floras?${q}`);
  return data;
}
