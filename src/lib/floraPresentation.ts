import { floraImages } from "@/data/flora-data";
import { cldImage } from "@/lib/cloudinary";
import type { ApiFlora } from "@/lib/floras";

export interface LineageItem {
  handle: string;
  floraId?: string;
}

export function ensureHandle(username: string): string {
  return username.startsWith("@") ? username : `@${username}`;
}

export function formatGeneration(value?: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `GEN_${safe}`;
}

export function formatSeed(flora: ApiFlora): string {
  const seedSource = flora.generative?.soilId || flora.generative?.soilName || flora._id;
  return `#${seedSource.slice(-6).toUpperCase()}`;
}

export function resolveFloraAuthor(flora: ApiFlora): {
  author: string;
  authorName: string | null;
} {
  const authorName =
    flora.authorUsername ??
    (typeof flora.author === "object" && flora.author && "username" in flora.author
      ? (flora.author as { username: string }).username
      : null);
  const author = authorName
    ? authorName.startsWith("@")
      ? authorName
      : `@${authorName}`
    : "@Anonymous";
  return { author, authorName };
}

export function resolveAuthorUsernameForProfile(
  author: string,
  authorName: string | null,
): string | null {
  const authorUsername = authorName?.replace(/^@+/, "") ?? null;
  if (
    !authorUsername ||
    author === "@Anonymous" ||
    authorUsername.startsWith("[forbidden_author]")
  ) {
    return null;
  }
  return authorUsername;
}

export function resolveAuthorUsernameFromHandle(authorHandle: string): string | null {
  const stateUsername =
    typeof authorHandle === "string" ? authorHandle.replace(/^@+/, "") : null;
  if (
    !stateUsername ||
    authorHandle === "@Anonymous" ||
    stateUsername.startsWith("[forbidden_author]")
  ) {
    return null;
  }
  return stateUsername;
}

export function getFloraDisplayImage(flora: ApiFlora): string {
  const source =
    flora.thumbnailUrl ??
    floraImages[Math.abs(flora._id.charCodeAt(0)) % floraImages.length];
  return cldImage(source, "content");
}

export function buildLineageItems(
  flora: ApiFlora,
  author: string,
): LineageItem[] {
  const coAuthorHandles = (flora.coAuthors || [])
    .map((item) => (typeof item === "string" ? item : item.username))
    .filter((value): value is string => Boolean(value))
    .map(ensureHandle);

  const labState = flora.generative?.labState as
    | { lineageUsernames?: string[]; lineageFloraIds?: string[] }
    | undefined;
  const lineageUsernames = labState?.lineageUsernames;
  const lineageFloraIds = labState?.lineageFloraIds;
  const fromLabState = Array.isArray(lineageUsernames)
    ? lineageUsernames.map(ensureHandle)
    : [];

  let allHandles: string[];
  if (fromLabState.length > 0) {
    allHandles = fromLabState;
  } else if (coAuthorHandles.length > 0) {
    allHandles = [...coAuthorHandles, author];
  } else {
    allHandles = [author];
  }

  const rootFloraId = flora.lineage?.rootFloraId
    ? String(flora.lineage.rootFloraId)
    : undefined;
  const parentFloraId = flora.lineage?.parentFloraId
    ? String(flora.lineage.parentFloraId)
    : undefined;
  const isCutting = Boolean(flora.lineage?.parentFloraId || flora.lineage?.rootFloraId);

  return allHandles.map((handle, i) => {
    let floraId: string | undefined;
    if (Array.isArray(lineageFloraIds) && i < lineageFloraIds.length) {
      floraId = lineageFloraIds[i];
    } else if ((isCutting || allHandles.length === 1) && i === allHandles.length - 1) {
      floraId = flora._id;
    } else if (i === 0 && rootFloraId) {
      floraId = rootFloraId;
    } else if (i === allHandles.length - 1 && parentFloraId && allHandles.length === 2) {
      floraId = parentFloraId;
    } else if (i === 0 && parentFloraId && !rootFloraId) {
      floraId = parentFloraId;
    } else if (allHandles.length > 2 && i === allHandles.length - 2 && parentFloraId) {
      floraId = parentFloraId;
    }
    return { handle, floraId: floraId ? String(floraId) : undefined };
  });
}

export function chunkLineageItems<T>(items: T[], size = 2): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}
