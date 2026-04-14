import { useState } from "react";
import { Download, ExternalLink, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/shared/ConfirmModal";
import type { AdminReport, ReportStatus } from "@/data/admin-data";

interface AdminReportsProps {
  reports: AdminReport[];
  onReportClick?: (report: AdminReport) => void;
  onStatusChange?: (reportId: string, status: ReportStatus) => void | Promise<void>;
  onDownloadReport?: (report: AdminReport) => void;
  onViewTarget?: (report: AdminReport) => void;
  onRemoveTarget?: (report: AdminReport) => void | Promise<void>;
  onHideFlora?: (floraId: string) => void | Promise<void>;
  onBatchReports?: (ids: string[], action: "resolve" | "dismiss") => void | Promise<void>;
}

const statusStyles: Record<ReportStatus, string> = {
  pending: "bg-amber-200 border-amber-700",
  reviewing: "bg-sky-100 border-sky-700",
  reviewed: "bg-sky-100 border-sky-700",
  resolved: "bg-lime-300 border-lime-300",
  dismissed: "bg-stone-200 border-spora-primary",
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
  onRemoveTarget,
  onHideFlora,
  onBatchReports,
}: AdminReportsProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmPending, setConfirmPending] = useState(false);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant?: "default" | "danger";
    onConfirm: () => void | Promise<void>;
  }>({ open: false, title: "", description: "", onConfirm: async () => {} });

  const openConfirm = (next: typeof confirm) => {
    setConfirm({ ...next, open: true });
  };

  const handleHideFlora = (report: AdminReport) => {
    if (!onHideFlora) return;
    openConfirm({
      open: true,
      title: "Hide Flora",
      description:
        "Are you sure you want to hide this Flora? It will no longer be visible to other users.",
      onConfirm: async () => {
        setConfirmPending(true);
        try {
          await onHideFlora(report.targetId);
          setConfirm((c) => ({ ...c, open: false }));
        } catch {
          setConfirm((c) => ({ ...c, open: false }));
        } finally {
          setConfirmPending(false);
        }
      },
    });
  };

  const handleDismiss = (report: AdminReport) => {
    if (!onStatusChange) return;
    openConfirm({
      open: true,
      title: "Dismiss report",
      description:
        "Dismiss this report. No action will be taken on the reported content.",
      onConfirm: async () => {
        setConfirmPending(true);
        try {
          await onStatusChange(report.id, "dismissed");
          setConfirm((c) => ({ ...c, open: false }));
        } catch {
          setConfirm((c) => ({ ...c, open: false }));
        } finally {
          setConfirmPending(false);
        }
      },
    });
  };

  const handleRemoveTarget = (report: AdminReport) => {
    if (!onRemoveTarget) return;
    openConfirm({
      open: true,
      title: "Remove content",
      description:
        "Are you sure you want to remove the reported content? This action cannot be undone.",
      variant: "danger",
      onConfirm: async () => {
        setConfirmPending(true);
        try {
          await onRemoveTarget(report);
          setConfirm((c) => ({ ...c, open: false }));
        } catch {
          setConfirm((c) => ({ ...c, open: false }));
        } finally {
          setConfirmPending(false);
        }
      },
    });
  };

  const pendingReports = reports.filter((r) => r.status === "pending");
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectAll = () => {
    if (selectedIds.size === pendingReports.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(pendingReports.map((r) => r.id)));
  };
  const runBatch = (action: "resolve" | "dismiss") => {
    if (!onBatchReports || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    openConfirm({
      open: true,
      title: action === "resolve" ? "Resolve reports" : "Dismiss reports",
      description: `Are you sure you want to ${action} ${ids.length} report${ids.length !== 1 ? "s" : ""}?`,
      variant: action === "dismiss" ? "danger" : "default",
      onConfirm: async () => {
        setConfirmPending(true);
        try {
          await onBatchReports(ids, action);
          setSelectedIds(new Set());
          setConfirm((c) => ({ ...c, open: false }));
        } catch {
          setConfirm((c) => ({ ...c, open: false }));
        } finally {
          setConfirmPending(false);
        }
      },
    });
  };

  if (reports.length === 0) {
    return (
      <section className="border border-[var(--spora-primary)] bg-spora-primary-light p-6">
        <h2 className="font-supply-mono font-bold text-sm uppercase mb-4">
          Reports
        </h2>
        <p className="font-supply-mono text-caption-sm opacity-80">
          No reports found.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-[var(--spora-primary)] bg-spora-primary-light p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h2 className="font-supply-mono font-bold text-sm uppercase">
            Reports
          </h2>
          <span className="font-supply-mono text-caption-sm opacity-80">
            {reports.length} report{reports.length !== 1 ? "s" : ""}
          </span>
          {onBatchReports && pendingReports.length > 0 && (
            <label className="flex items-center gap-2 cursor-pointer font-supply-mono text-caption-sm">
              <input
                type="checkbox"
                checked={
                  pendingReports.length > 0 &&
                  pendingReports.every((r) => selectedIds.has(r.id))
                }
                onChange={selectAll}
                className="w-4 h-4 border-2 border-[var(--spora-primary)]"
              />
              Select all pending
            </label>
          )}
        </div>
        {selectedIds.size > 0 && onBatchReports && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={confirmPending}
              onClick={() => runBatch("resolve")}
              className="px-3 py-1.5 border border-lime-300 text-spora-primary hover:bg-lime-300 text-overline-xs uppercase font-supply-mono disabled:opacity-50"
            >
              Resolve ({selectedIds.size})
            </button>
            <button
              type="button"
              disabled={confirmPending}
              onClick={() => runBatch("dismiss")}
              className="px-3 py-1.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase font-supply-mono disabled:opacity-50"
            >
              Dismiss ({selectedIds.size})
            </button>
            <button
              type="button"
              disabled={confirmPending}
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase font-supply-mono disabled:opacity-50"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
      <ul className="space-y-4">
        {reports.map((report) => (
          <li key={report.id}>
            <article
              className={`border bg-spora-primary-light p-4 font-supply-mono text-caption-sm transition-colors ${selectedIds.has(report.id) ? "border-amber-600 bg-amber-50/50" : "border-[var(--spora-primary)]"}`}
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
                  {onBatchReports && report.status === "pending" && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(report.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(report.id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 border-2 border-[var(--spora-primary)]"
                    />
                  )}
                  <span className="font-bold">{report.id}</span>
                  <span className="uppercase opacity-80">{report.type}</span>
                  {report.source === "language_screen" && (
                    <span className="px-2 py-0.5 border border-sky-600 text-sky-800 bg-sky-50 uppercase shrink-0 text-overline-xs">
                      Auto
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 border uppercase shrink-0 ${statusStyles[report.status]}`}
                  >
                    {report.status}
                  </span>
                  {report.status !== "pending" && (
                    <span className="px-2 py-0.5 border border-spora-primary bg-spora-primary-light uppercase shrink-0 text-overline-xs opacity-80">
                      Read-only
                    </span>
                  )}
                </div>
                <span className="opacity-70 text-overline-xs">
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
                <p className="mb-4 opacity-90 italic border-l border-[var(--spora-primary)] pl-3 py-1">
                  {report.reason}
                </p>
              )}
              <div
                className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--spora-primary)]"
                onClick={(e) => e.stopPropagation()}
              >
                {onDownloadReport && (
                  <button
                    type="button"
                    onClick={() => onDownloadReport(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase"
                  >
                    <Download className="size-3.5" aria-hidden />
                    Download
                  </button>
                )}
                {onViewTarget && (
                  <button
                    type="button"
                    onClick={() => onViewTarget(report)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase"
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                    View target
                  </button>
                )}
                {onStatusChange && report.status === "pending" && (
                  <>
                    {report.targetType === "flora" && onHideFlora && (
                      <button
                        type="button"
                        onClick={() => handleHideFlora(report)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white text-overline-xs uppercase"
                      >
                        Hide Flora
                      </button>
                    )}
                    {onRemoveTarget &&
                      (report.targetType === "flora" || report.targetType === "comment") && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTarget(report)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white text-overline-xs uppercase"
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                        Remove content
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDismiss(report)}
                      className="px-3 py-1.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase"
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
      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        description={confirm.description}
        variant={confirm.variant}
        pending={confirmPending}
        onConfirm={confirm.onConfirm}
        onCancel={() => !confirmPending && setConfirm((c) => ({ ...c, open: false }))}
      />
    </section>
  );
}
