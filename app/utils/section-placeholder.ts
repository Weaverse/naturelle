import { IMAGES_PLACEHOLDERS, type WeaverseImage } from "@weaverse/hydrogen";

/** Keep merchant-selected media and replace only empty image values. */
export function sectionImageSource<T extends Partial<WeaverseImage>>(
  image: string | T | null | undefined,
  placeholder: string = IMAGES_PLACEHOLDERS.image,
) {
  if (typeof image === "string" && image.trim()) {
    return image;
  }
  if (image && typeof image === "object" && image.url?.trim()) {
    return image;
  }
  return placeholder;
}

export function sectionImage(
  image: string | Partial<WeaverseImage> | null | undefined,
  placeholder: string = IMAGES_PLACEHOLDERS.image,
  altText = "",
) {
  const source = sectionImageSource(image, placeholder);
  return typeof source === "string"
    ? { url: source, altText }
    : { ...source, url: source.url || placeholder };
}
