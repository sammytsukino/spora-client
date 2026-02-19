import { useState, useEffect } from "react";
import { listFloras } from "@/lib/floras";
import { floraImages } from "@/data/flora-data";
import { getOptimizedThumbnailUrl } from "@/lib/cloudinary";

const MIN_THUMBNAILS = 6;

export interface FloraThumbnail {
  url: string;
  id?: string;
}

export function useFloraThumbnails(limit = 40) {
  const [items, setItems] = useState<FloraThumbnail[]>(() =>
    floraImages.map((url) => ({ url: getOptimizedThumbnailUrl(url) }))
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    listFloras({ limit })
      .then((floras) => {
        if (cancelled) return;
        const withThumb = floras
          .filter((f) => f.thumbnailUrl)
          .map((f) => ({
            url: getOptimizedThumbnailUrl(f.thumbnailUrl),
            id: f.shortId ?? f._id,
          }));
        const fallback = floraImages.map((url) => ({ url: getOptimizedThumbnailUrl(url) }));
        const combined =
          withThumb.length >= MIN_THUMBNAILS
            ? withThumb
            : [...withThumb, ...fallback].slice(0, Math.max(withThumb.length, fallback.length));
        setItems(combined.length > 0 ? combined : fallback);
      })
      .catch(() => {
        if (!cancelled)
          setItems(floraImages.map((url) => ({ url: getOptimizedThumbnailUrl(url) })));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { items, isLoading };
}
