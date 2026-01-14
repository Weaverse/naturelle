import type { MappedProductOptions, Storefront } from "@shopify/hydrogen";
import type { MoneyV2 } from "@shopify/hydrogen/storefront-api-types";
import { PRODUCT_QUERY, VARIANTS_QUERY } from "~/graphql/queries";

export function hasOnlyDefaultVariant(
  productOptions: MappedProductOptions[] = [],
) {
  if (productOptions.length === 1) {
    const option = productOptions[0];
    if (option.name === "Title" && option.optionValues.length === 1) {
      const optionValue = option.optionValues[0];
      return optionValue.name === "Default Title";
    }
  }
  return false;
}

export function isNewArrival(date: string, daysOld = 30) {
  return (
    new Date(date).valueOf() >
    new Date().setDate(new Date().getDate() - daysOld).valueOf()
  );
}

export function isDiscounted(price: MoneyV2, compareAtPrice: MoneyV2) {
  if (compareAtPrice?.amount > price?.amount) {
    return true;
  }
  return false;
}

export const getProductData = async (
  storefront: Storefront,
  handle: string,
  metafield: string,
) => {
  const { shop, product } = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: handle,
      selectedOptions: [],
      namespace: metafield.split(".")[0],
      key: metafield.split(".")[1],
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });
  const variants = await storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: handle,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });
  return {
    variants,
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    // recommended
  };
};

export type ProductData = Awaited<ReturnType<typeof getProductData>>;
