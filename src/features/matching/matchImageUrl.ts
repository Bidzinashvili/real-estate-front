export function getMatchImageUrl(
  images: unknown[] | null | undefined,
): string | null {
  if (!images || images.length === 0) {
    return null;
  }
  const firstImage = images[0];
  if (typeof firstImage === "string" && firstImage.trim()) {
    return firstImage;
  }
  if (firstImage && typeof firstImage === "object" && "url" in firstImage) {
    const imageUrl = (firstImage as { url?: unknown }).url;
    if (typeof imageUrl === "string" && imageUrl.trim()) {
      return imageUrl;
    }
  }
  return null;
}
