import { getProductOptions } from "@shopify/hydrogen";
import clsx from "clsx";
import type {
  ProductQuery,
  ProductVariantFragmentFragment,
} from "storefront-api.generated";
import { isImageOption, VariantOption } from "./options";

interface ProductVariantsProps {
  selectedVariant: ProductVariantFragmentFragment;
  onSelectedVariantChange: (variant: ProductVariantFragmentFragment) => void;
  variants: {
    nodes: ProductVariantFragmentFragment[];
  };
  product: NonNullable<ProductQuery["product"]>;
  swatch: {
    configs: any[];
    swatches: any;
  };
  hideUnavailableOptions?: boolean;
  isDisabled?: boolean;
}

export const ProductVariants = (props: ProductVariantsProps) => {
  let {
    selectedVariant,
    onSelectedVariantChange,
    variants,
    product,
    swatch,
    hideUnavailableOptions,
    isDisabled,
  } = props;

  let selectedOptions = selectedVariant?.selectedOptions;
  let nodes = variants?.nodes;
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
    adjacentVariants: nodes,
  });
  let handleSelectOption = (optionName: string, value: string) => {
    let newSelectedOptions = selectedOptions?.map((opt) => {
      if (opt.name === optionName) {
        return {
          ...opt,
          value,
        };
      }
      return opt;
    });
    const matchingVariant = findVariantByOptions(nodes, newSelectedOptions);
    const fallbackVariant = productOptions
      .find((option) => option.name === optionName)
      ?.optionValues.find(
        (optionValue) => optionValue.name === value,
      )?.firstSelectableVariant;
    const newSelectedVariant = matchingVariant ?? fallbackVariant;
    if (newSelectedVariant) {
      onSelectedVariantChange(newSelectedVariant);
    }
  };

  if (selectedOptions?.every((opt) => opt.value === "Default Title")) {
    return null;
  }

  return (
    <div data-motion="fade-up" className="flex flex-col gap-6">
      {productOptions.map((option) => {
        let optionName = option.name;
        const shouldRenderAsImage = isImageOption(optionName);
        let values = option.optionValues
          .map((optionValue) => {
            if (hideUnavailableOptions && !optionValue.exists) {
              return null;
            }
            return {
              exists: optionValue.exists,
              isActive: optionValue.selected,
              isAvailable: optionValue.available,
              search: "",
              to: "",
              value: optionValue.name,
              image: shouldRenderAsImage
                ? (optionValue.variant?.image ??
                  optionValue.firstSelectableVariant?.image)
                : undefined,
            };
          })
          .filter(Boolean);
        let handleSelectOptionValue = (value: string) =>
          handleSelectOption(optionName, value);
        let config = swatch?.configs.find((swatchConfig) => {
          return (
            swatchConfig.name.trim().toLowerCase() ===
            optionName.trim().toLowerCase()
          );
        });
        let selectedValue = selectedOptions?.find(
          (opt) => opt.name === optionName,
        )?.value;

        return (
          <div
            key={optionName}
            className={clsx(
              "flex flex-col gap-2",
              isDisabled && "opacity-50 cursor-not-allowed",
            )}
          >
            <legend className="whitespace-pre-wrap max-w-prose leading-snug min-w-16">
              <span className="font-semibold text-base">
                {config?.displayName || optionName}:
              </span>
              <span className="ml-1 font-normal text-base">
                {selectedValue}
              </span>
            </legend>
            <VariantOption
              name={optionName}
              values={values}
              selectedOptionValue={selectedValue}
              onSelectOptionValue={handleSelectOptionValue}
              swatches={swatch?.swatches}
            />
          </div>
        );
      })}
    </div>
  );
};

const findVariantByOptions = (
  nodes: ProductVariantFragmentFragment[] | undefined,
  selectedOptions:
    | ProductVariantFragmentFragment["selectedOptions"]
    | undefined,
) => {
  if (!nodes?.length || !selectedOptions) {
    return undefined;
  }
  const selectedByName = new Map(
    selectedOptions.map((opt) => [opt.name, opt.value]),
  );
  return nodes.find((variant) =>
    variant.selectedOptions.every(
      (opt) => opt.value === selectedByName.get(opt.name),
    ),
  );
};
