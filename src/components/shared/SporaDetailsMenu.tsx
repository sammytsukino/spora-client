import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SporaDetailsMenuPlacement = "up" | "down";

export interface SporaDetailsMenuProps {
  
  label: ReactNode;
  
  placement?: SporaDetailsMenuPlacement;
  
  align?: "end" | "start";
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
          "font-supply-mono text-[11px] sm:text-xs tracking-[0.25em] uppercase cursor-pointer list-none bg-transparent border-0 p-0 shadow-none outline-none ring-0",
          "inline-block max-w-full hover:underline focus-visible:underline",
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
          "absolute z-30 flex flex-col gap-3 bg-transparent p-0 border-0 shadow-none outline-none",
          "min-w-[220px] max-w-[min(100vw-3rem,280px)]",
          panelPosition,
          horizontal,
          itemsAlign,
          panelClassName
        )}
        style={panelStyle}
      >
        {children}
      </div>
    </details>
  );
}
