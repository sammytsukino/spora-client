import { Download, ExternalLink, UserX, Check, Trash2 } from "lucide-react";
import type { AdminFlaggedItem, FlaggedStatus } from "@/data/admin-data";

interface AdminFlaggedContentProps {
  items: AdminFlaggedItem[];
  onItemClick?: (item: AdminFlaggedItem) => void;
  onStatusChange?: (itemId: string, status: FlaggedStatus) => void;
  onViewContent?: (item: AdminFlaggedItem) => void;
  onDownload?: (item: AdminFlaggedItem) => void;
  onSuspendAuthor?: (item: AdminFlaggedItem) => void;
}

const statusStyles: Record<FlaggedStatus, string> = {
  pending: "bg-amber-200 border-amber-700",
  approved: "bg-lime-300 border-lime-300",
  removed: "bg-stone-200 border-[#262626]",
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
  onItemClick,
  onStatusChange,
  onViewContent,
  onDownload,
  onSuspendAuthor,
}: AdminFlaggedContentProps) {
  if (items.length === 0) {
    return (
      <section className="border-2 border-[#262626] bg-[#E9E9E9] p-6">
        <h2 className="font-supply-mono font-bold text-sm uppercase mb-4">
          Flagged content
        </h2>
        <p className="font-supply-mono text-[11px] opacity-80">
          No flagged content.
        </p>
      </section>
    );
  }

  return (
    <section className="border-2 border-[#262626] bg-[#E9E9E9] p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="font-supply-mono font-bold text-sm uppercase">
          Flagged content
        </h2>
        <span className="font-supply-mono text-[11px] opacity-80">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            <article
              className="border-2 border-[#262626] bg-[#E9E9E9] p-4 font-supply-mono text-[11px]"
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
                  <span className="font-bold">{item.id}</span>
                  <span className="uppercase opacity-80">{item.contentType}</span>
                  <span className="opacity-80">{item.contentId}</span>
                  <span
                    className={`px-2 py-0.5 border-2 uppercase shrink-0 ${statusStyles[item.status]}`}
                  >
                    {item.status}
                  </span>
                </div>
                <span className="opacity-70 text-[10px]">
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
                <p className="mb-4 opacity-80 italic border-l-2 border-[#262626] pl-3 py-1">
                  {item.contentPreview}
                </p>
              )}
              <div
                className="flex flex-wrap items-center gap-2 pt-3 border-t-2 border-[#262626]"
                onClick={(e) => e.stopPropagation()}
              >
                {onViewContent && (
                  <button
                    type="button"
                    onClick={() => onViewContent(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                    View content
                  </button>
                )}
                {onDownload && (
                  <button
                    type="button"
                    onClick={() => onDownload(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-[#262626] hover:bg-[#262626] hover:text-lime-300 text-[10px] uppercase"
                  >
                    <Download className="size-3.5" aria-hidden />
                    Download
                  </button>
                )}
                {onSuspendAuthor && item.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => onSuspendAuthor(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-[10px] uppercase"
                  >
                    <UserX className="size-3.5" aria-hidden />
                    Suspend author
                  </button>
                )}
                {onStatusChange && item.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => onStatusChange(item.id, "approved")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-lime-300 text-[#262626] hover:bg-lime-300 hover:text-white text-[10px] uppercase"
                    >
                      <Check className="size-3.5" aria-hidden />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onStatusChange(item.id, "removed")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-[10px] uppercase"
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
    </section>
  );
}
