import clsx from "clsx";
import { Image } from "~/components/image";
import { cn } from "~/utils/cn";
export const OPTIONS_AS_COLOR = ["Color", "Colors", "Colour", "Colours"];
const OPTIONS_AS_BUTTON = ["Button", "Buttons"];
const OPTIONS_AS_IMAGE = ["Image", "Images", "Type", "Types"];
const OPTIONS_AS_DROPDOWN = ["Dropdown", "Dropdowns"];
const OPTION_AS_MORPHOLOGY = ["Size", "Shape", "Sizes"];
interface VariantOptionProps {
  selectedOptionValue: string;
  onSelectOptionValue: (optionValue: string) => void;
  name: string;
  swatches: {
    imageSwatches: any[];
    colorSwatches: any[];
  };
  onSelectVariant?: (variant: unknown) => void;
  values: {
    isActive: boolean;
    isAvailable: boolean;
    search: string;
    to: string;
    value: string;
    image?: any;
    variant?: unknown;
  }[];
}

export function VariantOption(props: VariantOptionProps) {
  let {
    name,
    values,
    selectedOptionValue,
    onSelectOptionValue,
    onSelectVariant,
    swatches,
  } = props;
  const normalizedName = name.trim().toLowerCase();

  let disabledClassName = "diagonal opacity-50 cursor-not-allowed";
  // show value by Type

  if (OPTIONS_AS_COLOR.includes(name)) {
    return (
      <div className="flex gap-4 flex-wrap">
        {values.map((value) => {
          let swatchColor: string =
            swatches.colorSwatches.find((color) => color.name === value.value)
              ?.value || value.value;
          return (
            <button
              type="button"
              key={value.value}
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
              <div
                className={clsx("w-full h-full rounded-full")}
                style={{
                  backgroundColor: swatchColor,
                }}
              />
            </button>
          );
        })}
      </div>
    );
  }
  if (OPTIONS_AS_BUTTON.includes(name)) {
    return (
      <div className="flex gap-4 flex-wrap">
        {values.map((value) => (
          <button
            type="button"
            key={value.value}
            className={cn(
              "border-2 rounded-full cursor-pointer h-[50px] px-5 py-3",
              value.isAvailable && selectedOptionValue === value.value
                ? "border-border/90 bg-[#E5E6D4]"
                : value.isAvailable
                  ? "border-border-subtle"
                  : `${disabledClassName} border-[#C2C3C2] text-[#C2C3C2] bg-[#EBEBEA]`,
            )}
            onClick={() => onSelectOptionValue(value.value)}
          >
            {value.value}
          </button>
        ))}
      </div>
    );
  }
  if (OPTIONS_AS_IMAGE.includes(name)) {
    return (
      <div className="flex gap-4 flex-wrap">
        {values.map((value) => {
          return (
            <button
              type="button"
              key={value.value}
              disabled={!value.isAvailable}
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
              onClick={() => {
                if (value.variant && onSelectVariant) {
                  onSelectVariant(value.variant);
                } else {
                  onSelectOptionValue(value.value);
                }
              }}
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
  if (OPTIONS_AS_DROPDOWN.includes(name)) {
    return (
      <div>
        <select
          className="min-w-[120px] w-fit rounded-md border p-1"
          onChange={(e) => {
            onSelectOptionValue(e.target.value);
          }}
        >
          {values.map((value) => {
            return (
              <option key={value.value} value={value.value}>
                {value.value}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
  const isMorphology = OPTION_AS_MORPHOLOGY.some(
    (optionName) => optionName.toLowerCase() === normalizedName,
  );

  return (
    <div className="flex flex-wrap gap-3">
      {values.map((value) => (
        <button
          type="button"
          key={value.value}
          disabled={!value.isAvailable}
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
