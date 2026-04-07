import { Globe, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FilterTabs from "@/components/shared/FilterTabs";
import { cn } from "@/lib/utils";

export type GalleryFeedScope = "all" | "following";

interface GalleryFeedFiltersProps {
  showFollowingOption: boolean;
  feedScope: GalleryFeedScope;
  onFeedScopeChange: (scope: GalleryFeedScope) => void;
  generationFilters: readonly string[];
  activeGeneration: string;
  onGenerationChange: (value: string) => void;
}

function FeedScopeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 border px-2 py-1 font-supply-mono text-[10px] uppercase transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-spora-primary focus-visible:ring-offset-2 sm:px-3 sm:text-[11px]",
        active
          ? "cursor-default border-spora-primary bg-spora-primary text-spora-accent-secondary"
          : "cursor-pointer border-spora-primary bg-transparent text-spora-primary hover:border-spora-primary hover:bg-spora-primary/10"
      )}
      onClick={onClick}
    >
      <Icon className="size-3.5 shrink-0 opacity-90" aria-hidden />
      {label}
    </button>
  );
}

export default function GalleryFeedFilters({
  showFollowingOption,
  feedScope,
  onFeedScopeChange,
  generationFilters,
  activeGeneration,
  onGenerationChange,
}: GalleryFeedFiltersProps) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      {showFollowingOption && (
        <div className="flex min-w-0 shrink-0 flex-wrap gap-2">
          <FeedScopeButton
            active={feedScope === "all"}
            onClick={() => onFeedScopeChange("all")}
            icon={Globe}
            label="Everyone"
          />
          <FeedScopeButton
            active={feedScope === "following"}
            onClick={() => onFeedScopeChange("following")}
            icon={UserPlus}
            label="Following"
          />
        </div>
      )}

      <div
        className={cn(
          "flex min-w-0",
          showFollowingOption ? "items-end justify-end" : "w-full items-end justify-end"
        )}
      >
        <FilterTabs
          filters={generationFilters}
          activeFilter={activeGeneration}
          onFilterChange={onGenerationChange}
          className="justify-end"
        />
      </div>
    </div>
  );
}
