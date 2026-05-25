import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  readerChromePanel,
  readerChromeSummary,
  type SporaDetailsMenuPlacement,
  type SporaDetailsMenuTone,
} from "@/components/shared/sporaDetailsMenuStyles";

export type { SporaDetailsMenuPlacement, SporaDetailsMenuTone };

export interface SporaDetailsMenuProps {
  label: ReactNode;
  placement?: SporaDetailsMenuPlacement;
  align?: "end" | "start";

  tone?: SporaDetailsMenuTone;
  className?: string;
  summaryClassName?: string;
  panelClassName?: string;
  summaryStyle?: CSSProperties;
  panelStyle?: CSSProperties;
  children: ReactNode;
  "aria-label"?: string;
}


export default function SporaDetailsMenu({
  label,
  placement = "down",
  align = "end",
  tone,
  className,
  summaryClassName,
  panelClassName,
  summaryStyle,
  panelStyle,
  children,
  "aria-label": ariaLabel,
}: SporaDetailsMenuProps) {
  const panelPosition =
    placement === "up"
      ? "bottom-full mb-1"
      : "top-full mt-1";
  const horizontal = align === "end" ? "right-0" : "left-0";
  const textAlign = align === "end" ? "text-right" : "text-left";
  const itemsAlign = align === "end" ? "items-end" : "items-start";

  return (
    <details
      className={cn(
        "spora-details-menu font-supply-mono group relative bg-transparent border-0 shadow-none",
        textAlign,
        className
      )}
    >
      <summary
        className={cn(
          "font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase cursor-pointer list-none shadow-none outline-none ring-0",
          tone
            ? cn("inline-block max-w-full", readerChromeSummary[tone])
            : "inline-block max-w-full bg-transparent border-0 p-0 hover:underline focus-visible:underline",
          align === "end" ? "ms-auto" : "me-auto",
          summaryClassName
        )}
        style={summaryStyle}
        aria-label={ariaLabel}
      >
        {label}
      </summary>
      <div
        className={cn(
          "absolute z-30 flex flex-col gap-3 outline-none",
          "min-w-[220px] max-w-[min(100vw-3rem,280px)]",
          panelPosition,
          horizontal,
          itemsAlign,
          tone ? readerChromePanel[tone] : "bg-transparent p-0 border-0 shadow-none",
          panelClassName
        )}
        style={panelStyle}
      >
        {children}
      </div>
    </details>
  );
}
