import { VariantSelector } from "@shopify/hydrogen";
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
    options,
    variants,
    handle,
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
      for (let i = 0; i < variantOptions.length; i++) {
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
  selectedOptions?.forEach((opt) => {
    selectedOptionMap.set(opt.name, opt.value);
  });

  if (selectedOptions?.every((opt) => opt.value === "Default Title")) {
    return null;
  }

  return (
    <div data-motion="fade-up" className="flex flex-col gap-6">
      <VariantSelector handle={handle} variants={nodes} options={options}>
        {({ option }) => {
          let optionName = option.name;
          let clonedSelectedOptionMap = new Map(selectedOptionMap);
          let values = option.values
            .map((value) => {
              clonedSelectedOptionMap.set(optionName, value.value);
              let variant = nodes?.find((variant) => {
                return variant.selectedOptions.every((opt) => {
                  return opt.value === clonedSelectedOptionMap.get(opt.name);
                });
              });
              if (hideUnavailableOptions && !variant) {
                return null;
              }
              return {
                ...value,
                isAvailable: variant ? variant.availableForSale : false,
                image: variant?.image,
              };
            })
            .filter(Boolean);
          let handleSelectOptionValue = (value: string) =>
            handleSelectOption(optionName, value);
          let config = swatch?.configs.find((config) => {
            return (
              config.name.trim().toLowerCase() ===
              optionName.trim().toLowerCase()
            );
          });
          let selectedValue = selectedOptions?.find(
            (opt) => opt.name === optionName,
          )?.value!;

          return (
            <div
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
        }}
      </VariantSelector>
    </div>
  );
}
