import { api } from "./api";

export type ReportCategory = "spam" | "harassment" | "inappropriate" | "other";

export interface CreateReportPayload {
  reportedFloraId: string;
  category: ReportCategory;
  reason: string;
  description?: string;
}

export async function createReport(
  floraId: string,
  category: ReportCategory,
  reason: string,
  description?: string
): Promise<void> {
  await api.post("/reports", {
    reportedFloraId: floraId,
    category,
    reason: reason.slice(0, 100),
    description: description?.slice(0, 500),
  });
}
