import { useEffect, useState } from "react";

/**
 * Samples an image and computes average luminance (0-1).
 * Returns "light" if luminance > 0.5 (use dark text), "dark" otherwise (use light text).
 */
export function useImageLuminance(imageSrc: string | undefined): "light" | "dark" | null {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    if (!imageSrc) {
      setTheme(null);
      return;
    }

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (cancelled) return;

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setTheme("dark");
          return;
        }

        // Use small size for performance; sample grid
        const maxDim = 64;
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        const scale = Math.min(maxDim / w, maxDim / h, 1);
        canvas.width = Math.max(1, w * scale);
        canvas.height = Math.max(1, h * scale);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = data.data;

        let sum = 0;
        let count = 0;
        const step = 4; // sample every Nth pixel for speed

        for (let i = 0; i < pixels.length; i += step) {
          const r = pixels[i] / 255;
          const g = pixels[i + 1] / 255;
          const b = pixels[i + 2] / 255;
          const a = pixels[i + 3] / 255;
          if (a > 0.1) {
            // relative luminance (sRGB)
            const l = 0.299 * r + 0.587 * g + 0.114 * b;
            sum += l;
            count++;
          }
        }

        const avg = count > 0 ? sum / count : 0.5;
        setTheme(avg > 0.5 ? "light" : "dark");
      } catch {
        setTheme("dark");
      }
    };

    img.onerror = () => {
      if (!cancelled) setTheme("dark");
    };

    img.src = imageSrc;

    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  return theme;
}
