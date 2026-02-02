import { useState } from "react";
import TransparentNavbar from "@/components/home/transparent-navbar";
import FooterAlter from "@/components/home/footer-alter";
import FilterTabs from "@/components/common/filter-tabs";
import AdminMetrics from "@/components/admin/admin-metrics";
import AdminUsageCharts from "@/components/admin/admin-usage-charts";
import AdminReports from "@/components/admin/admin-reports";
import AdminUserManagement from "@/components/admin/admin-user-management";
import AdminFlaggedContent from "@/components/admin/admin-flagged-content";
import {
  adminSectionTabs,
  defaultAdminMetrics,
  defaultAdminReports,
  defaultAdminUsers,
  defaultAdminFlagged,
  defaultUsageFlorasByDay,
  defaultUsageNewUsersByWeek,
  type AdminMetricsData,
  type AdminReport,
  type AdminUserSummary,
  type AdminFlaggedItem,
  type AdminUsageDataPoint,
  type ReportStatus,
  type UserRole,
  type UserStatus,
  type FlaggedStatus,
} from "@/data/admin-data";

export interface AdminPanelViewProps {
  metrics?: AdminMetricsData;
  reports?: AdminReport[];
  users?: AdminUserSummary[];
  flagged?: AdminFlaggedItem[];
  florasByDay?: AdminUsageDataPoint[];
  newUsersByWeek?: AdminUsageDataPoint[];
  onExportMetrics?: () => void;
  onReportClick?: (report: AdminReport) => void;
  onReportStatusChange?: (reportId: string, status: ReportStatus) => void;
  onDownloadReport?: (report: AdminReport) => void;
  onViewReportTarget?: (report: AdminReport) => void;
  onViewReportPreview?: (report: AdminReport) => void;
  onRemoveReportTarget?: (report: AdminReport) => void;
  onContactReportTarget?: (report: AdminReport) => void;
  onSuspendReportTarget?: (report: AdminReport) => void;
  onUserClick?: (user: AdminUserSummary) => void;
  onUserRoleChange?: (userId: string, role: UserRole) => void;
  onUserStatusChange?: (userId: string, status: UserStatus) => void;
  onExportUsers?: () => void;
  onExportUser?: (user: AdminUserSummary) => void;
  onSuspendUser?: (user: AdminUserSummary) => void;
  onBanUser?: (user: AdminUserSummary) => void;
  onActivateUser?: (user: AdminUserSummary) => void;
  onFlaggedClick?: (item: AdminFlaggedItem) => void;
  onFlaggedStatusChange?: (itemId: string, status: FlaggedStatus) => void;
  onViewFlaggedContent?: (item: AdminFlaggedItem) => void;
  onDownloadFlagged?: (item: AdminFlaggedItem) => void;
  onSuspendFlaggedAuthor?: (item: AdminFlaggedItem) => void;
}

export default function AdminPanel({
  metrics = defaultAdminMetrics,
  reports = defaultAdminReports,
  users = defaultAdminUsers,
  flagged = defaultAdminFlagged,
  florasByDay = defaultUsageFlorasByDay,
  newUsersByWeek = defaultUsageNewUsersByWeek,
  onExportMetrics,
  onReportClick,
  onReportStatusChange,
  onDownloadReport,
  onViewReportTarget,
  onViewReportPreview,
  onRemoveReportTarget,
  onContactReportTarget,
  onSuspendReportTarget,
  onUserClick,
  onUserRoleChange,
  onUserStatusChange,
  onExportUsers,
  onExportUser,
  onSuspendUser,
  onBanUser,
  onActivateUser,
  onFlaggedClick,
  onFlaggedStatusChange,
  onViewFlaggedContent,
  onDownloadFlagged,
  onSuspendFlaggedAuthor,
}: AdminPanelViewProps) {
  const [activeSection, setActiveSection] = useState<string>(adminSectionTabs[0]);

  const pendingReports = reports.filter((r) => r.status === "pending");

  return (
    <div className="w-full overflow-x-hidden bg-[#E9E9E9]">
      <TransparentNavbar showScrollBackground />

      <section className="pt-20 pb-6 px-6 md:px-12 lg:px-16">
        <div className="flex items-end justify-between gap-4 mb-6">
          <h1 className="font-jetbrains-mono font-bold text-sm uppercase">
            Admin panel
          </h1>
          <FilterTabs
            filters={[...adminSectionTabs]}
            activeFilter={activeSection}
            onFilterChange={setActiveSection}
          />
        </div>

        {activeSection === "Overview" && (
          <div className="space-y-6">
            <AdminMetrics
              metrics={metrics}
              onExportMetrics={onExportMetrics}
            />
            <AdminUsageCharts
              florasByDay={florasByDay}
              newUsersByWeek={newUsersByWeek}
              title="Usage"
            />
          </div>
        )}

        {activeSection === "Reports" && (
          <AdminReports
            reports={reports}
            onReportClick={onReportClick}
            onStatusChange={onReportStatusChange}
            onDownloadReport={onDownloadReport}
            onViewTarget={onViewReportTarget}
            onViewPreview={onViewReportPreview}
            onRemoveTarget={onRemoveReportTarget}
            onContactTarget={onContactReportTarget}
            onSuspendTarget={onSuspendReportTarget}
          />
        )}

        {activeSection === "Pending" && (
          <AdminReports
            reports={pendingReports}
            onReportClick={onReportClick}
            onStatusChange={onReportStatusChange}
            onDownloadReport={onDownloadReport}
            onViewTarget={onViewReportTarget}
            onViewPreview={onViewReportPreview}
            onRemoveTarget={onRemoveReportTarget}
            onContactTarget={onContactReportTarget}
            onSuspendTarget={onSuspendReportTarget}
          />
        )}

        {activeSection === "Users" && (
          <AdminUserManagement
            users={users}
            onUserClick={onUserClick}
            onRoleChange={onUserRoleChange}
            onStatusChange={onUserStatusChange}
            onExportUsers={onExportUsers}
            onExportUser={onExportUser}
            onSuspend={onSuspendUser}
            onBan={onBanUser}
            onActivate={onActivateUser}
          />
        )}

        {activeSection === "Flagged" && (
          <AdminFlaggedContent
            items={flagged}
            onItemClick={onFlaggedClick}
            onStatusChange={onFlaggedStatusChange}
            onViewContent={onViewFlaggedContent}
            onDownload={onDownloadFlagged}
            onSuspendAuthor={onSuspendFlaggedAuthor}
          />
        )}
      </section>

      <FooterAlter />
    </div>
  );
}
