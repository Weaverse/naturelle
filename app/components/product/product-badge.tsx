import clsx from "clsx";

export type ProductBadgeType = "save" | "new" | "sold-out";

const backgroundColors: Record<ProductBadgeType, string> = {
  save: "var(--color-label-bg-save)",
  new: "var(--color-label-bg-new)",
  "sold-out": "var(--color-label-bg-soldout)",
};

export function ProductBadge({
  text,
  type,
  className,
}: {
  text: string;
  type: ProductBadgeType;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "pointer-events-none rounded-full px-3 py-1.5 text-xs",
        className,
      )}
      style={{
        backgroundColor: backgroundColors[type],
        color: "var(--color-label-text)",
      }}
    >
      {text}
    </span>
  );
}
