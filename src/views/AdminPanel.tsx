import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import TransparentNavbar from "@/components/layout/TransparentNavbar";
import FooterAlter from "@/components/layout/FooterAlter";
import FilterTabs from "@/components/shared/FilterTabs";
import AdminMetrics from "@/components/admin/AdminMetrics";
import AdminUsageCharts from "@/components/admin/AdminUsageCharts";
import AdminReports from "@/components/admin/AdminReports";
import AdminUserManagement from "@/components/admin/AdminUserManagement";
import AdminFlaggedContent from "@/components/admin/AdminFlaggedContent";
import AdminFlorasManagement from "@/components/admin/AdminFlorasManagement";
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
import { readerNavState } from "@/lib/floraViewBack";

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
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const floraOpenState = readerNavState(location.pathname, location.search);
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
    allFloras,
    loading,
    error,
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
          <div className="flex min-w-0 flex-wrap items-center gap-4">
            <h1 className="font-supply-mono text-sm font-bold uppercase">
              Admin panel
            </h1>
            <Link
              to={ROUTES.LABORATORY_FULL}
              className="cursor-pointer font-supply-mono text-xs uppercase underline hover:no-underline"
            >
              Full Laboratory
            </Link>
          </div>
          <div className="flex w-full min-w-0 justify-end sm:w-auto">
            <FilterTabs
              filters={[...adminSectionTabs]}
              activeFilter={activeSection}
              onFilterChange={setActiveSection}
            />
          </div>
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
                    onItemClick={(item) =>
                      navigate(floraPath(item.contentId), { state: floraOpenState })
                    }
                    onViewContent={(item) =>
                      window.open(floraPath(item.contentId), "_blank")
                    }
                    onHideFlora={onHideFlora}
                    onDownload={(item) => exportFlaggedToPdf(item)}
                    onBatchFloras={onBatchFloras}
                  />
                ) : (
                  <AdminReports
                    reports={
                      reportStatusFilter === "Pending"
                        ? pendingReports
                        : reports
                    }
                    onReportClick={(r) =>
                      navigate(`/flora/${r.targetId}`, { state: floraOpenState })
                    }
                    onStatusChange={onReportStatusChange}
                    onDownloadReport={(r) => exportReportToPdf(r)}
                    onViewTarget={(r) =>
                      navigate(floraPath(r.targetId), { state: floraOpenState })
                    }
                    onViewPreview={(r) =>
                      window.open(floraPath(r.targetId), "_blank")
                    }
                    onRemoveTarget={() => {}}
                    onContactTarget={() => {}}
                    onSuspendTarget={() => {}}
                    onHideFlora={onHideFlora}
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
                onExportUsers={() => exportUsersToPdf(users)}
                onExportUser={(u) => exportUserToPdf(u)}
                onSuspend={(u) => onUserStatusChange(u.id, "suspended")}
                onBan={(u) => onUserStatusChange(u.id, "banned")}
                onActivate={(u) => onUserStatusChange(u.id, "active")}
                onBatchUsers={onBatchUsers}
              />
            )}

          </>
        )}
      </section>

      <FooterAlter />
    </div>
  );
}
