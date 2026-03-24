import { useState } from "react";
import { Download, ExternalLink, UserX, Check, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/shared/ConfirmModal";
import type { AdminFlaggedItem, FlaggedStatus } from "@/data/admin-data";

interface AdminFlaggedContentProps {
  items: AdminFlaggedItem[];
  title?: string;
  onItemClick?: (item: AdminFlaggedItem) => void;
  onStatusChange?: (itemId: string, status: FlaggedStatus) => void;
  onViewContent?: (item: AdminFlaggedItem) => void;
  onDownload?: (item: AdminFlaggedItem) => void;
  onSuspendAuthor?: (item: AdminFlaggedItem) => void;
  onHideFlora?: (floraId: string) => void;
  onBatchFloras?: (
    ids: string[],
    action: "hide" | "unhide" | "delete"
  ) => void;
}

const statusStyles: Record<FlaggedStatus, string> = {
  pending: "bg-amber-200 border-amber-700",
  approved: "bg-lime-300 border-lime-300",
  removed: "bg-stone-200 border-spora-primary",
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

export default function AdminFlaggedContent({
  items,
  title = "Flagged content",
  onItemClick,
  onStatusChange,
  onViewContent,
  onDownload,
  onSuspendAuthor,
  onHideFlora,
  onBatchFloras,
}: AdminFlaggedContentProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open: false, title: "", description: "", onConfirm: () => {} });

  const handleHideFlora = (item: AdminFlaggedItem) => {
    if (!onHideFlora) return;
    setConfirm({
      open: true,
      title: "Hide flora",
      description: `Are you sure you want to hide this flora? It will no longer be visible to other users.`,
      onConfirm: () => {
        onHideFlora(item.contentId);
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

  const floraItems = items.filter((i) => i.contentType === "flora");
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const selectAll = () => {
    if (selectedIds.size === floraItems.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(floraItems.map((i) => i.contentId)));
  };
  const runBatch = (action: "hide" | "unhide" | "delete") => {
    if (!onBatchFloras || selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);
    const actionLabels = { hide: "hide", unhide: "unhide", delete: "delete" };
    setConfirm({
      open: true,
      title: `Batch ${actionLabels[action]}`,
      description: `Are you sure you want to ${action} ${ids.length} flora${ids.length !== 1 ? "s" : ""}?${action === "delete" ? " This cannot be undone." : ""}`,
      onConfirm: () => {
        onBatchFloras(ids, action);
        setSelectedIds(new Set());
        setConfirm((c) => ({ ...c, open: false }));
      },
    });
  };

  if (items.length === 0) {
    return (
      <section className="border border-[var(--spora-primary)] bg-spora-primary-light p-6">
        <h2 className="font-supply-mono font-bold text-sm uppercase mb-4">
          {title}
        </h2>
        <p className="font-supply-mono text-caption-sm opacity-80">
          No flagged content.
        </p>
      </section>
    );
  }

  return (
    <section className="border border-[var(--spora-primary)] bg-spora-primary-light p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <h2 className="font-supply-mono font-bold text-sm uppercase">
            {title}
          </h2>
          <span className="font-supply-mono text-caption-sm opacity-80">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </span>
          {onBatchFloras && floraItems.length > 0 && (
            <label className="flex items-center gap-2 cursor-pointer font-supply-mono text-caption-sm">
              <input
                type="checkbox"
                checked={
                  floraItems.length > 0 &&
                  floraItems.every((i) => selectedIds.has(i.contentId))
                }
                onChange={selectAll}
                className="w-4 h-4 border-2 border-[var(--spora-primary)]"
              />
              Select all
            </label>
          )}
        </div>
        {selectedIds.size > 0 && onBatchFloras && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => runBatch("hide")}
              className="px-3 py-1.5 border border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white text-overline-xs uppercase font-supply-mono"
            >
              Hide ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={() => runBatch("unhide")}
              className="px-3 py-1.5 border border-lime-300 text-spora-primary hover:bg-lime-300 text-overline-xs uppercase font-supply-mono"
            >
              Unhide ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={() => runBatch("delete")}
              className="px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-overline-xs uppercase font-supply-mono"
            >
              Delete ({selectedIds.size})
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase font-supply-mono"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            <article
              className={`border bg-spora-primary-light p-4 font-supply-mono text-caption-sm transition-colors ${selectedIds.has(item.contentId) ? "border-amber-600 bg-amber-50/50" : "border-[var(--spora-primary)]"}`}
              onClick={() => onItemClick?.(item)}
              onKeyDown={(e) =>
                onItemClick &&
                (e.key === "Enter" || e.key === " ") &&
                onItemClick(item)
              }
              role={onItemClick ? "button" : undefined}
              tabIndex={onItemClick ? 0 : undefined}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {onBatchFloras && item.contentType === "flora" && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.contentId)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(item.contentId);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 border-2 border-[var(--spora-primary)]"
                    />
                  )}
                  <span className="font-bold">{item.id}</span>
                  <span className="uppercase opacity-80">{item.contentType}</span>
                  <span className="opacity-80">{item.contentId}</span>
                  <span
                    className={`px-2 py-0.5 border uppercase shrink-0 ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
                <span className="opacity-70 text-overline-xs">
                  {formatDate(item.flaggedAt)}
                </span>
              </div>
              <div className="mb-2">
                <span className="opacity-80">
                  Reported by: <strong>{item.reportedBy}</strong>
                </span>
                <span className="mx-2 opacity-50">—</span>
                <span className="opacity-80 font-medium">{item.reason}</span>
              </div>
              {item.contentPreview && (
                <p className="mb-4 opacity-80 italic border-l border-[var(--spora-primary)] pl-3 py-1">
                  {item.contentPreview}
                </p>
              )}
              <div
                className="flex flex-wrap items-center gap-2 pt-3 border-t border-[var(--spora-primary)]"
                onClick={(e) => e.stopPropagation()}
              >
                {onViewContent && (
                  <button
                    type="button"
                    onClick={() => onViewContent(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase"
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                    View content
                  </button>
                )}
                {onDownload && (
                  <button
                    type="button"
                    onClick={() => onDownload(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[var(--spora-primary)] hover:bg-spora-primary hover:text-lime-300 text-overline-xs uppercase"
                  >
                    <Download className="size-3.5" aria-hidden />
                    Download
                  </button>
                )}
                {item.contentType === "flora" && onHideFlora && (
                  <button
                    type="button"
                    onClick={() => handleHideFlora(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white text-overline-xs uppercase"
                  >
                    Hide flora
                  </button>
                )}
                {onSuspendAuthor && item.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => onSuspendAuthor(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-overline-xs uppercase"
                  >
                    <UserX className="size-3.5" aria-hidden />
                    Suspend author
                  </button>
                )}
                {onStatusChange && item.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirm({
                          open: true,
                          title: "Approve content",
                          description:
                            "This will approve the content and clear the pending flag.",
                          onConfirm: () => {
                            onStatusChange(item.id, "approved");
                            setConfirm((c) => ({ ...c, open: false }));
                          },
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-lime-300 text-spora-primary hover:bg-lime-300 hover:text-white text-overline-xs uppercase"
                    >
                      <Check className="size-3.5" aria-hidden />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirm({
                          open: true,
                          title: "Remove content",
                          description:
                            "Are you sure you want to remove this content? This action cannot be undone.",
                          onConfirm: () => {
                            onStatusChange(item.id, "removed");
                            setConfirm((c) => ({ ...c, open: false }));
                          },
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-overline-xs uppercase"
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Remove content
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
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm((c) => ({ ...c, open: false }))}
      />
    </section>
  );
}
