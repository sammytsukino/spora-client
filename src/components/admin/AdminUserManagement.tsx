import { Download, User, UserX, Ban, CheckCircle } from "lucide-react";
import type { AdminUserSummary, UserRole, UserStatus } from "@/data/admin-data";

interface AdminUserManagementProps {
  users: AdminUserSummary[];
  onUserClick?: (user: AdminUserSummary) => void;
  onRoleChange?: (userId: string, role: UserRole) => void;
  onStatusChange?: (userId: string, status: UserStatus) => void;
  onExportUsers?: () => void;
  onExportUser?: (user: AdminUserSummary) => void;
  onSuspend?: (user: AdminUserSummary) => void;
  onBan?: (user: AdminUserSummary) => void;
  onActivate?: (user: AdminUserSummary) => void;
}

const roleStyles: Record<UserRole, string> = {
  user: "border-[#262626] bg-[#E9E9E9]",
  creator: "border-lime-300 bg-lime-300",
  moderator: "border-sky-600 bg-sky-100",
  admin: "border-amber-600 bg-amber-100",
};

const statusStyles: Record<UserStatus, string> = {
  active: "border-lime-300 bg-lime-300",
  suspended: "border-amber-600 bg-amber-100",
  banned: "border-red-600 bg-red-100",
};

export default function AdminUserManagement({
  users,
  onUserClick,
  onRoleChange,
  onExportUsers,
  onExportUser,
  onSuspend,
  onBan,
  onActivate,
}: AdminUserManagementProps) {
  if (users.length === 0) {
    return (
      <section className="border-2 border-[#262626] bg-[#E9E9E9] p-6">
        <h2 className="font-supply-mono font-bold text-sm uppercase mb-4">
          User management
        </h2>
        <p className="font-supply-mono text-[11px] opacity-80">
          No users found.
        </p>
      </section>
    );
  }

  return (
    <section className="border-2 border-[#262626] bg-[#E9E9E9] p-6 overflow-x-auto">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="font-supply-mono font-bold text-sm uppercase">
          User management
        </h2>
        {onExportUsers && (
          <button
            type="button"
            onClick={onExportUsers}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 font-supply-mono text-[10px] uppercase"
          >
            <Download className="size-3.5" aria-hidden />
            Export all users
          </button>
        )}
      </div>
      <div className="border-2 border-[#262626] bg-[#E9E9E9] min-w-[720px]">
        <table className="w-full font-supply-mono text-[11px]">
          <thead>
            <tr className="border-b-2 border-[#262626] bg-[#E9E9E9]">
              <th className="text-left p-3 uppercase">User</th>
              <th className="text-left p-3 uppercase">Email</th>
              <th className="text-left p-3 uppercase">Role</th>
              <th className="text-left p-3 uppercase">Status</th>
              <th className="text-left p-3 uppercase">Floras</th>
              <th className="text-left p-3 uppercase">Joined</th>
              <th className="text-left p-3 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b-2 border-[#262626] hover:bg-lime-300 transition-colors align-top"
                role={onUserClick ? "button" : undefined}
                onClick={() => onUserClick?.(user)}
                onKeyDown={(e) =>
                  onUserClick &&
                  (e.key === "Enter" || e.key === " ") &&
                  onUserClick(user)
                }
                tabIndex={onUserClick ? 0 : undefined}
              >
                <td className="p-3 font-medium">{user.username}</td>
                <td className="p-3 opacity-80 truncate max-w-[180px]">
                  {user.email}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 border-2 uppercase ${roleStyles[user.role]}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 border-2 uppercase ${statusStyles[user.status]}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3">{user.florasCount}</td>
                <td className="p-3 opacity-80">{user.joinedAt}</td>
                <td
                  className="p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {onUserClick && (
                      <button
                        type="button"
                        onClick={() => onUserClick(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                      >
                        <User className="size-3" aria-hidden />
                        View
                      </button>
                    )}
                    {onExportUser && (
                      <button
                        type="button"
                        onClick={() => onExportUser(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                      >
                        <Download className="size-3" aria-hidden />
                        Export
                      </button>
                    )}
                    {onSuspend && user.status === "active" && (
                      <button
                        type="button"
                        onClick={() => onSuspend(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white text-[10px] uppercase"
                      >
                        <UserX className="size-3" aria-hidden />
                        Suspend
                      </button>
                    )}
                    {onBan && user.status !== "banned" && (
                      <button
                        type="button"
                        onClick={() => onBan(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-[10px] uppercase"
                      >
                        <Ban className="size-3" aria-hidden />
                        Ban
                      </button>
                    )}
                    {onActivate && (user.status === "suspended" || user.status === "banned") && (
                      <button
                        type="button"
                        onClick={() => onActivate(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border-2 border-lime-300 text-[#262626] hover:bg-lime-300 hover:text-white text-[10px] uppercase"
                      >
                        <CheckCircle className="size-3" aria-hidden />
                        Activate
                      </button>
                    )}
                    {onRoleChange && (
                      <span className="flex flex-wrap gap-1">
                        {(["user", "creator", "moderator", "admin"] as const).map(
                          (role) =>
                            role !== user.role && (
                              <button
                                key={role}
                                type="button"
                                onClick={() => onRoleChange(user.id, role)}
                                className="px-2 py-0.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                              >
                                {role}
                              </button>
                            )
                        )}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
