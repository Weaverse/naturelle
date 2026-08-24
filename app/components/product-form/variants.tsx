import { getProductOptions } from "@shopify/hydrogen";
import clsx from "clsx";
import type {
  ProductQuery,
  ProductVariantFragmentFragment,
} from "storefront-api.generated";
import { VariantOption } from "./options";

interface ProductVariantsProps {
  selectedVariant: ProductVariantFragmentFragment;
  onSelectedVariantChange: (variant: ProductVariantFragmentFragment) => void;
  variants: {
    nodes: ProductVariantFragmentFragment[];
  };
  handle: string;
  product: NonNullable<ProductQuery["product"]>;
  options: NonNullable<ProductQuery["product"]>["options"];
  swatch: {
    configs: any[];
    swatches: any;
  };
  hideUnavailableOptions?: boolean;
  isDisabled?: boolean;
}

export function ProductVariants(props: ProductVariantsProps) {
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
    let newSelectedVariant = nodes?.find((variant) => {
      let variantOptions = variant.selectedOptions;
      let isMatch = true;
      for (let i = 0; i < variantOptions.length; i += 1) {
        if (variantOptions[i].value !== newSelectedOptions?.[i].value) {
          isMatch = false;
          break;
        }
      }
      return isMatch;
    });
    if (!newSelectedVariant) {
      newSelectedVariant = {
        ...selectedVariant,
        selectedOptions: newSelectedOptions,
        availableForSale: false,
        quantityAvailable: -1,
      };
    }
    onSelectedVariantChange(newSelectedVariant);
  };

  let selectedOptionMap = new Map();
  for (const opt of selectedOptions ?? []) {
    selectedOptionMap.set(opt.name, opt.value);
  }

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  if (selectedOptions?.every((opt) => opt.value === "Default Title")) {
    return null;
  }

  return (
    <div data-motion="fade-up" className="flex flex-col gap-6">
      {productOptions.map((option) => {
        let optionName = option.name;
        let clonedSelectedOptionMap = new Map(selectedOptionMap);
        let values = option.optionValues
          .map((optionValue) => {
            clonedSelectedOptionMap.set(optionName, optionValue.name);
            let matchingVariant = nodes?.find((candidateVariant) => {
              return candidateVariant.selectedOptions.every((opt) => {
                return opt.value === clonedSelectedOptionMap.get(opt.name);
              });
            });
            if (hideUnavailableOptions && !matchingVariant) {
              return null;
            }
            return {
              isActive: selectedOptionMap.get(optionName) === optionValue.name,
              isAvailable: matchingVariant
                ? matchingVariant.availableForSale
                : false,
              search: "",
              to: "",
              value: optionValue.name,
              image: matchingVariant?.image,
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
              <span className="ml-2 font-semibold text-base">
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
}
