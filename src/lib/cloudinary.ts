const CLOUDINARY_HOST = "res.cloudinary.com";

export type CloudinaryPreset =
  | "favicon"
  | "icon"
  | "thumbnail"
  | "content"
  | "hero";

export type CloudinaryAssetType = "image" | "video" | "raw" | "svg" | "unknown";

const IMAGE_PRESET_PARAMS: Record<CloudinaryPreset, string[]> = {
  favicon: ["c_limit", "w_64", "f_auto", "q_auto"],
  icon: ["c_limit", "w_128", "f_auto", "q_auto"],
  thumbnail: ["c_limit", "w_640", "f_auto", "q_auto"],
  content: ["c_limit", "w_1280", "f_auto", "q_auto"],
  hero: ["c_limit", "w_1920", "f_auto", "q_auto"],
};

const VIDEO_DELIVERY_PARAMS = ["q_auto", "vc_auto", "f_auto:video"];

const TRANSFORM_PARAM =
  /^[a-z][\w]*(?:_[\w.:+-]+|:[\w.:+-]+)$/i;

const CLOUDINARY_UPLOAD_RE =
  /^(https:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|video|raw)\/upload\/)(.*)$/;

function getFilenameFromUrl(url: string): string {
  const withoutQuery = url.split("?")[0] ?? url;
  return withoutQuery.split("/").pop() ?? "";
}

export function detectCloudinaryAssetType(url: string): CloudinaryAssetType {
  if (!url.includes(CLOUDINARY_HOST)) return "unknown";
  if (url.includes("/raw/upload/")) return "raw";
  if (/\.svg(\?|$)/i.test(getFilenameFromUrl(url))) return "svg";
  if (url.includes("/video/upload/")) return "video";
  if (url.includes("/image/upload/")) return "image";
  return "unknown";
}

function getParamKey(param: string): string {
  return param.split("_")[0]?.split(":")[0]?.toLowerCase() ?? param;
}

function isTransformSegment(segment: string): boolean {
  if (/^v\d+$/.test(segment)) return false;
  if (segment.includes(".")) return false;
  const params = segment.split(",");
  return (
    params.length > 0 &&
    params.every((param) => TRANSFORM_PARAM.test(param.trim()))
  );
}

function flattenTransformSegments(segments: string[]): string[] {
  return segments.flatMap((segment) => segment.split(",")).filter(Boolean);
}

interface ParsedCloudinaryUrl {
  prefix: string;
  transformSegments: string[];
  rest: string;
}

function parseCloudinaryUrl(url: string): ParsedCloudinaryUrl | null {
  const match = url.match(CLOUDINARY_UPLOAD_RE);
  if (!match) return null;

  const [, prefix, afterUpload] = match;
  const segments = afterUpload.split("/");
  const transformSegments: string[] = [];
  let index = 0;

  while (index < segments.length && isTransformSegment(segments[index] ?? "")) {
    transformSegments.push(segments[index] ?? "");
    index += 1;
  }

  return {
    prefix,
    transformSegments,
    rest: segments.slice(index).join("/"),
  };
}

function hasFixedFormat(params: string[]): boolean {
  return params.some((param) => {
    const key = getParamKey(param);
    if (key !== "f") return false;
    return /^f_(png|jpg|jpeg|webp|gif)$/i.test(param) && param !== "f_auto";
  });
}

function hasCompleteImageOptimization(params: string[]): boolean {
  const keys = new Set(params.map(getParamKey));
  return keys.has("f") && keys.has("q") && keys.has("w");
}

function hasCompleteVideoOptimization(params: string[]): boolean {
  const joined = params.join(",");
  return (
    joined.includes("q_auto") &&
    joined.includes("vc_auto") &&
    joined.includes("f_auto:video")
  );
}

function isAudioDelivery(url: string): boolean {
  return /\.(mp3|wav|ogg|m4a|aac)(\?|$)/i.test(url);
}

function mergeTransformParams(
  existing: string[],
  needed: string[]
): string[] {
  const merged = [...existing];
  const keys = new Set(existing.map(getParamKey));

  for (const param of needed) {
    const key = getParamKey(param);
    if (!keys.has(key)) {
      merged.push(param);
      keys.add(key);
    }
  }

  return merged;
}

function buildUrl(
  parsed: ParsedCloudinaryUrl,
  params: string[]
): string {
  if (params.length === 0) {
    return `${parsed.prefix}${parsed.rest}`;
  }
  return `${parsed.prefix}${params.join(",")}/${parsed.rest}`;
}

function optimizeImageUrl(
  url: string,
  preset: CloudinaryPreset
): string {
  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;

  const existing = flattenTransformSegments(parsed.transformSegments);
  if (hasFixedFormat(existing)) return url;
  if (hasCompleteImageOptimization(existing)) return url;

  const merged = mergeTransformParams(existing, IMAGE_PRESET_PARAMS[preset]);
  return buildUrl(parsed, merged);
}

function optimizeVideoUrl(
  url: string,
  options: { silent?: boolean } = {}
): string {
  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;

  const existing = flattenTransformSegments(parsed.transformSegments);

  if (isAudioDelivery(url)) {
    if (existing.some((param) => param === "q_auto")) return url;
    return buildUrl(parsed, mergeTransformParams(existing, ["q_auto"]));
  }

  const needed = [...VIDEO_DELIVERY_PARAMS];
  if (options.silent) {
    needed.push("ac_none");
  }

  if (
    hasCompleteVideoOptimization(existing) &&
    (!options.silent || existing.some((param) => param.startsWith("ac_")))
  ) {
    return url;
  }

  const merged = mergeTransformParams(existing, needed);
  return buildUrl(parsed, merged);
}

export function optimizeCloudinaryUrl(
  url: string | undefined | null,
  preset: CloudinaryPreset = "content"
): string {
  if (!url) return "";

  const assetType = detectCloudinaryAssetType(url);
  if (assetType === "raw" || assetType === "svg" || assetType === "unknown") {
    return url;
  }

  if (assetType === "image") {
    return optimizeImageUrl(url, preset);
  }

  if (assetType === "video") {
    return optimizeVideoUrl(url);
  }

  return url;
}

export function cldImage(
  url: string | undefined | null,
  preset: CloudinaryPreset = "content"
): string {
  return optimizeCloudinaryUrl(url, preset);
}

export function cldAvatar(url: string | undefined | null): string {
  if (!url || url.startsWith("data:")) return url ?? "";
  return cldImage(url, "icon");
}

export interface CldVideoOptions {
  preset?: CloudinaryPreset;
  silent?: boolean;
}

export function cldVideo(
  url: string | undefined | null,
  options: CldVideoOptions = {}
): string {
  if (!url) return "";
  if (!url.includes(CLOUDINARY_HOST)) return url;

  const assetType = detectCloudinaryAssetType(url);
  if (assetType !== "video") return url;

  return optimizeVideoUrl(url, { silent: options.silent });
}

export function cldVideoPoster(url: string | undefined | null): string {
  if (!url) return "";
  if (!url.includes(CLOUDINARY_HOST)) return url;

  const parsed = parseCloudinaryUrl(url);
  if (!parsed) return url;

  const existing = flattenTransformSegments(parsed.transformSegments);
  const hasSo0 = existing.some((param) => param === "so_0");
  const hasFjpg = existing.some((param) => param === "f_jpg");

  const preserved = existing.filter(
    (param) =>
      !["q_auto", "vc_auto", "f_auto:video", "ac_none"].includes(param) &&
      !param.startsWith("w_") &&
      param !== "c_limit"
  );

  const needed = ["c_limit", "w_800", "q_auto"];
  if (!hasSo0) needed.unshift("so_0");
  if (!hasFjpg) needed.push("f_jpg");

  const merged = mergeTransformParams(preserved, needed);
  return buildUrl(parsed, merged);
}

/** @deprecated Prefer `cldImage(url, preset)` */
export function getOptimizedThumbnailUrl(
  url: string | undefined,
  width = 128,
  height?: number
): string {
  if (!url) return "";

  if (height && height > 0) {
    const parsed = parseCloudinaryUrl(url);
    if (!parsed || detectCloudinaryAssetType(url) !== "image") return url;

    const existing = flattenTransformSegments(parsed.transformSegments);
    if (hasFixedFormat(existing)) return url;

    const cropParams = [
      `w_${width}`,
      `h_${height}`,
      "c_fill",
      "g_auto",
      "f_auto",
      "q_auto",
    ];
    const merged = mergeTransformParams(existing, cropParams);
    return buildUrl(parsed, merged);
  }

  const preset: CloudinaryPreset =
    width <= 64
      ? "favicon"
      : width <= 128
        ? "icon"
        : width <= 640
          ? "thumbnail"
          : width <= 1280
            ? "content"
            : "hero";

  return cldImage(url, preset);
}
