const DEFAULT_THUMBNAIL_WIDTH = 200;
const DEFAULT_THUMBNAIL_HEIGHT = 150;

export function getOptimizedThumbnailUrl(
  url: string | undefined,
  width = DEFAULT_THUMBNAIL_WIDTH,
  height = DEFAULT_THUMBNAIL_HEIGHT
): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url ?? "";
  }
  const transform = `w_${width},h_${height},c_fill,q_auto,f_auto`;
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
}
