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
    options,
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
    let newSelectedVariant =
      findVariantByOptions(nodes, newSelectedOptions) ??
      findVariantByOptionValue(nodes, optionName, value) ??
      ({
        ...selectedVariant,
        selectedOptions: newSelectedOptions,
        availableForSale: false,
        quantityAvailable: -1,
      } as ProductVariantFragmentFragment);
    onSelectedVariantChange(newSelectedVariant);
  };

  let selectedOptionMap = new Map<string, string>();
  for (const opt of selectedOptions ?? []) {
    selectedOptionMap.set(opt.name, opt.value);
  }

  if (selectedOptions?.every((opt) => opt.value === "Default Title")) {
    return null;
  }

  return (
    <div data-motion="fade-up" className="flex flex-col gap-6">
      {options.map((option) => {
        let optionName = option.name;
        const shouldRenderAsImage = isImageOption(optionName);
        let clonedSelectedOptionMap = new Map(selectedOptionMap);
        let values = option.optionValues
          .map((optionValue) => {
            clonedSelectedOptionMap.set(optionName, optionValue.name);
            let matchingVariant = findVariantByOptions(
              nodes,
              clonedSelectedOptionMap,
            );
            const selectableVariant =
              matchingVariant ??
              findVariantByOptionValue(nodes, optionName, optionValue.name);
            const imageVariant =
              matchingVariant ??
              optionValue.firstSelectableVariant ??
              selectableVariant;
            if (hideUnavailableOptions && !selectableVariant) {
              return null;
            }
            return {
              isActive: selectedOptionMap.get(optionName) === optionValue.name,
              isAvailable: Boolean(selectableVariant?.availableForSale),
              search: "",
              to: "",
              value: optionValue.name,
              image: shouldRenderAsImage ? imageVariant?.image : undefined,
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
}

function findVariantByOptions(
  nodes: ProductVariantFragmentFragment[] | undefined,
  selectedOptions:
    | ProductVariantFragmentFragment["selectedOptions"]
    | Map<string, string>
    | undefined,
) {
  if (!nodes?.length || !selectedOptions) {
    return undefined;
  }
  const selectedByName =
    selectedOptions instanceof Map
      ? selectedOptions
      : new Map(selectedOptions.map((opt) => [opt.name, opt.value]));
  return nodes.find((variant) =>
    variant.selectedOptions.every(
      (opt) => opt.value === selectedByName.get(opt.name),
    ),
  );
}

function findVariantByOptionValue(
  nodes: ProductVariantFragmentFragment[] | undefined,
  optionName: string,
  value: string,
) {
  if (!nodes?.length) {
    return undefined;
  }
  return (
    nodes.find(
      (variant) =>
        variant.availableForSale &&
        variant.selectedOptions.some(
          (opt) => opt.name === optionName && opt.value === value,
        ),
    ) ??
    nodes.find((variant) =>
      variant.selectedOptions.some(
        (opt) => opt.name === optionName && opt.value === value,
      ),
    )
  );
}
