/**
 * Returns a Cloudinary URL optimized for small display (marquees, thumbnails).
 * Reduces payload and GPU load by requesting a resized image from Cloudinary.
 * Non-Cloudinary URLs are returned unchanged.
 */
export function getOptimizedThumbnailUrl(
  url: string | undefined,
  width = 200,
  height = 150
): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/image/upload/")) {
    return url ?? "";
  }
  const transform = `w_${width},h_${height},c_fill,q_auto,f_auto`;
  return url.replace("/image/upload/", `/image/upload/${transform}/`);
}
