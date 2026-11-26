import { useTranslation } from "@weaverse/hydrogen";
import clsx from "clsx";
import { Input } from "~/components/input";
import { useQuantityDraft } from "~/hooks/use-quantity-draft";

interface QuantityProps {
  value: number;
  max?: number | null;
  isDisabled?: boolean;
  onChange: (value: number) => void;
}
export function Quantity(props: QuantityProps) {
  const { t } = useTranslation();
  let { value, max, onChange, isDisabled } = props;
  const {
    draftValue,
    maxQuantity,
    updateQuantity,
    handleChange,
    handleBlur,
    handleKeyDown,
  } = useQuantityDraft(value, max, onChange);
  return (
    <div className="space-y-3">
      <legend className="whitespace-pre-wrap max-w-prose text-base font-body font-semibold leading-snug">
        {t("product.quantity")}
      </legend>
      <div
        className={clsx(
          "flex h-13.5 w-fit gap-2",
          isDisabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <button
          type="button"
          name="decrease-quantity"
          aria-label={t("product.decreaseQuantity")}
          className={clsx(
            "inline-flex h-13.5 items-center justify-center rounded-md border-2 border-border-subtle px-5 text-base transition",
            value <= 1 && "opacity-50 cursor-not-allowed",
          )}
          disabled={isDisabled || value <= 1}
          onClick={() => updateQuantity(value - 1)}
        >
          <span>&#8722;</span>
        </button>
        <Input
          className="w-24 bg-background text-center text-base"
          inputMode="numeric"
          pattern="[0-9]*"
          role="spinbutton"
          aria-label={t("product.quantity")}
          aria-valuemin={1}
          aria-valuemax={maxQuantity}
          aria-valuenow={value}
          value={draftValue}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={isDisabled}
        />
        <button
          type="button"
          className="inline-flex h-13.5 items-center justify-center rounded-md border-2 border-border-subtle px-5 text-base transition disabled:cursor-not-allowed disabled:opacity-50"
          name="increase-quantity"
          aria-label={t("product.increaseQuantity")}
          onClick={() => updateQuantity(value + 1)}
          disabled={
            isDisabled || (maxQuantity !== undefined && value >= maxQuantity)
          }
        >
          <span>&#43;</span>
        </button>
      </div>
    </div>
  );
}
