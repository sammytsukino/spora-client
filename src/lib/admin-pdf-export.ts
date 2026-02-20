import { jsPDF } from "jspdf";
import type {
  AdminMetricsData,
  AdminUserSummary,
  AdminReport,
  AdminFlaggedItem,
} from "@/data/admin-data";

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

function downloadPdf(doc: jsPDF, filename: string) {
  doc.save(filename);
}

export function exportMetricsToPdf(metrics: AdminMetricsData): void {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text("SPORA Admin - Metrics Report", 20, y);
  y += 12;

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y);
  y += 15;

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
      doc.text(`${metricLabels[key]}: ${val.toLocaleString()}`, 20, y);
      y += 8;
    }
  }

  if (metrics.growth) {
    y += 5;
    doc.text("Growth (7d)", 20, y);
    y += 6;
    doc.text(
      `Users: ${metrics.growth.usersLast7Days} vs ${metrics.growth.usersPrev7Days} prev (${metrics.growth.usersGrowth}%)`,
      25,
      y
    );
    y += 6;
    doc.text(
      `Floras: ${metrics.growth.florasLast7Days} vs ${metrics.growth.florasPrev7Days} prev (${metrics.growth.florasGrowth}%)`,
      25,
      y
    );
  }

  downloadPdf(doc, `spora-metrics-${Date.now()}.pdf`);
}

export function exportUsersToPdf(users: AdminUserSummary[]): void {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text("SPORA Admin - Users Export", 20, y);
  y += 12;

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()} | Total: ${users.length}`, 20, y);
  y += 15;

  for (const user of users) {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFont(undefined, "bold");
    doc.text(user.username, 20, y);
    doc.setFont(undefined, "normal");
    y += 6;
    doc.text(`Email: ${user.email} | Role: ${user.role} | Status: ${user.status}`, 20, y);
    y += 6;
    doc.text(`Floras: ${user.florasCount} | Joined: ${user.joinedAt}`, 20, y);
    y += 6;
    doc.text(`ID: ${user.id}`, 20, y);
    y += 10;
  }

  downloadPdf(doc, `spora-users-${Date.now()}.pdf`);
}

export function exportUserToPdf(user: AdminUserSummary): void {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text("SPORA Admin - User Export", 20, y);
  y += 12;

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, y);
  y += 15;

  doc.setFont(undefined, "bold");
  doc.text(user.username, 20, y);
  doc.setFont(undefined, "normal");
  y += 8;
  doc.text(`Email: ${user.email}`, 20, y);
  y += 6;
  doc.text(`Role: ${user.role}`, 20, y);
  y += 6;
  doc.text(`Status: ${user.status}`, 20, y);
  y += 6;
  doc.text(`Floras: ${user.florasCount}`, 20, y);
  y += 6;
  doc.text(`Joined: ${user.joinedAt}`, 20, y);
  y += 6;
  doc.text(`ID: ${user.id}`, 20, y);

  downloadPdf(doc, `spora-user-${user.username.replace(/^@/, "")}-${Date.now()}.pdf`);
}

export function exportReportToPdf(report: AdminReport): void {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text("SPORA Admin - Report", 20, y);
  y += 12;

  doc.setFontSize(10);
  doc.text(`Report ID: ${report.id}`, 20, y);
  y += 6;
  doc.text(`Created: ${formatDate(report.createdAt)}`, 20, y);
  y += 6;
  doc.text(`Type: ${report.type} | Status: ${report.status}`, 20, y);
  y += 10;

  doc.setFont(undefined, "bold");
  doc.text("Reporter:", 20, y);
  doc.setFont(undefined, "normal");
  y += 6;
  doc.text(report.reporterUsername, 25, y);
  y += 8;

  doc.setFont(undefined, "bold");
  doc.text("Target:", 20, y);
  doc.setFont(undefined, "normal");
  y += 6;
  doc.text(`${report.targetType} - ${report.targetId}`, 25, y);
  y += 10;

  if (report.reason) {
    doc.setFont(undefined, "bold");
    doc.text("Reason:", 20, y);
    doc.setFont(undefined, "normal");
    y += 6;
    const lines = doc.splitTextToSize(report.reason, 170);
    doc.text(lines, 25, y);
    y += lines.length * 6 + 5;
  }

  downloadPdf(doc, `spora-report-${report.id}-${Date.now()}.pdf`);
}

export function exportFlaggedToPdf(item: AdminFlaggedItem): void {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text("SPORA Admin - Flagged Content", 20, y);
  y += 12;

  doc.setFontSize(10);
  doc.text(`Content ID: ${item.id}`, 20, y);
  y += 6;
  doc.text(`Type: ${item.contentType} | Status: ${item.status}`, 20, y);
  y += 6;
  doc.text(`Flagged: ${formatDate(item.flaggedAt)}`, 20, y);
  y += 10;

  doc.setFont(undefined, "bold");
  doc.text("Reported by:", 20, y);
  doc.setFont(undefined, "normal");
  y += 6;
  doc.text(item.reportedBy, 25, y);
  y += 8;

  doc.setFont(undefined, "bold");
  doc.text("Reason:", 20, y);
  doc.setFont(undefined, "normal");
  y += 6;
  doc.text(item.reason, 25, y);
  y += 8;

  if (item.contentPreview) {
    doc.setFont(undefined, "bold");
    doc.text("Preview:", 20, y);
    doc.setFont(undefined, "normal");
    y += 6;
    const lines = doc.splitTextToSize(item.contentPreview, 170);
    doc.text(lines, 25, y);
    y += lines.length * 6;
  }

  downloadPdf(doc, `spora-flagged-${item.contentId}-${Date.now()}.pdf`);
}
