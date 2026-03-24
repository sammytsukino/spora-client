import { useState } from "react";
import { Download, User, UserX, Ban, CheckCircle, UserMinus } from "lucide-react";
import ConfirmModal from "@/components/shared/ConfirmModal";
import type { AdminUserSummary, UserRole, UserStatus } from "@/data/admin-data";

interface AdminUserManagementProps {
  users: AdminUserSummary[];
  onUserClick?: (user: AdminUserSummary) => void;
  onRoleChange?: (userId: string, role: UserRole) => void;
  onStatusChange?: (userId: string, status: UserStatus) => void;
  onUnsign?: (user: AdminUserSummary) => void;
  onExportUsers?: () => void;
  onExportUser?: (user: AdminUserSummary) => void;
  onSuspend?: (user: AdminUserSummary) => void;
  onBan?: (user: AdminUserSummary) => void;
  onActivate?: (user: AdminUserSummary) => void;
  onBatchUsers?: (
    ids: string[],
    status: "suspend" | "ban" | "activate"
  ) => void;
}

const roleStyles: Record<UserRole, string> = {
  user: "border-spora-primary bg-spora-primary-light",
  creator: "border-lime-300 bg-lime-300",
  cultivator: "border-lime-300 bg-lime-300",
  moderator: "border-sky-600 bg-sky-100",
  admin: "border-amber-600 bg-amber-100",
};

const statusStyles: Record<UserStatus, string> = {
  active: "border-lime-300 bg-lime-300",
  suspended: "border-amber-600 bg-amber-100",
  banned: "border-red-600 bg-red-100",
  deleted: "border-red-600 bg-red-100",
};

export default function AdminUserManagement({
  users,
  onUserClick,
  onRoleChange,
  onUnsign,
  onExportUsers,
  onExportUser,
  onSuspend,
  onBan,
  onActivate,
  onBatchUsers,
}: AdminUserManagementProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });

  const handleUnsign = (user: AdminUserSummary) => {
    if (!onUnsign) return;
    setConfirm({
      open: true,
      title: "Unsign user",
      description: `This will anonymize all Floras by ${user.username}. Authorship will be removed and attributed to "Forgotten Author". This action cannot be undone.`,
      onConfirm: () => {
        onUnsign(user);
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

  const handleSuspend = (user: AdminUserSummary) => {
    if (!onSuspend) return;
    setConfirm({
      open: true,
      title: "Suspend user",
      description: `Suspend ${user.username}? The user will not be able to access their account.`,
      onConfirm: () => {
        onSuspend(user);
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

  const handleBan = (user: AdminUserSummary) => {
    if (!onBan) return;
    setConfirm({
      open: true,
      title: "Ban user",
      description: `Permanently ban ${user.username}? The user will not be able to access their account.`,
      onConfirm: () => {
        onBan(user);
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

  const handleActivate = (user: AdminUserSummary) => {
    if (!onActivate) return;
    setConfirm({
      open: true,
      title: "Activate user",
      description: `Reactivate ${user.username}'s account?`,
      onConfirm: () => {
        onActivate(user);
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    if (!onRoleChange) return;
    const targetUser = users.find((u) => u.id === userId);
    setConfirm({
      open: true,
      title: "Change role",
      description: `Change ${targetUser?.username ?? "this user"}'s role to ${role}?`,
      onConfirm: () => {
        onRoleChange(userId, role);
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectAll = () => {
    if (selectedIds.size === users.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(users.map((u) => u.id)));
  };
  const runBatch = (status: "suspend" | "ban" | "activate") => {
    if (!onBatchUsers || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const labels = { suspend: "suspend", ban: "ban", activate: "activate" };
    setConfirm({
      open: true,
      title: `Batch ${labels[status]}`,
      description: `Are you sure you want to ${labels[status]} ${ids.length} user${ids.length !== 1 ? "s" : ""}?`,
      onConfirm: () => {
        onBatchUsers(ids, status);
        setSelectedIds(new Set());
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

  if (users.length === 0) {
    return (
      <section className="border border-[var(--spora-primary)] bg-spora-primary-light p-6">
        <h2 className="font-supply-mono font-bold text-sm uppercase mb-4">
          User management
        </h2>
        <p className="font-supply-mono text-caption-sm opacity-80">
          No users found.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-[var(--spora-primary)] bg-spora-primary-light p-6 overflow-x-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h2 className="font-supply-mono font-bold text-sm uppercase">
            User management
          </h2>
          {onBatchUsers && (
            <label className="flex items-center gap-2 cursor-pointer font-supply-mono text-caption-sm">
              <input
                type="checkbox"
                checked={
                  users.length > 0 && users.every((u) => selectedIds.has(u.id))
                }
                onChange={selectAll}
                className="w-4 h-4 border-2 border-[var(--spora-primary)]"
              />
              Select all
            </label>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
        {selectedIds.size > 0 && onBatchUsers && (
          <>
            <button
              type="button"
              onClick={() => runBatch("suspend")}
              className="px-3 py-1.5 border border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white text-overline-xs uppercase font-supply-mono"
            >
              Suspend ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={() => runBatch("ban")}
              className="px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-overline-xs uppercase font-supply-mono"
            >
              Ban ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={() => runBatch("activate")}
              className="px-3 py-1.5 border border-lime-300 text-spora-primary hover:bg-lime-300 text-overline-xs uppercase font-supply-mono"
            >
              Activate ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase font-supply-mono"
            >
              Clear
            </button>
          </>
        )}
        {onExportUsers && (
          <button
            type="button"
            onClick={onExportUsers}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-spora-primary hover:bg-spora-primary hover:text-lime-300 font-supply-mono text-overline-xs uppercase"
          >
            <Download className="size-3.5" aria-hidden />
            Export all users
          </button>
        )}
        </div>
      </div>
      <div className="border border-[var(--spora-primary)] bg-spora-primary-light min-w-[720px]">
        <table className="w-full font-supply-mono text-caption-sm">
          <thead>
            <tr className="border-b border-[var(--spora-primary)] bg-spora-primary-light">
              <th className="text-left p-3 uppercase w-8">
                {onBatchUsers ? (
                  <span className="sr-only">Select</span>
                ) : null}
              </th>
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
                className="border-b border-[var(--spora-primary)] hover:bg-lime-300 transition-colors align-top"
                role={onUserClick ? "button" : undefined}
                onClick={() => onUserClick?.(user)}
                onKeyDown={(e) =>
                  onUserClick &&
                  (e.key === "Enter" || e.key === " ") &&
                  onUserClick(user)
                }
                tabIndex={onUserClick ? 0 : undefined}
              >
                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                  {onBatchUsers ? (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="w-4 h-4 border-2 border-[var(--spora-primary)]"
                    />
                  ) : null}
                </td>
                <td className="p-3 font-medium">{user.username}</td>
                <td className="p-3 opacity-80 truncate max-w-[180px]">
                  {user.email}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 border uppercase ${roleStyles[user.role]}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 border uppercase ${statusStyles[user.status]}`}
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
                        className="inline-flex items-center gap-1 px-2 py-1 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase"
                      >
                        <User className="size-3" aria-hidden />
                        View
                      </button>
                    )}
                    {onExportUser && (
                      <button
                        type="button"
                        onClick={() => onExportUser(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase"
                      >
                        <Download className="size-3" aria-hidden />
                        Export
                      </button>
                    )}
                    {onUnsign && user.florasCount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleUnsign(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white text-overline-xs uppercase"
                        title="Withdraw signature: anonymize author on all Floras by this user while preserving content and Lineage"
                      >
                        <UserMinus className="size-3" aria-hidden />
                        Unsign
                      </button>
                    )}
                    {onSuspend && user.status === "active" && (
                      <button
                        type="button"
                        onClick={() => handleSuspend(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white text-overline-xs uppercase"
                      >
                        <UserX className="size-3" aria-hidden />
                        Suspend
                      </button>
                    )}
                    {onBan && user.status !== "banned" && (
                      <button
                        type="button"
                        onClick={() => handleBan(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-overline-xs uppercase"
                      >
                        <Ban className="size-3" aria-hidden />
                        Ban
                      </button>
                    )}
                    {onActivate && (user.status === "suspended" || user.status === "banned") && (
                      <button
                        type="button"
                        onClick={() => handleActivate(user)}
                        className="inline-flex items-center gap-1 px-2 py-1 border border-lime-300 text-spora-primary hover:bg-lime-300 hover:text-white text-overline-xs uppercase"
                      >
                        <CheckCircle className="size-3" aria-hidden />
                        Activate
                      </button>
                    )}
                    {onRoleChange && (
                      <span className="flex flex-wrap gap-1">
                        {(["cultivator", "admin"] as const).map(
                          (role) =>
                            role !== user.role && (
                              <button
                                key={role}
                                type="button"
                                onClick={() => handleRoleChange(user.id, role)}
                                className="px-2 py-0.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase"
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
      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        description={confirm.description}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />
    </section>
  );
}
