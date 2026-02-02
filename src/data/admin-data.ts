export interface AdminMetricsData {
  totalUsers: number;
  totalFloras: number;
  totalBlossoming: number;
  totalSealed: number;
  totalHidden: number;
  pendingReports: number;
  flaggedContent: number;
}

export type ReportStatus = "pending" | "reviewed" | "resolved" | "dismissed";
export type ReportType = "spam" | "abuse" | "copyright" | "other";

export interface AdminReport {
  id: string;
  type: ReportType;
  status: ReportStatus;
  reporterUsername: string;
  targetType: "flora" | "user" | "comment";
  targetId: string;
  reason?: string;
  createdAt: string;
}

export type UserRole = "user" | "creator" | "moderator" | "admin";
export type UserStatus = "active" | "suspended" | "banned";

export interface AdminUserSummary {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  florasCount: number;
  joinedAt: string;
}

export type FlaggedStatus = "pending" | "approved" | "removed";

export interface AdminFlaggedItem {
  id: string;
  contentType: "flora" | "comment";
  contentId: string;
  contentPreview?: string;
  reason: string;
  reportedBy: string;
  status: FlaggedStatus;
  flaggedAt: string;
}

export interface AdminUsageDataPoint {
  label: string;
  value: number;
}

export const adminSectionTabs = [
  "Overview",
  "Reports",
  "Pending",
  "Users",
  "Flagged",
] as const;

export type AdminSection = (typeof adminSectionTabs)[number];

export const defaultAdminMetrics: AdminMetricsData = {
  totalUsers: 2847,
  totalFloras: 12403,
  totalBlossoming: 6821,
  totalSealed: 4120,
  totalHidden: 1462,
  pendingReports: 12,
  flaggedContent: 5,
};

export const defaultAdminReports: AdminReport[] = [
  {
    id: "RPT-001",
    type: "spam",
    status: "pending",
    reporterUsername: "@UserA",
    targetType: "flora",
    targetId: "FLR/042",
    reason: "Repetitive content. User has submitted the same flora multiple times.",
    createdAt: "2025-02-01T14:30:00Z",
  },
  {
    id: "RPT-002",
    type: "abuse",
    status: "pending",
    reporterUsername: "@UserB",
    targetType: "user",
    targetId: "usr-7",
    reason: "Harassment in comments and DMs. Please review and consider suspension.",
    createdAt: "2025-01-31T09:15:00Z",
  },
  {
    id: "RPT-003",
    type: "copyright",
    status: "pending",
    reporterUsername: "@RightsHolder",
    targetType: "flora",
    targetId: "FLR/089",
    reason: "Unauthorized use of copyrighted material in generated image.",
    createdAt: "2025-01-30T18:00:00Z",
  },
  {
    id: "RPT-004",
    type: "other",
    status: "reviewed",
    reporterUsername: "@UserC",
    targetType: "flora",
    targetId: "FLR/091",
    reason: "Misleading metadata.",
    createdAt: "2025-01-29T11:00:00Z",
  },
  {
    id: "RPT-005",
    type: "spam",
    status: "resolved",
    reporterUsername: "@ModBot",
    targetType: "user",
    targetId: "usr-12",
    reason: "Bot-like behavior.",
    createdAt: "2025-01-28T16:45:00Z",
  },
];

export const defaultAdminUsers: AdminUserSummary[] = [
  {
    id: "usr-1",
    username: "@Reinyourheart",
    email: "rei@example.com",
    role: "creator",
    status: "active",
    florasCount: 12,
    joinedAt: "2024-06-15",
  },
  {
    id: "usr-2",
    username: "@FranBarreno",
    email: "fran@example.com",
    role: "user",
    status: "active",
    florasCount: 3,
    joinedAt: "2025-01-10",
  },
  {
    id: "usr-3",
    username: "@SporaLab",
    email: "lab@example.com",
    role: "moderator",
    status: "active",
    florasCount: 28,
    joinedAt: "2024-09-01",
  },
  {
    id: "usr-4",
    username: "@GenArtist",
    email: "gen@example.com",
    role: "creator",
    status: "suspended",
    florasCount: 45,
    joinedAt: "2024-07-12",
  },
  {
    id: "usr-5",
    username: "@FloraGen",
    email: "flora@example.com",
    role: "user",
    status: "active",
    florasCount: 2,
    joinedAt: "2025-01-28",
  },
];

export const defaultAdminFlagged: AdminFlaggedItem[] = [
  {
    id: "FLG-001",
    contentType: "flora",
    contentId: "FLR/033",
    contentPreview: "VOID ECHO — excerpt: \"Lloro porque no siento nada...\"",
    reason: "Inappropriate content. Image may violate community guidelines.",
    reportedBy: "@UserX",
    status: "pending",
    flaggedAt: "2025-02-02T10:00:00Z",
  },
  {
    id: "FLG-002",
    contentType: "comment",
    contentId: "cmt-12",
    contentPreview: "Offensive language in thread under FLR/015.",
    reason: "Abuse — hate speech.",
    reportedBy: "@UserY",
    status: "pending",
    flaggedAt: "2025-02-01T16:45:00Z",
  },
  {
    id: "FLG-003",
    contentType: "flora",
    contentId: "FLR/067",
    contentPreview: "DATA MOSS — possible spam.",
    reason: "Spam / low effort.",
    reportedBy: "@ModBot",
    status: "approved",
    flaggedAt: "2025-01-30T09:00:00Z",
  },
];

export const defaultUsageFlorasByDay: AdminUsageDataPoint[] = [
  { label: "Mon", value: 120 },
  { label: "Tue", value: 98 },
  { label: "Wed", value: 145 },
  { label: "Thu", value: 132 },
  { label: "Fri", value: 178 },
  { label: "Sat", value: 210 },
  { label: "Sun", value: 165 },
];

export const defaultUsageNewUsersByWeek: AdminUsageDataPoint[] = [
  { label: "W1", value: 42 },
  { label: "W2", value: 58 },
  { label: "W3", value: 51 },
  { label: "W4", value: 67 },
];
