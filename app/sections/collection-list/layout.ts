export type CollectionListWidth = "fixed" | "full" | "stretch" | null;

export type CollectionCardStyleSettings = {
  overlayColor?: string;
  overlayOpacity?: number;
};

const DEFAULT_CARD_OVERLAY = "#453830";
const DEFAULT_CARD_OVERLAY_OPACITY = 30;
const HOVER_OPACITY_INCREASE = 20;

export function getCollectionListLayoutClasses(
  width: CollectionListWidth | undefined,
) {
  if ((width ?? "fixed") !== "fixed") {
    return {
      sectionClassName: undefined,
      containerClassName: undefined,
    };
  }

  return {
    sectionClassName: "lg:px-6",
    containerClassName: "lg:max-w-[calc(var(--page-width,1440px)_-_3rem)]",
  };
}

export function getCollectionCardStyle({
  overlayColor,
  overlayOpacity,
}: CollectionCardStyleSettings) {
  const numericOpacity = Number(overlayOpacity);
  const normalizedOpacity = Number.isFinite(numericOpacity)
    ? Math.min(100, Math.max(0, numericOpacity))
    : DEFAULT_CARD_OVERLAY_OPACITY;
  const hoverOpacity = Math.min(
    100,
    normalizedOpacity + HOVER_OPACITY_INCREASE,
  );
  const resolvedOverlayColor = overlayColor || DEFAULT_CARD_OVERLAY;

  return {
    "--collection-card-overlay": `color-mix(in srgb, ${resolvedOverlayColor} ${normalizedOpacity}%, transparent)`,
    "--collection-card-overlay-hover": `color-mix(in srgb, ${resolvedOverlayColor} ${hoverOpacity}%, transparent)`,
  };
}
