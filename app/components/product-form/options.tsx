import type { MappedProductOptions } from "@shopify/hydrogen";
import clsx from "clsx";
import { Image } from "~/components/image";
import type { VariantDisplayType } from "./variants";

type ShopifyOptionValue = MappedProductOptions["optionValues"][number];

interface VariantOptionProps {
  selectedOptionValue: string;
  onSelectOptionValue: (optionValue: string) => void;
  name: string;
  displayType: VariantDisplayType;
  values: {
    exists: boolean;
    isAvailable: boolean;
    value: string;
    image?: any;
    swatch?: ShopifyOptionValue["swatch"];
  }[];
}

export function VariantOption(props: VariantOptionProps) {
  let { name, values, selectedOptionValue, onSelectOptionValue, displayType } =
    props;

  let disabledClassName = "diagonal opacity-50 cursor-not-allowed";
  if (displayType === "swatch") {
    return (
      <div className="flex gap-4 flex-wrap">
        {values.map((value) => {
          const swatchImage = value.swatch?.image?.previewImage;
          const swatchColor = value.swatch?.color || value.value;
          return (
            <button
              type="button"
              key={value.value}
              disabled={!value.exists}
              aria-label={`${name}: ${value.value}`}
              aria-pressed={selectedOptionValue === value.value}
              className={clsx(
                "p-0.5 border-2 rounded-full cursor-pointer h-11 w-11",
                value.isAvailable && selectedOptionValue === value.value
                  ? "border-border/90 bg-[#E5E6D4]"
                  : value.isAvailable
                    ? "border-border-subtle"
                    : `${disabledClassName} border-[#C2C3C2] text-[#C2C3C2] bg-[#EBEBEA]`,
              )}
              onClick={() => onSelectOptionValue(value.value)}
            >
              {swatchImage ? (
                <Image
                  data={swatchImage}
                  sizes="40px"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full rounded-full"
                  style={{ backgroundColor: swatchColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    );
  }
  if (displayType === "image") {
    return (
      <div className="flex gap-4 flex-wrap">
        {values.map((value) => {
          return (
            <button
              type="button"
              key={value.value}
              disabled={!value.exists}
              aria-label={`${name}: ${value.value}`}
              aria-pressed={selectedOptionValue === value.value}
              className={clsx(
                "size-12 cursor-pointer overflow-hidden rounded-lg border p-0.5 transition-colors",
                selectedOptionValue === value.value
                  ? "border-border"
                  : value.isAvailable
                    ? "border-transparent hover:border-border-subtle"
                    : `${disabledClassName} border-border-subtle bg-background-subtle-1 text-text-subtle`,
              )}
              onClick={() => onSelectOptionValue(value.value)}
            >
              {value.image ? (
                <Image
                  data={value.image}
                  sizes="48px"
                  className="h-full w-full rounded-md object-cover"
                />
              ) : (
                value.value
              )}
            </button>
          );
        })}
      </div>
    );
  }
  if (displayType === "dropdown") {
    return (
      <div>
        <select
          className="min-w-[120px] w-fit rounded-md border p-1"
          value={selectedOptionValue}
          aria-label={name}
          onChange={(e) => {
            onSelectOptionValue(e.target.value);
          }}
        >
          {values.map((value) => {
            return (
              <option
                key={value.value}
                value={value.value}
                disabled={!value.exists}
              >
                {value.value}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
  const isMorphology = displayType === "morphology";

  return (
    <div className="flex flex-wrap gap-3">
      {values.map((value) => (
        <button
          type="button"
          key={value.value}
          disabled={!value.exists}
          className={clsx(
            "min-h-12 cursor-pointer rounded-xl border px-4 py-3 text-base font-semibold leading-none transition-colors",
            isMorphology && "min-w-16",
            value.isAvailable && selectedOptionValue === value.value
              ? "border-button-primary-background bg-button-primary-background text-button-primary-text"
              : value.isAvailable
                ? "border-border-subtle bg-transparent text-text-primary hover:border-border"
                : `${disabledClassName} border-border-subtle bg-background-subtle-1 text-text-subtle`,
          )}
          onClick={() => onSelectOptionValue(value.value)}
        >
          {value.value}
        </button>
      ))}
    </div>
  );
}
