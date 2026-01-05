export const PAGINATION_SIZE = 24;
export const FILTER_URL_PREFIX = "filter.";

export function getImageLoadingPriority(index: number, maxLoadFactor = 30) {
  return index < maxLoadFactor ? "eager" : "lazy";
}

export { DEFAULT_LOCALE } from "~/utils/const";
