export type CloudinaryPreset =
  | "favicon"
  | "icon"
  | "thumbnail"
  | "content"
  | "hero";

export type CloudinaryAssetType = "image" | "video" | "raw" | "svg" | "unknown";

const CLOUDINARY_HOST = "res.cloudinary.com";

const PRESET_TRANSFORMS: Record<CloudinaryPreset, string[]> = {
  favicon: ["c_limit,w_64", "f_auto", "q_auto"],
  icon: ["c_limit,w_128", "f_auto", "q_auto"],
  thumbnail: ["c_limit,w_640", "f_auto", "q_auto"],
  content: ["c_limit,w_1280", "f_auto", "q_auto"],
  hero: ["c_limit,w_1920", "f_auto", "q_auto"],
};

const VIDEO_TRANSFORMS = ["q_auto", "vc_auto", "f_auto:video"];
const VIDEO_AUTOPLAY_TRANSFORMS = ["q_auto", "vc_auto", "ac_none", "f_auto:video"];
const VIDEO_POSTER_TRANSFORMS = ["c_limit,w_800", "q_auto"];

const TRANSFORM_TOKEN_RE =
  /^(t_|c_|w_|h_|q_|f_|e_|g_|vc_|ac_|so_|du_|ar_|b_|r_|dpr_|fl_)/;

type ParsedCloudinaryUrl = {
  base: string;
  resourceType: "image" | "video" | "raw";
  deliveryType: string;
  transforms: string[];
  rest: string;
  query: string;
};

function splitUrlQuery(url: string): { path: string; query: string } {
  const qIndex = url.indexOf("?");
  if (qIndex === -1) return { path: url, query: "" };
  return { path: url.slice(0, qIndex), query: url.slice(qIndex) };
}

function isTransformSegment(segment: string): boolean {
  return TRANSFORM_TOKEN_RE.test(segment) || segment.includes(",");
}

function parseCloudinaryUrl(url: string): ParsedCloudinaryUrl | null {
  const { path, query } = splitUrlQuery(url);
  const match = path.match(
    /^https?:\/\/res\.cloudinary\.com\/([^/]+)\/(image|video|raw)\/(upload|fetch|private|authenticated)\/(.*)$/
  );
  if (!match) return null;

  const [, , resourceType, deliveryType, suffix] = match;
  const segments = suffix.split("/");
  const transforms: string[] = [];
  let index = 0;

  while (index < segments.length && isTransformSegment(segments[index]!)) {
    transforms.push(segments[index]!);
    index += 1;
  }

  return {
    base: path.slice(0, path.length - suffix.length),
    resourceType: resourceType as ParsedCloudinaryUrl["resourceType"],
    deliveryType,
    transforms,
    rest: segments.slice(index).join("/"),
    query,
  };
}

function rebuildCloudinaryUrl(parsed: ParsedCloudinaryUrl): string {
  const transformPath = parsed.transforms.length
    ? `${parsed.transforms.join("/")}/`
    : "";
  return `${parsed.base}${transformPath}${parsed.rest}${parsed.query}`;
}

export function detectCloudinaryAssetType(url: string): CloudinaryAssetType {
  if (!url.includes(CLOUDINARY_HOST)) return "unknown";
  if (url.includes("/raw/upload/")) return "raw";
  if (/\.svg(\?|$)/i.test(url)) return "svg";
  if (url.includes("/video/upload/")) return "video";
  if (url.includes("/image/upload/")) return "image";
  return "unknown";
}

function flattenTransforms(transforms: string[]): string {
  return transforms.join("/");
}

function hasToken(transforms: string[], token: string): boolean {
  const flat = flattenTransforms(transforms);
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[/,])${escaped}(?:[,:/]|$)`).test(flat);
}

function hasWidth(transforms: string[]): boolean {
  return /(?:^|[/,])w_\d+/.test(flattenTransforms(transforms));
}

function hasFixedFormat(transforms: string[]): boolean {
  return /(?:^|[/,])f_(?!auto(?:[:/]|$))/.test(flattenTransforms(transforms));
}

function hasVideoFormat(transforms: string[]): boolean {
  return hasToken(transforms, "f_auto:video");
}

function isImageFullyOptimized(
  transforms: string[],
  desired: string[]
): boolean {
  const needsFormat = !hasFixedFormat(transforms);
  const hasQuality = hasToken(transforms, "q_auto");
  const hasFormat =
    !needsFormat || hasToken(transforms, "f_auto") || hasFixedFormat(transforms);
  const needsWidth = desired.some((part) => part.startsWith("c_limit,w_"));
  const hasLimitWidth = needsWidth ? hasWidth(transforms) : true;

  return hasQuality && hasFormat && hasLimitWidth;
}

function isVideoFullyOptimized(
  transforms: string[],
  autoplay: boolean
): boolean {
  const hasQuality = hasToken(transforms, "q_auto");
  const hasCodec = hasToken(transforms, "vc_auto");
  const hasFormat = hasVideoFormat(transforms);
  const hasAudioControl = autoplay
    ? hasToken(transforms, "ac_none")
    : true;

  return hasQuality && hasCodec && hasFormat && hasAudioControl;
}

function mergeTransforms(
  existing: string[],
  desired: string[]
): string[] {
  if (existing.length === 0) return [...desired];

  const merged = [...existing];
  const flat = flattenTransforms(existing);

  for (const part of desired) {
    if (part.startsWith("c_limit,w_") && hasWidth(existing)) continue;
    if (part === "f_auto" && (hasToken(existing, "f_auto") || hasFixedFormat(existing)))
      continue;
    if (part === "f_auto:video" && hasVideoFormat(existing)) continue;
    if (part === "q_auto" && hasToken(existing, "q_auto")) continue;
    if (part === "vc_auto" && hasToken(existing, "vc_auto")) continue;
    if (part === "ac_none" && hasToken(existing, "ac_none")) continue;
    if (flat.includes(part)) continue;
    merged.push(part);
  }

  return merged;
}

function applyTransforms(
  url: string,
  desired: string[],
  isComplete: (transforms: string[]) => boolean
): string {
  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;
  if (isComplete(parsed.transforms)) return url;

  return rebuildCloudinaryUrl({
    ...parsed,
    transforms: mergeTransforms(parsed.transforms, desired),
  });
}

export function optimizeCloudinaryUrl(
  url: string | undefined,
  preset: CloudinaryPreset = "content"
): string {
  if (!url) return "";

  const assetType = detectCloudinaryAssetType(url);
  if (assetType === "unknown" || assetType === "raw" || assetType === "svg") {
    return url;
  }

  if (assetType === "video") {
    return cldVideo(url);
  }

  const desired = PRESET_TRANSFORMS[preset];
  return applyTransforms(url, desired, (transforms) =>
    isImageFullyOptimized(transforms, desired)
  );
}

export function cldImage(
  url: string | undefined,
  preset: CloudinaryPreset = "content"
): string {
  return optimizeCloudinaryUrl(url, preset);
}

export function cldVideo(
  url: string | undefined,
  options: { autoplay?: boolean } = {}
): string {
  if (!url) return "";

  const assetType = detectCloudinaryAssetType(url);
  if (assetType !== "video") return url;

  const desired = options.autoplay
    ? VIDEO_AUTOPLAY_TRANSFORMS
    : VIDEO_TRANSFORMS;

  return applyTransforms(url, desired, (transforms) =>
    isVideoFullyOptimized(transforms, Boolean(options.autoplay))
  );
}

export function cldVideoPoster(url: string | undefined): string {
  if (!url) return "";

  const assetType = detectCloudinaryAssetType(url);
  if (assetType !== "image" && assetType !== "video") return url;

  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;

  const desired = [...VIDEO_POSTER_TRANSFORMS];
  if (hasFixedFormat(parsed.transforms) || hasToken(parsed.transforms, "f_jpg")) {
    const withoutFormat = desired.filter((part) => part !== "f_auto");
    return applyTransforms(url, withoutFormat, () => false);
  }

  return applyTransforms(url, desired, (transforms) => {
    const hasQuality = hasToken(transforms, "q_auto");
    const hasPosterWidth =
      hasToken(transforms, "c_limit,w_800") || hasWidthLimit(transforms, 800);
    return hasQuality && hasPosterWidth;
  });
}

function hasWidthLimit(transforms: string[], width: number): boolean {
  const match = flattenTransforms(transforms).match(/(?:^|[/,])w_(\d+)/);
  return match ? Number(match[1]) >= width : false;
}

/** @deprecated Prefer `cldImage(url, "thumbnail")` */
export function getOptimizedThumbnailUrl(
  url: string | undefined,
  width = 640,
  height = 480
): string {
  if (!url) return "";

  const assetType = detectCloudinaryAssetType(url);
  if (assetType !== "image") return url ?? "";

  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;

  const desired = [
    `c_fill,g_auto,w_${width},h_${height}`,
    "f_auto",
    "q_auto",
  ];

  if (isImageFullyOptimized(parsed.transforms, ["c_limit,w_640"])) {
    const hasFill = /c_fill/.test(flattenTransforms(parsed.transforms));
    if (hasFill && hasWidth(parsed.transforms)) return url;
  }

  return applyTransforms(url, desired, () => false);
}
