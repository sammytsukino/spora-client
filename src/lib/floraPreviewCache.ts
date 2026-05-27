const STORAGE_PREFIX = "spora:flora-preview:";
const PREVIEW_TTL_MS = 5 * 60 * 1000;

export type FloraPreview = {
  id: string;
  generation: string;
  image: string;
  title: string;
  excerpt: string;
  author: string;
  seed: string;
};

type StoredFloraPreview = FloraPreview & { storedAt: number };

export function stashFloraPreview(preview: FloraPreview): void {
  if (typeof window === "undefined" || !preview.id) return;
  try {
    const payload: StoredFloraPreview = { ...preview, storedAt: Date.now() };
    localStorage.setItem(`${STORAGE_PREFIX}${preview.id}`, JSON.stringify(payload));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function readFloraPreview(id: string): FloraPreview | null {
  if (typeof window === "undefined" || !id) return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredFloraPreview;
    if (!parsed?.id || Date.now() - parsed.storedAt > PREVIEW_TTL_MS) {
      localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
      return null;
    }
    return {
      id: parsed.id,
      generation: parsed.generation,
      image: parsed.image,
      title: parsed.title,
      excerpt: parsed.excerpt,
      author: parsed.author,
      seed: parsed.seed,
    };
  } catch {
    return null;
  }
}

export function clearFloraPreview(id: string): void {
  if (typeof window === "undefined" || !id) return;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
  } catch {
    // Ignore storage errors.
  }
}
