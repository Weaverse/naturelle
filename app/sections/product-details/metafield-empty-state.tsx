import type { ComponentPropsWithoutRef, Ref } from "react";
import { useWeaverseStudioCheck } from "~/hooks/use-weaverse-studio-check";
import { cn } from "~/utils/cn";
import type { ProductDetailMetafieldLoaderData } from "./product-metafield";

interface ProductMetafieldEmptyStateProps
  extends ComponentPropsWithoutRef<"section"> {
  loaderData?: ProductDetailMetafieldLoaderData;
  metafield?: string;
  message?: string;
  ref?: Ref<HTMLElement>;
}

function getMessage(
  loaderData: ProductDetailMetafieldLoaderData | undefined,
  metafield: string | undefined,
) {
  const identifier = loaderData?.identifier || metafield?.trim();

  switch (loaderData?.status) {
    case "loading":
      return `Loading the ${identifier} metafield…`;
    case "missing-config":
      return "Enter a product metafield in this section's settings.";
    case "invalid-config":
      return "Enter a valid metafield name or namespace.key.";
    case "missing-product":
      return "Preview this section on a product page to load its metafield.";
    case "not-found":
      return `This product does not have the ${identifier} metafield.`;
    case "empty":
      return `The ${identifier} metafield has no content.`;
    case "query-error":
      return `The ${identifier} metafield could not be loaded.`;
    default:
      return "The product metafield could not be loaded.";
  }
}

export function ProductMetafieldEmptyState({
  ref,
  loaderData,
  metafield,
  message,
  className,
  ...rest
}: ProductMetafieldEmptyStateProps) {
  const isDesignMode = useWeaverseStudioCheck();
  if (!isDesignMode) {
    return null;
  }

  return (
    <section ref={ref} {...rest} className={cn("w-full", className)}>
      <div className="rounded-xl border border-dashed border-border-subtle bg-background-basic px-6 py-8 text-center">
        <p className="font-body text-sm font-semibold text-text">
          {loaderData?.status === "loading"
            ? "Loading product metafield"
            : "Product metafield unavailable"}
        </p>
        <p className="mt-2 font-body text-xs leading-5 text-(--product-detail-text-color)">
          {message || getMessage(loaderData, metafield)}
        </p>
      </div>
    </section>
  );
}
