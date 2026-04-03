import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  AdminMetricsData,
  AdminUserSummary,
  AdminReport,
  AdminFlaggedItem,
} from "@/data/admin-data";
import {
  PDF_BRAND,
  drawPdfHeader,
  drawSectionLabel,
  drawKeyValue,
  drawRatioBar,
  finalizePdf,
} from "@/lib/pdf-brand";

const { margin, colors } = PDF_BRAND;

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function exportMetricsToPdf(metrics: AdminMetricsData): void {
  const doc = new jsPDF();
  let y = drawPdfHeader(doc, "Metrics overview");

  y = drawSectionLabel(doc, y, "Totals");
  const metricLabels: Record<string, string> = {
    totalUsers: "Users",
    totalFloras: "Floras",
    totalBlossoming: "Blossoming",
    totalSealed: "Sealed",
    totalHidden: "Hidden",
    pendingReports: "Pending reports",
    flaggedContent: "Flagged content",
  };

  for (const key of Object.keys(metricLabels)) {
    const val = metrics[key as keyof AdminMetricsData];
    if (typeof val === "number") {
      y = drawKeyValue(doc, y, `${metricLabels[key]}:`, val.toLocaleString());
    }
  }

  if (metrics.growth) {
    y += 4;
    y = drawSectionLabel(doc, y, "Growth (7 days)");
    const g = metrics.growth;
    y = drawKeyValue(
      doc,
      y,
      "Users:",
      `${g.usersLast7Days} vs ${g.usersPrev7Days} prior week (${g.usersGrowth}%)`
    );
    const uMax = Math.max(g.usersLast7Days, g.usersPrev7Days, 1);
    drawRatioBar(doc, margin, y, 72, 3.5, g.usersLast7Days / uMax);
    y += 8;
    y = drawKeyValue(
      doc,
      y,
      "Floras:",
      `${g.florasLast7Days} vs ${g.florasPrev7Days} prior week (${g.florasGrowth}%)`
    );
    const fMax = Math.max(g.florasLast7Days, g.florasPrev7Days, 1);
    drawRatioBar(doc, margin, y, 72, 3.5, g.florasLast7Days / fMax);
    y += 10;
  }

  finalizePdf(doc, `spora-metrics-${Date.now()}.pdf`);
}

export function exportUsersToPdf(users: AdminUserSummary[]): void {
  const doc = new jsPDF();
  let y = drawPdfHeader(doc, "Users export");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...colors.muted);
  doc.text(`Total rows: ${users.length}`, margin, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [["Username", "Email", "Role", "Status", "Floras", "Joined", "ID"]],
    body: users.map((u) => [
      u.username ?? "",
      u.email ?? "",
      u.role ?? "",
      u.status ?? "",
      String(u.florasCount ?? 0),
      u.joinedAt ?? "",
      u.id ?? "",
    ]),
    styles: { fontSize: 7, cellPadding: 1.5, textColor: colors.primary },
    headStyles: {
      fillColor: colors.primary,
      textColor: colors.white,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: colors.surface },
    margin: { left: margin, right: margin },
    tableLineColor: colors.primary,
    tableLineWidth: 0.1,
  });

  finalizePdf(doc, `spora-users-${Date.now()}.pdf`);
}

export function exportUserToPdf(user: AdminUserSummary): void {
  const doc = new jsPDF();
  let y = drawPdfHeader(doc, "User record");

  y = drawKeyValue(doc, y, "Username:", user.username ?? "");
  y = drawKeyValue(doc, y, "Email:", user.email ?? "");
  y = drawKeyValue(doc, y, "Role:", user.role ?? "");
  y = drawKeyValue(doc, y, "Status:", user.status ?? "");
  y = drawKeyValue(doc, y, "Floras:", String(user.florasCount ?? 0));
  y = drawKeyValue(doc, y, "Joined:", user.joinedAt ?? "");
  drawKeyValue(doc, y, "ID:", user.id ?? "");

  finalizePdf(
    doc,
    `spora-user-${(user.username ?? "user").replace(/^@/, "")}-${Date.now()}.pdf`
  );
}

export function exportReportToPdf(report: AdminReport): void {
  const doc = new jsPDF();
  let y = drawPdfHeader(doc, "Moderation report");

  y = drawKeyValue(doc, y, "Report ID:", report.id ?? "");
  y = drawKeyValue(doc, y, "Created:", formatDate(report.createdAt ?? ""));
  y = drawKeyValue(
    doc,
    y,
    "Type / status:",
    `${report.type ?? ""} · ${report.status ?? ""}`
  );

  y += 4;
  y = drawSectionLabel(doc, y, "Reporter");
  y = drawKeyValue(doc, y, "", report.reporterUsername ?? "");

  y += 2;
  y = drawSectionLabel(doc, y, "Target");
  y = drawKeyValue(doc, y, "", `${report.targetType ?? ""} — ${report.targetId ?? ""}`);

  if (report.reason) {
    y += 4;
    y = drawSectionLabel(doc, y, "Reason");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.primary);
    const lines = doc.splitTextToSize(report.reason, 210 - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * PDF_BRAND.lineHeight + 4;
  }

  finalizePdf(doc, `spora-report-${report.id}-${Date.now()}.pdf`);
}

export function exportFlaggedToPdf(item: AdminFlaggedItem): void {
  const doc = new jsPDF();
  let y = drawPdfHeader(doc, "Flagged content");

  y = drawKeyValue(doc, y, "Record ID:", item.id ?? "");
  y = drawKeyValue(
    doc,
    y,
    "Content:",
    `${item.contentType ?? ""} · ${item.contentId ?? ""}`
  );
  y = drawKeyValue(doc, y, "Status:", item.status ?? "");
  y = drawKeyValue(doc, y, "Flagged at:", formatDate(item.flaggedAt ?? ""));

  y += 4;
  y = drawSectionLabel(doc, y, "Reported by");
  y = drawKeyValue(doc, y, "", item.reportedBy ?? "");

  y += 2;
  y = drawSectionLabel(doc, y, "Reason");
  y = drawKeyValue(doc, y, "", item.reason ?? "");

  if (item.contentPreview) {
    y += 4;
    y = drawSectionLabel(doc, y, "Preview");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...colors.primary);
    const lines = doc.splitTextToSize(item.contentPreview, 210 - margin * 2);
    doc.text(lines, margin, y);
  }

  finalizePdf(doc, `spora-flagged-${item.contentId}-${Date.now()}.pdf`);
}
