import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import FilterTabs from "@/components/shared/FilterTabs";
import AdminMetrics from "@/components/admin/AdminMetrics";
import AdminUsageCharts from "@/components/admin/AdminUsageCharts";
import AdminReports from "@/components/admin/AdminReports";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminFlaggedContent from "@/components/admin/AdminFlaggedContent";
import { adminSectionTabs } from "@/data/admin-data";
import { useAdminPanel } from "@/hooks/useAdminPanel";
import { getStoredUser } from "@/lib/auth";
import {
  exportMetricsToPdf,
  exportUsersToPdf,
  exportUserToPdf,
  exportReportToPdf,
  exportFlaggedToPdf,
} from "@/lib/admin-pdf-export";

const defaultMetrics = {
  totalUsers: 0,
  totalFloras: 0,
  totalBlossoming: 0,
  totalSealed: 0,
  totalHidden: 0,
  pendingReports: 0,
  flaggedContent: 0,
};

const reportsSubViews = ["By flora", "By report"] as const;
const reportStatusFilters = ["Pending", "All"] as const;

export default function AdminPanel() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [activeSection, setActiveSection] = useState<string>(adminSectionTabs[0]);
  const [reportsSubView, setReportsSubView] = useState<
    (typeof reportsSubViews)[number]
  >("By flora");
  const [reportStatusFilter, setReportStatusFilter] = useState<
    (typeof reportStatusFilters)[number]
  >("Pending");

  const {
    metrics,
    florasByDay,
    newUsersByWeek,
    users,
    reports,
    flagged,
    loading,
    error,
    refresh,
    onUserRoleChange,
    onUserStatusChange,
    onReportStatusChange,
    onUnsignUser,
    onHideFlora,
  } = useAdminPanel();

  const pendingReports = reports.filter((r) => r.status === "pending");

  if (!user || user.role !== "admin") {
    return (
      <div className="w-full min-h-screen bg-[#E9E9E9] flex items-center justify-center">
        <p className="font-supply-mono text-sm uppercase">
          Admin access required.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      <section className="pt-20 pb-6 px-6 md:px-12 lg:px-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="font-supply-mono font-bold text-sm uppercase">
              Admin panel
            </h1>
            <Link
              to="/laboratory/full"
              className="font-supply-mono text-xs uppercase underline hover:no-underline cursor-pointer"
            >
              Full Laboratory
            </Link>
          </div>
          <FilterTabs
            filters={[...adminSectionTabs]}
            activeFilter={activeSection}
            onFilterChange={setActiveSection}
          />
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-600 bg-red-50 font-supply-mono text-xs">
            {error}
            <button
              type="button"
              onClick={() => refresh()}
              className="ml-4 underline"
            >
              Retry
            </button>
          </div>
        )}

        {loading && !metrics ? (
          <p className="font-supply-mono text-sm uppercase opacity-80">
            Loading…
          </p>
        ) : (
          <>
            {activeSection === "Overview" && (
              <div className="space-y-6">
                <AdminMetrics
                  metrics={metrics ?? defaultMetrics}
                  onExportMetrics={() =>
                    exportMetricsToPdf(metrics ?? defaultMetrics)
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
                {reportsSubView === "By flora" ? (
                  <AdminFlaggedContent
                    items={flagged}
                    title="Reported floras"
                    onItemClick={(item) => navigate(`/flora/${item.contentId}`)}
                    onViewContent={(item) =>
                      window.open(`/flora/${item.contentId}`, "_blank")
                    }
                    onHideFlora={onHideFlora}
                    onDownload={(item) => exportFlaggedToPdf(item)}
                  />
                ) : (
                  <AdminReports
                    reports={
                      reportStatusFilter === "Pending"
                        ? pendingReports
                        : reports
                    }
                    onReportClick={(r) => navigate(`/flora/${r.targetId}`)}
                    onStatusChange={onReportStatusChange}
                    onDownloadReport={(r) => exportReportToPdf(r)}
                    onViewTarget={(r) => navigate(`/flora/${r.targetId}`)}
                    onViewPreview={(r) =>
                      window.open(`/flora/${r.targetId}`, "_blank")
                    }
                    onRemoveTarget={() => {}}
                    onContactTarget={() => {}}
                    onSuspendTarget={() => {}}
                    onHideFlora={onHideFlora}
                  />
                )}
              </div>
            )}

            {activeSection === "Users" && (
              <AdminUserManagement
                users={users}
                onUserClick={(u) => {
                  if (u.id === user?.id) {
                    navigate("/profile");
                  } else {
                    const params = new URLSearchParams({
                      authorId: u.id,
                      username: u.username.replace(/^@/, ""),
                    });
                    navigate(`/greenhouse?${params}`);
                  }
                }}
                onRoleChange={onUserRoleChange}
                onStatusChange={onUserStatusChange}
                onUnsign={onUnsignUser}
                onExportUsers={() => exportUsersToPdf(users)}
                onExportUser={(u) => exportUserToPdf(u)}
                onSuspend={(u) => onUserStatusChange(u.id, "suspended")}
                onBan={(u) => onUserStatusChange(u.id, "banned")}
                onActivate={(u) => onUserStatusChange(u.id, "active")}
              />
            )}

          </>
        )}
      </section>

      <FooterAlter />
    </div>
  );
}
