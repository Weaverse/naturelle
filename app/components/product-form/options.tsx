import clsx from "clsx";
import { Image } from "~/components/image";
import { cn } from "~/utils/cn";
export const OPTIONS_AS_COLOR = ["Color", "Colors", "Colour", "Colours"];
const OPTIONS_AS_BUTTON = ["Button", "Buttons"];
const OPTIONS_AS_IMAGE = ["Image", "Images"];
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
  values: {
    isActive: boolean;
    isAvailable: boolean;
    search: string;
    to: string;
    value: string;
    image?: any;
  }[];
}

export function VariantOption(props: VariantOptionProps) {
  let { name, values, selectedOptionValue, onSelectOptionValue, swatches } =
    props;

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
              key={value.value}
              className={clsx(
                "rounded p-0.5 border-2 cursor-pointer",
                selectedOptionValue === value.value
                  ? "border-border/90 bg-[#E5E6D4]"
                  : value.isAvailable
                    ? "border-border-subtle"
                    : `${disabledClassName} border-[#C2C3C2] text-[#C2C3C2] bg-[#EBEBEA]`,
              )}
              onClick={() => onSelectOptionValue(value.value)}
            >
              {value.image ? (
                <Image data={value.image} sizes="auto" className="h-14 w-14" />
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
          className="min-w-[120px] w-fit rounded-sm border p-1"
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
  if (OPTION_AS_MORPHOLOGY.includes(name)) {
    return (
      <div className="flex gap-3 flex-wrap">
        {values.map((value) => (
          <div
            key={value.value}
            className={clsx(
              "!leading-none py-3 px-3 cursor-pointer transition-all duration-200 font-normal border-2 rounded",
              value.isAvailable && selectedOptionValue === value.value
                ? "border-border/90 bg-[#E5E6D4]"
                : value.isAvailable
                  ? "border-border-subtle"
                  : `${disabledClassName} border-[#C2C3C2] text-[#C2C3C2] bg-[#EBEBEA]`,
            )}
            onClick={() => onSelectOptionValue(value.value)}
          >
            {value.value}
          </div>
        ))}
      </div>
    );
  }
}
