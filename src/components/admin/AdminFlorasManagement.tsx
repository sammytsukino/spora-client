import { useState } from "react";
import ConfirmModal from "@/components/shared/ConfirmModal";
import type { ApiFlora } from "@/lib/admin-api";
import {
  adminButtonDanger,
  adminButtonNeutral,
  adminButtonSuccess,
  adminButtonWarning,
} from "@/components/admin/adminButtonStyles";

interface AdminFlorasManagementProps {
  floras: ApiFlora[];
  onBatchFloras: (ids: string[], action: "hide" | "unhide" | "delete") => Promise<void>;
}

function formatDate(s?: string) {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export default function AdminFlorasManagement({
  floras,
  onBatchFloras,
}: AdminFlorasManagementProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [working, setWorking] = useState(false);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: "default" | "danger";
    confirmLabel: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    variant: "default",
    confirmLabel: "CONFIRM",
    onConfirm: () => {},
  });

  const selectAll = () => {
    if (selectedIds.size === floras.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(floras.map((f) => f._id)));
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const requestBatch = (action: "hide" | "unhide" | "delete") => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const n = ids.length;
    const plural = n !== 1 ? "s" : "";
    if (action === "delete") {
      setConfirm({
        open: true,
        title: "Delete Floras",
        description: `Delete ${n} Flora${plural}? This cannot be undone.`,
        variant: "danger",
        confirmLabel: "DELETE",
        onConfirm: () => {
          setConfirm((c) => ({ ...c, open: false }));
          void runBatch(action, ids);
        },
      });
      return;
    }
    const verb = action === "hide" ? "hide" : "unhide";
    setConfirm({
      open: true,
      title: action === "hide" ? "Hide Floras" : "Unhide Floras",
      description: `${verb.charAt(0).toUpperCase() + verb.slice(1)} ${n} Flora${plural}?`,
      variant: "default",
      confirmLabel: action === "hide" ? "HIDE" : "UNHIDE",
      onConfirm: () => {
        setConfirm((c) => ({ ...c, open: false }));
        void runBatch(action, ids);
      },
    });
  };

  const runBatch = async (
    action: "hide" | "unhide" | "delete",
    ids: string[]
  ) => {
    setWorking(true);
    try {
      await onBatchFloras(ids, action);
      setSelectedIds(new Set());
    } finally {
      setWorking(false);
    }
  };

  return (
    <section className="border border-spora-primary bg-spora-primary-light p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h2 className="font-supply-mono font-bold text-sm uppercase">
            All Floras
          </h2>
          <span className="font-supply-mono text-[11px] opacity-80">
            {floras.length} Flora{floras.length !== 1 ? "s" : ""}
          </span>
          <label className="flex items-center gap-2 cursor-pointer font-supply-mono text-[11px]">
            <input
              type="checkbox"
              checked={
                floras.length > 0 && selectedIds.size === floras.length
              }
              onChange={selectAll}
              className="w-4 h-4 border-2 border-spora-primary"
            />
            Select all
          </label>
        </div>
        {selectedIds.size > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={working}
              onClick={() => requestBatch("hide")}
              className={adminButtonWarning}
            >
              Hide ({selectedIds.size})
            </button>
            <button
              type="button"
              disabled={working}
              onClick={() => requestBatch("unhide")}
              className={adminButtonSuccess}
            >
              Unhide ({selectedIds.size})
            </button>
            <button
              type="button"
              disabled={working}
              onClick={() => requestBatch("delete")}
              className={adminButtonDanger}
            >
              Delete ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className={adminButtonNeutral}
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
      <ul className="space-y-3 max-h-[60vh] overflow-y-auto">
        {floras.map((flora) => (
          <li key={flora._id}>
            <article
              className={`border p-3 font-supply-mono text-[11px] transition-colors cursor-pointer ${
                selectedIds.has(flora._id)
                  ? "border-amber-600 bg-amber-50/50"
                  : "border-spora-primary bg-spora-primary-light hover:bg-spora-primary-lighter"
              }`}
              onClick={() => toggleSelect(flora._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleSelect(flora._id);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="flex items-center gap-3 flex-wrap min-w-0">
                <input
                  type="checkbox"
                  checked={selectedIds.has(flora._id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSelect(flora._id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 border-2 border-spora-primary shrink-0"
                />
                <div
                  className="w-12 h-12 shrink-0 rounded overflow-hidden bg-spora-primary-lighter border border-spora-primary"
                  role="img"
                  aria-label={`Thumbnail for ${flora.title}`}
                >
                  {flora.thumbnailUrl ? (
                    <img
                      src={flora.thumbnailUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-overline-xs text-[#888] font-supply-mono">
                      —
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 min-w-0 flex-1">
                  <span className="font-bold truncate max-w-[200px]" title={flora.title}>
                    {flora.title}
                  </span>
                  <span className="uppercase opacity-80">{flora.status ?? "—"}</span>
                  {flora.isHidden && (
                    <span className="px-2 py-0.5 border border-amber-600 bg-amber-100 text-amber-700 uppercase text-overline-xs">
                      Hidden
                    </span>
                  )}
                  <span className="opacity-70 truncate max-w-[120px]" title={flora.authorUsername}>
                    {flora.authorUsername ?? "@—"}
                  </span>
                </div>
                <span className="opacity-70 text-overline-xs shrink-0 ml-auto">
                  {formatDate(flora.createdAt)}
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
      {floras.length === 0 && (
        <p className="font-supply-mono text-sm opacity-70 py-8 text-center">
          No Floras found.
        </p>
      )}
      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        description={confirm.description}
        variant={confirm.variant}
        confirmLabel={confirm.confirmLabel}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />
    </section>
  );
}
