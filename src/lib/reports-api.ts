import { api } from "./api";

export type ReportCategory = "spam" | "harassment" | "inappropriate" | "other";
const REPORT_REASON_MAX_LENGTH = 100;
const REPORT_DESCRIPTION_MAX_LENGTH = 500;

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
    reason: reason.slice(0, REPORT_REASON_MAX_LENGTH),
    description: description?.slice(0, REPORT_DESCRIPTION_MAX_LENGTH),
  });
}
