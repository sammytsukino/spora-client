import { useState, useEffect } from "react";
import { listFloras, type ApiFlora } from "@/lib/floras";
import { floraImages } from "@/data/flora-data";
import { cldImage } from "@/lib/cloudinary";

const MIN_THUMBNAILS = 6;

function readerPreviewFields(f: ApiFlora) {
  const authorName = f.authorUsername
    ? f.authorUsername.startsWith("@")
      ? f.authorUsername
      : `@${f.authorUsername}`
    : "@Anonymous";
  const seedSource = f.generative?.soilId || f.generative?.soilName || f._id;
  const seed = `#${String(seedSource).slice(-6).toUpperCase()}`;
  const gen = Number.isFinite(f.lineage?.generation) ? Number(f.lineage?.generation) : 0;
  return {
    title: f.title,
    author: authorName,
    excerpt: (f.text || "").slice(0, 500),
    seed,
    generation: `GEN_${gen}`,
  };
}

export interface FloraThumbnail {
  url: string;
  id?: string;
  title?: string;
  author?: string;
  excerpt?: string;
  seed?: string;
  generation?: string;
}

export function useFloraThumbnails(limit = 40) {
  const [items, setItems] = useState<FloraThumbnail[]>(() =>
    floraImages.map((url) => ({ url: cldImage(url, "thumbnail") }))
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    listFloras({ limit })
      .then((floras) => {
        if (cancelled) return;
        const withThumb = floras
          .filter(
            (f) =>
              Boolean(f.thumbnailUrl) &&
              f.status !== "hidden" &&
              f.isHidden !== true
          )
          .map((f) => ({
            url: cldImage(f.thumbnailUrl, "thumbnail"),
            id: f.shortId ?? f._id,
            ...readerPreviewFields(f),
          }));
        const fallback = floraImages.map((url) => ({ url: cldImage(url, "thumbnail") }));
        const combined =
          withThumb.length >= MIN_THUMBNAILS
            ? withThumb
            : [...withThumb, ...fallback].slice(0, Math.max(withThumb.length, fallback.length));
        setItems(combined.length > 0 ? combined : fallback);
      })
      .catch(() => {
        if (!cancelled)
          setItems(floraImages.map((url) => ({ url: cldImage(url, "thumbnail") })));
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
