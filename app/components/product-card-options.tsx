import { Image } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import type {
  ProductCardFragment,
  ProductVariantFragmentFragment,
} from "storefrontapi.generated";
import { Button } from "~/components/button";
import { Link } from "./Link";
import { isLightColor } from "~/lib/utils";

export const OPTIONS_AS_COLOR = ["Color", "Colors", "Colour", "Colours"];
const OPTIONS_AS_BUTTON = ["Button", "Buttons"];
const OPTIONS_AS_IMAGE = ["Image", "Images"];
const OPTIONS_AS_DROPDOWN = ["Dropdown", "Dropdowns"];

export function ProductCardOptions({
  product,
  selectedVariant,
  setSelectedVariant,
}: {
  product: ProductCardFragment;
  selectedVariant: ProductVariantFragmentFragment;
  setSelectedVariant: (variant: ProductVariantFragmentFragment) => void;
}) {
  let { pcardShowOptionValues, pcardOptionToShow, pcardMaxOptionValues } =
    useThemeSettings();
  let { handle, options } = product;
  let { optionValues } =
    options.find(({ name }) => name === pcardOptionToShow) || {};
  let restCount = optionValues ? optionValues.length - pcardMaxOptionValues : 0;

  if (!pcardShowOptionValues || !optionValues?.length) {
    return null;
  }

  let selectedValue = "";
  if (selectedVariant) {
    selectedValue = selectedVariant.selectedOptions?.find(
      ({ name }) => name === pcardOptionToShow,
    )?.value ?? "";
  }
  let asSwatch = OPTIONS_AS_COLOR.includes(pcardOptionToShow);

  return (
    <div className="flex flex-wrap items-center gap-2 p-1">
      {optionValues
        .slice(0, pcardMaxOptionValues)
        .map(({ name, swatch, firstSelectableVariant }) => {
          if (asSwatch) {
            return (
                  <button
                    type="button"
                    className={clsx(
                      "size-4 flex aspect-square rounded-full",
                      "transition-[outline-color] outline outline-offset-2 outline-1",
                      selectedValue === name
                        ? "outline-border"
                        : "outline-transparent hover:outline-border",
                    )}
                    onClick={() => {
                      if (firstSelectableVariant) {
                        setSelectedVariant(firstSelectableVariant);
                      }
                    }}
                  >
                    {swatch?.image?.previewImage ? (
                      <Image
                        data={swatch.image.previewImage}
                        className="w-full h-full object-cover object-center rounded-full"
                        width={200}
                        sizes="auto"
                      />
                    ) : (
                      <span
                        className={clsx(
                          "w-full h-full inline-block text-[0px] rounded-full",
                          isLightColor(swatch?.color || name) &&
                            "border border-line-subtle",
                        )}
                        style={{ backgroundColor: swatch?.color || name }}
                      >
                        {name}
                      </span>
                    )}
                  </button>
            );
          }
          return (
            <Button
              key={name}
              variant="outline"
              className={clsx(
                "px-2 py-1 text-sm text-center border border-line-subtle transition-colors",
                selectedValue === name &&
                  "bg-body border-body text-body-inverse",
              )}
              onClick={() => {
                if (firstSelectableVariant) {
                  setSelectedVariant(firstSelectableVariant);
                }
              }}
            >
              {name}
            </Button>
          );
        })}
      {restCount > 0 && (
        <Link to={`/products/${handle}`} className="mt-1">
          <span className="text-animation">+{restCount}</span>
        </Link>
      )}
    </div>
  );
}
