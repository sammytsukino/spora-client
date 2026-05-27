import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import FilterTabs from "@/components/shared/FilterTabs";
import AlertModal, { type AlertModalTone } from "@/components/shared/AlertModal";
import AdminMetrics from "@/components/admin/AdminMetrics";
import AdminUsageCharts from "@/components/admin/AdminUsageCharts";
import AdminReports from "@/components/admin/AdminReports";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminFlaggedContent from "@/components/admin/AdminFlaggedContent";
import AdminFlorasManagement from "@/components/admin/AdminFlorasManagement";
import {
  adminButtonDangerSm,
  adminButtonNeutralSm,
} from "@/components/admin/adminButtonStyles";
import { adminSectionTabs, type AdminSection } from "@/data/admin-data";
import { useAdminPanel } from "@/hooks/useAdminPanel";
import { getStoredUser } from "@/lib/auth";
import {
  exportMetricsToPdf,
  exportUsersToPdf,
  exportUserToPdf,
  exportReportToPdf,
  exportFlaggedToPdf,
} from "@/lib/admin-pdf-export";
import { ROUTES, floraPath, greenhouseWithAuthorQuery } from "@/constants/routes";
import { openFloraInNewTab } from "@/lib/openFloraInNewTab";

const defaultMetrics = {
  totalUsers: 0,
  totalFloras: 0,
  totalBlossoming: 0,
  totalSealed: 0,
  totalHidden: 0,
  pendingReports: 0,
  flaggedContent: 0,
};

const reportsSubViews = ["By Flora", "By report"] as const;
const reportStatusFilters = ["Pending", "All"] as const;

export default function AdminPanel() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = getStoredUser();
  const tabFromUrl = searchParams.get("tab") ?? adminSectionTabs[0];
  const isTabValid = (s: string): s is AdminSection =>
    (adminSectionTabs as readonly string[]).includes(s);
  const activeSection: AdminSection = isTabValid(tabFromUrl) ? tabFromUrl : adminSectionTabs[0];

  const setActiveSection = (tab: string) => {
    const safe: AdminSection = isTabValid(tab) ? tab : adminSectionTabs[0];
    setSearchParams(safe === adminSectionTabs[0] ? {} : { tab: safe });
  };

  const [reportsSubView, setReportsSubView] = useState<
    (typeof reportsSubViews)[number]
  >("By Flora");
  const [reportStatusFilter, setReportStatusFilter] = useState<
    (typeof reportStatusFilters)[number]
  >("Pending");

  const [pdfAlert, setPdfAlert] = useState<{
    open: boolean;
    title: string;
    description: string;
    tone?: AlertModalTone;
  }>({ open: false, title: "", description: "" });

  const safePdfExport = (run: () => void) => {
    try {
      run();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setPdfAlert({
        open: true,
        title: "Export failed",
        description:
          message.trim() !== ""
            ? message
            : "Something went wrong while creating the PDF.",
        tone: "error",
      });
    }
  };

  const {
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
    refresh,
    onUserRoleChange,
    onUserStatusChange,
    onReportStatusChange,
    onUnsignUser,
    onHideFlora,
    onBatchFloras,
    onBatchReports,
    onBatchUsers,
  } = useAdminPanel();

  const pendingReports = reports.filter((r) => r.status === "pending");
  const hasValidFloraTarget = (targetId: string) =>
    typeof targetId === "string" &&
    targetId.trim() !== "" &&
    targetId !== "undefined" &&
    targetId !== "null";

  if (!user || user.role !== "admin") {
    return (
      <div className="w-full min-h-screen bg-spora-primary-light flex items-center justify-center">
        <p className="font-supply-mono text-sm uppercase">
          Admin access required.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden bg-spora-primary-light">
      <TransparentNavbar showScrollBackground />

      <section className="pt-20 pb-6 px-6 md:px-12 lg:px-16">
        <div className="mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <h1 className="min-w-0 font-supply-mono text-sm font-bold uppercase">
            Admin panel
          </h1>
          <div className="flex w-full min-w-0 justify-end sm:w-auto">
            <FilterTabs
              filters={[...adminSectionTabs]}
              activeFilter={activeSection}
              onFilterChange={setActiveSection}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-rose-500 bg-rose-50 font-supply-mono text-xs flex flex-wrap items-center gap-3">
            <span className="min-w-0 flex-1">{error}</span>
            <button
              type="button"
              onClick={() => refresh()}
              className={`shrink-0 ${adminButtonNeutralSm}`}
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => clearError()}
              className={`shrink-0 ${adminButtonDangerSm}`}
            >
              Dismiss
            </button>
          </div>
        )}

        {loading && !metrics ? (
          <p className="font-supply-mono text-sm uppercase opacity-80">
            Loading…
          </p>
        ) : (
          <>
            {activeSection === "Floras" && (
              <AdminFlorasManagement
                floras={allFloras}
                onBatchFloras={onBatchFloras}
              />
            )}

            {activeSection === "Overview" && (
              <div className="space-y-6">
                <AdminMetrics
                  metrics={metrics ?? defaultMetrics}
                  onExportMetrics={() =>
                    safePdfExport(() =>
                      exportMetricsToPdf(metrics ?? defaultMetrics)
                    )
                  }
                />
                <AdminUsageCharts
                  florasByDay={florasByDay}
                  newUsersByWeek={newUsersByWeek}
                  title="Usage"
                />
              </div>
            )}

            {activeSection === "Reports" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <FilterTabs
                    filters={[...reportsSubViews]}
                    activeFilter={reportsSubView}
                    onFilterChange={(v) =>
                      setReportsSubView(v as (typeof reportsSubViews)[number])
                    }
                  />
                  {reportsSubView === "By report" && (
                    <FilterTabs
                      filters={[...reportStatusFilters]}
                      activeFilter={reportStatusFilter}
                      onFilterChange={(v) =>
                        setReportStatusFilter(
                          v as (typeof reportStatusFilters)[number]
                        )
                      }
                    />
                  )}
                </div>
                {reportsSubView === "By Flora" ? (
                  <AdminFlaggedContent
                    items={flagged}
                    title="Reported Floras"
                    onViewContent={(item) =>
                      openFloraInNewTab(floraPath(item.contentId))
                    }
                    onHideFlora={onHideFlora}
                    onDownload={(item) =>
                      safePdfExport(() => exportFlaggedToPdf(item))
                    }
                    onBatchFloras={onBatchFloras}
                  />
                ) : (
                  <AdminReports
                    reports={
                      reportStatusFilter === "Pending"
                        ? pendingReports
                        : reports
                    }
                    onStatusChange={onReportStatusChange}
                    onDownloadReport={(r) =>
                      safePdfExport(() => exportReportToPdf(r))
                    }
                    onViewTarget={(r) => {
                      if (!hasValidFloraTarget(r.targetId)) {
                        setPdfAlert({
                          open: true,
                          title: "Target unavailable",
                          description:
                            "This report does not have a valid target reference.",
                          tone: "error",
                        });
                        return;
                      }
                      openFloraInNewTab(floraPath(r.targetId));
                    }}
                    onRemoveTarget={async (r) => {
                      if (!hasValidFloraTarget(r.targetId)) {
                        setPdfAlert({
                          open: true,
                          title: "Target unavailable",
                          description:
                            "This report does not have a valid Flora reference, so the content cannot be removed from here.",
                          tone: "error",
                        });
                        return;
                      }
                      await onBatchFloras([r.targetId], "delete");
                      await onReportStatusChange(r.id, "resolved");
                    }}
                    onHideFlora={async (floraId) => {
                      const report = reports.find((rep) => rep.targetId === floraId);
                      if (!report) {
                        await onHideFlora(floraId);
                        return;
                      }
                      await onHideFlora(floraId);
                      await onReportStatusChange(report.id, "resolved");
                    }}
                    onBatchReports={onBatchReports}
                  />
                )}
              </div>
            )}

            {activeSection === "Users" && (
              <AdminUserManagement
                users={users}
                onUserClick={(u) => {
                  if (u.id === user?.id) {
                    navigate(ROUTES.PROFILE);
                  } else {
                    navigate(
                      greenhouseWithAuthorQuery(
                        u.id,
                        u.username.replace(/^@/, "")
                      )
                    );
                  }
                }}
                onRoleChange={onUserRoleChange}
                onStatusChange={onUserStatusChange}
                onUnsign={onUnsignUser}
                onExportUsers={() =>
                  safePdfExport(() => exportUsersToPdf(users))
                }
                onExportUser={(u) => safePdfExport(() => exportUserToPdf(u))}
                onSuspend={(u) => onUserStatusChange(u.id, "suspended")}
                onBan={(u) => onUserStatusChange(u.id, "banned")}
                onActivate={(u) => onUserStatusChange(u.id, "active")}
                onBatchUsers={onBatchUsers}
              />
            )}

          </>
        )}
      </section>

      <AlertModal
        open={pdfAlert.open}
        title={pdfAlert.title}
        description={pdfAlert.description}
        tone={pdfAlert.tone}
        okLabel="OK"
        onClose={() => setPdfAlert((a) => ({ ...a, open: false }))}
      />

      <FooterAlter />
    </div>
  );
}
