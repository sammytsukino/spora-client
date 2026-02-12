import { Download, ExternalLink, UserX, Eye, Trash2, Mail } from "lucide-react";
import type { AdminReport, ReportStatus } from "@/data/admin-data";

interface AdminReportsProps {
  reports: AdminReport[];
  onReportClick?: (report: AdminReport) => void;
  onStatusChange?: (reportId: string, status: ReportStatus) => void;
  onDownloadReport?: (report: AdminReport) => void;
  onViewTarget?: (report: AdminReport) => void;
  onSuspendTarget?: (report: AdminReport) => void;
  onViewPreview?: (report: AdminReport) => void;
  onRemoveTarget?: (report: AdminReport) => void;
  onContactTarget?: (report: AdminReport) => void;
}

const statusStyles: Record<ReportStatus, string> = {
  pending: "bg-amber-200 border-amber-700",
  reviewed: "bg-sky-100 border-sky-700",
  resolved: "bg-lime-300 border-lime-300",
  dismissed: "bg-stone-200 border-[#262626]",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function AdminReports({
  reports,
  onReportClick,
  onStatusChange,
  onDownloadReport,
  onViewTarget,
  onSuspendTarget,
  onViewPreview,
  onRemoveTarget,
  onContactTarget,
}: AdminReportsProps) {
  if (reports.length === 0) {
    return (
      <section className="border-2 border-[#262626] bg-[#E9E9E9] p-6">
        <h2 className="font-supply-mono font-bold text-sm uppercase mb-4">
          Reports
        </h2>
        <p className="font-supply-mono text-[11px] opacity-80">
          No reports found.
        </p>
      </section>
    );
  }

  return (
    <section className="border-2 border-[#262626] bg-[#E9E9E9] p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="font-supply-mono font-bold text-sm uppercase">
          Reports
        </h2>
        <span className="font-supply-mono text-[11px] opacity-80">
          {reports.length} report{reports.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="space-y-4">
        {reports.map((report) => (
          <li key={report.id}>
            <article
              className="border-2 border-[#262626] bg-[#E9E9E9] p-4 font-supply-mono text-[11px]"
              onClick={() => onReportClick?.(report)}
              onKeyDown={(e) =>
                onReportClick &&
                (e.key === "Enter" || e.key === " ") &&
                onReportClick(report)
              }
              role={onReportClick ? "button" : undefined}
              tabIndex={onReportClick ? 0 : undefined}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">{report.id}</span>
                  <span className="uppercase opacity-80">{report.type}</span>
                  <span
                    className={`px-2 py-0.5 border-2 uppercase shrink-0 ${statusStyles[report.status]}`}
                  >
                    {report.status}
                  </span>
                </div>
                <span className="opacity-70 text-[10px]">
                  {formatDate(report.createdAt)}
                </span>
              </div>
              <div className="mb-2">
                <span className="opacity-80">
                  Reporter: <strong>{report.reporterUsername}</strong>
                </span>
                <span className="mx-2 opacity-50">→</span>
                <span className="opacity-80">
                  Target: <strong>{report.targetType}</strong> {report.targetId}
                </span>
              </div>
              {report.reason && (
                <p className="mb-4 opacity-90 italic border-l-2 border-[#262626] pl-3 py-1">
                  {report.reason}
                </p>
              )}
              <div
                className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-[#262626]"
                onClick={(e) => e.stopPropagation()}
              >
                {onDownloadReport && (
                  <button
                    type="button"
                    onClick={() => onDownloadReport(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                  >
                    <Download className="size-3.5" aria-hidden />
                    Download
                  </button>
                )}
                {onViewTarget && (
                  <button
                    type="button"
                    onClick={() => onViewTarget(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                    View target
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onViewPreview?.(report)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                >
                  <Eye className="size-3.5" aria-hidden />
                  Preview
                </button>
                {(report.targetType === "flora" || report.targetType === "comment") && (
                  <button
                    type="button"
                    onClick={() => onRemoveTarget?.(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-[10px] uppercase"
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Remove content
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onContactTarget?.(report)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                >
                  <Mail className="size-3.5" aria-hidden />
                  Contact
                </button>
                {onSuspendTarget && report.targetType === "user" && (
                  <button
                    type="button"
                    onClick={() => onSuspendTarget(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-[10px] uppercase"
                  >
                    <UserX className="size-3.5" aria-hidden />
                    Suspend user
                  </button>
                )}
                {onStatusChange && report.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => onStatusChange(report.id, "resolved")}
                      className="px-3 py-1.5 border-2 border-lime-300 text-[#262626] hover:bg-lime-300 hover:text-white text-[10px] uppercase"
                    >
                      Resolve
                    </button>
                    <button
                      type="button"
                      onClick={() => onStatusChange(report.id, "dismissed")}
                      className="px-3 py-1.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                    >
                      Dismiss
                    </button>
                  </>
                )}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
