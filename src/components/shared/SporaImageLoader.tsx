import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./SporaImageLoader.module.css";

export const SPORA_LOADER_IMAGE_URL =
  "https://res.cloudinary.com/dsy30p7gf/image/upload/q_auto/f_auto/v1776168111/1loader_jdkfip.png";

export const SPORA_IFRAME_LOADER_MIN_MS = 2500;

export const SPORA_LOADER_DURATION_SEC = 2.5;

type SporaImageLoaderProps = {
  className?: string;
  durationSec?: number;
};

function SporaImageLoader({
  className,
  durationSec = SPORA_LOADER_DURATION_SEC,
}: SporaImageLoaderProps) {
  return (
    <div
      className={cn(styles.loader, className)}
      style={
        {
          "--spora-loader-duration": `${durationSec}s`,
        } as CSSProperties
      }
      role="status"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="sr-only">Loading</span>
      <img src={SPORA_LOADER_IMAGE_URL} alt="" draggable={false} />
    </div>
  );
}

export default SporaImageLoader;

export function SporaScreenLoaderCenter({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[min(50vh,420px)] w-full flex-1 flex-col items-center justify-center py-10",
        className
      )}
    >
      {children ?? <SporaImageLoader />}
    </div>
  );
}
