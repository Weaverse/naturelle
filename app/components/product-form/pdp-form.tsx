import { type ReactNode, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import {
  IconQuickViewFacebook,
  IconQuickViewInstagram,
  IconQuickViewX,
} from "~/components/icon";
import { cn } from "~/utils/cn";

interface ProductVariantLike {
  availableForSale: boolean;
  quantityAvailable?: number | null;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface ProductFormStateParams<TVariant extends ProductVariantLike> {
  product?: {
    id?: string;
    selectedVariant?: TVariant | null;
  } | null;
  variants?: {
    nodes: TVariant[];
  } | null;
  addToCartText: string;
  soldOutText: string;
  unavailableText: string;
  syncVariantWithUrl?: boolean;
}

interface ProductQuantityInputProps {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
  className?: string;
}

interface ProductShareLinksProps {
  productUrl: string;
  title: string;
  label?: string;
  className?: string;
}

export function useProductFormState<TVariant extends ProductVariantLike>({
  product,
  variants,
  addToCartText,
  soldOutText,
  unavailableText,
  syncVariantWithUrl = true,
}: ProductFormStateParams<TVariant>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<TVariant | undefined>(
    () => product?.selectedVariant ?? variants?.nodes[0],
  );
  const productSelectedVariant = product?.selectedVariant;
  const firstVariant = variants?.nodes[0];

  useEffect(() => {
    const nextVariant = productSelectedVariant ?? firstVariant;
    if (nextVariant) {
      setSelectedVariant(nextVariant);
    }
  }, [productSelectedVariant, firstVariant]);

  const atcText = selectedVariant?.availableForSale
    ? addToCartText
    : selectedVariant?.quantityAvailable === -1
      ? unavailableText
      : soldOutText;

  const handleSelectedVariantChange = (variant: TVariant) => {
    setSelectedVariant(variant);
    if (syncVariantWithUrl) {
      const nextSearchParams = new URLSearchParams(searchParams);
      for (const option of variant.selectedOptions) {
        nextSearchParams.set(option.name, option.value);
      }
      setSearchParams(nextSearchParams, {
        replace: true,
        preventScrollReset: true,
      });
    }
  };

  return {
    isLoading,
    setIsLoading,
    selectedVariant,
    quantity,
    setQuantity,
    atcText,
    handleSelectedVariantChange,
  };
}

export function ProductQuantityInput({
  value,
  disabled,
  onChange,
  className,
}: ProductQuantityInputProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      <button
        type="button"
        className="flex h-full items-center justify-center px-5 py-3 text-base disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        −
      </button>
      <span
        className="flex h-full w-13 items-center justify-center py-3 text-center text-base"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        className="flex h-full items-center justify-center px-5 py-3 text-base disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={() => onChange(value + 1)}
      >
        +
      </button>
    </div>
  );
}

function ShareLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full transition-opacity hover:opacity-70"
    >
      {children}
    </a>
  );
}

export function ProductShareLinks({
  productUrl,
  title,
  label = "Share:",
  className,
}: ProductShareLinksProps) {
  return (
    <div className={cn("flex items-center gap-3 pt-2 text-sm", className)}>
      <span className="font-semibold">{label}</span>
      <ShareLink
        label="Share on Facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
      >
        <IconQuickViewFacebook className="size-8" />
      </ShareLink>
      <ShareLink
        label="Share on Instagram"
        href={`https://www.instagram.com/?url=${encodeURIComponent(productUrl)}`}
      >
        <IconQuickViewInstagram className="size-8" />
      </ShareLink>
      <ShareLink
        label="Share on X"
        href={`https://x.com/intent/post?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(title)}`}
      >
        <IconQuickViewX className="size-8" />
      </ShareLink>
    </div>
  );
}
