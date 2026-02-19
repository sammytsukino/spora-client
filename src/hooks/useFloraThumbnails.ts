import { useState, useEffect } from "react";
import { listFloras } from "@/lib/floras";
import { floraImages } from "@/data/flora-data";

const MIN_THUMBNAILS = 6;

export function useFloraThumbnails(limit = 40) {
  const [images, setImages] = useState<string[]>(floraImages);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    listFloras({ limit })
      .then((floras) => {
        if (cancelled) return;
        const urls = floras
          .map((f) => f.thumbnailUrl)
          .filter((url): url is string => !!url);
        const combined =
          urls.length >= MIN_THUMBNAILS
            ? urls
            : [...urls, ...floraImages].slice(0, Math.max(urls.length, floraImages.length));
        setImages(combined.length > 0 ? combined : floraImages);
      })
      .catch(() => {
        if (!cancelled) setImages(floraImages);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { images, isLoading };
}
