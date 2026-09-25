import { getProductOptions } from "@shopify/hydrogen";
import { useThemeSettings } from "@weaverse/hydrogen";
import type {
	ProductQuery,
	ProductVariantFragmentFragment,
} from "storefront-api.generated";
import { VariantOption } from "./options";

export type VariantDisplayType =
	| "swatch"
	| "image"
	| "dropdown"
	| "morphology"
	| "button";

interface VariantDisplaySettings {
	variantSwatchOptionNames?: string;
	variantImageOptionNames?: string;
	variantDropdownOptionNames?: string;
	variantMorphologyOptionNames?: string;
}

export const DEFAULT_VARIANT_DISPLAY_SETTINGS: Required<VariantDisplaySettings> =
	{
		variantSwatchOptionNames: "Color, Colors, Colour, Colours",
		variantImageOptionNames: "Image, Images, Type, Types, Skin Type",
		variantDropdownOptionNames: "Dropdown, Dropdowns",
		variantMorphologyOptionNames: "Size, Sizes, Shape, Shapes",
	};

interface ProductVariantsProps {
	selectedVariant: ProductVariantFragmentFragment;
	onSelectedVariantChange: (variant: ProductVariantFragmentFragment) => void;
	variants: {
		nodes: ProductVariantFragmentFragment[];
	};
	product: NonNullable<ProductQuery["product"]>;
	hideUnavailableOptions?: boolean;
}

export function ProductVariants(props: ProductVariantsProps) {
	let {
		selectedVariant,
		onSelectedVariantChange,
		variants,
		product,
		hideUnavailableOptions,
	} = props;
	const themeSettings = useThemeSettings() as VariantDisplaySettings;

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
				const displayType = getVariantDisplayType(optionName, themeSettings);
				let values = option.optionValues
					.map((optionValue) => {
						if (hideUnavailableOptions && !optionValue.exists) {
							return null;
						}
						return {
							exists: optionValue.exists,
							isAvailable: optionValue.available,
							value: optionValue.name,
							swatch: optionValue.swatch,
							image:
								displayType === "image"
									? (optionValue.swatch?.image?.previewImage ??
										optionValue.variant?.image ??
										optionValue.firstSelectableVariant?.image)
									: undefined,
						};
					})
					.filter(Boolean);
				let handleSelectOptionValue = (value: string) =>
					handleSelectOption(optionName, value);
				let selectedValue = selectedOptions?.find(
					(opt) => opt.name === optionName,
				)?.value;

				return (
					<div key={optionName} className="flex flex-col gap-2">
						<legend className="whitespace-pre-wrap max-w-prose leading-snug min-w-16">
							<span className="font-semibold text-base">{optionName}:</span>
							<span className="ml-1 font-normal text-base">
								{selectedValue}
							</span>
						</legend>
						<VariantOption
							name={optionName}
							values={values}
							selectedOptionValue={selectedValue}
							onSelectOptionValue={handleSelectOptionValue}
							displayType={displayType}
						/>
					</div>
				);
			})}
		</div>
	);
}

function includesOption(optionNames: string | undefined, optionName: string) {
	const normalizedOptionName = optionName.trim().toLowerCase();
	return (optionNames ?? "")
		.split(",")
		.some((name) => name.trim().toLowerCase() === normalizedOptionName);
}

function getVariantDisplayType(
	optionName: string,
	settings: VariantDisplaySettings,
): VariantDisplayType {
	if (
		includesOption(
			settings.variantSwatchOptionNames ??
				DEFAULT_VARIANT_DISPLAY_SETTINGS.variantSwatchOptionNames,
			optionName,
		)
	) {
		return "swatch";
	}
	if (
		includesOption(
			settings.variantImageOptionNames ??
				DEFAULT_VARIANT_DISPLAY_SETTINGS.variantImageOptionNames,
			optionName,
		)
	) {
		return "image";
	}
	if (
		includesOption(
			settings.variantDropdownOptionNames ??
				DEFAULT_VARIANT_DISPLAY_SETTINGS.variantDropdownOptionNames,
			optionName,
		)
	) {
		return "dropdown";
	}
	if (
		includesOption(
			settings.variantMorphologyOptionNames ??
				DEFAULT_VARIANT_DISPLAY_SETTINGS.variantMorphologyOptionNames,
			optionName,
		)
	) {
		return "morphology";
	}
	return "button";
}

function findVariantByOptions(
	nodes: ProductVariantFragmentFragment[] | undefined,
	selectedOptions:
		| ProductVariantFragmentFragment["selectedOptions"]
		| undefined,
) {
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
}
