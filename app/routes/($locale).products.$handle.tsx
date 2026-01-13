import {
  AnalyticsPageType,
  getSeoMeta,
  type SeoConfig,
  type ShopifyAnalyticsProduct,
} from "@shopify/hydrogen";
import { getSelectedProductOptions } from "@weaverse/hydrogen";
import { useEffect } from "react";
import {
  type ActionFunctionArgs,
  data,
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  useLoaderData,
  useSearchParams,
} from "react-router";
import type { ProductRecommendationsQuery } from "storefront-api.generated";
import invariant from "tiny-invariant";
import {
  redirectIfCombinedListing,
  redirectIfHandleIsLocalized,
} from "~/.server/redirect";
import { seoPayload } from "~/.server/seo";
import {
  PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  VARIANTS_QUERY,
} from "~/graphql/queries";
import type { Storefront } from "~/types/type-locale";
import { routeHeaders } from "~/utils/cache";
import { createJudgemeReview, getJudgemeReviews } from "~/utils/judgeme";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { handle } = params;

  invariant(handle, "Missing productHandle param, check route filename");

  const selectedOptions = getSelectedProductOptions(request);
  const metafield =
    context.env.PRODUCT_CUSTOM_DATA_METAFIELD || "custom.details";

  const [shopAndProduct, variants, weaverseData] = await Promise.all([
    context.storefront.query(PRODUCT_QUERY, {
      variables: {
        handle: handle,
        selectedOptions,
        namespace: metafield.split(".")[0],
        key: metafield.split(".")[1],
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
    context.storefront.query(VARIANTS_QUERY, {
      variables: {
        handle: handle,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    }),
    context.weaverse.loadPage({
      type: "PRODUCT",
      handle: handle,
    }),
  ]);

  const { shop, product } = shopAndProduct;

  if (!product?.id) {
    throw new Response("product", { status: 404 });
  }

  // Redirect if handle is localized or if it's a combined listing
  redirectIfHandleIsLocalized(request, { handle, data: product });
  redirectIfCombinedListing(request, product);

  if (
    !product.selectedVariant &&
    product.options.length &&
    product.options.length < 2
  ) {
    product.selectedVariant = product.variants.nodes[0];
  }

  const recommended = getRecommendedProducts(context.storefront, product.id);

  // TODO: firstVariant is never used because we will always have a selectedVariant due to redirect
  // Investigate if we can avoid the redirect for product pages with no search params for first variant
  const firstVariant = product.variants.nodes[0];
  const selectedVariant = product.selectedVariant ?? firstVariant;

  const productAnalytics: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: selectedVariant.id,
    name: product.title,
    variantName: selectedVariant.title,
    brand: product.vendor,
    price: selectedVariant.price.amount,
  };

  const seo = seoPayload.product({
    product,
    selectedVariant,
    url: request.url,
  });

  const judgeme_API_TOKEN = context.env.JUDGEME_PRIVATE_API_TOKEN;
  const shop_domain = context.env.PUBLIC_STORE_DOMAIN;
  const judgemeReviews = await getJudgemeReviews(
    judgeme_API_TOKEN,
    shop_domain,
    handle,
    context.weaverse,
  );

  return {
    variants,
    product,
    shop,
    storeDomain: shop.primaryDomain.url,
    recommended,
    analytics: {
      pageType: AnalyticsPageType.product,
      resourceId: product.id,
      products: [productAnalytics],
      totalValue: Number.parseFloat(selectedVariant.price.amount),
    },
    seo,
    weaverseData,
    judgemeReviews,
  };
}

export type ProductLoaderType = typeof loader;

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  let judgeme_API_TOKEN = context.env.JUDGEME_PRIVATE_API_TOKEN;
  invariant(judgeme_API_TOKEN, "Missing JUDGEME_PRIVATE_API_TOKEN");
  let response: any = {
    status: 201,
  };
  let shop_domain = context.env.PUBLIC_STORE_DOMAIN;
  response = await createJudgemeReview(
    judgeme_API_TOKEN,
    shop_domain,
    formData,
  );
  const { status, ...rest } = response;
  return data(rest, { status });
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return getSeoMeta(loaderData?.seo as SeoConfig);
};
// function redirectToFirstVariant({
//   product,
//   request,
// }: {
//   product: ProductQuery['product'];
//   request: Request;
// }) {
//   const searchParams = new URLSearchParams(new URL(request.url).search);
//   const firstVariant = product!.variants.nodes[0];
//   for (const option of firstVariant.selectedOptions) {
//     searchParams.set(option.name, option.value);
//   }
//
//   return redirect(
//     `/products/${product!.handle}?${searchParams.toString()}`,
//     302,
//   );
// }

/**
 * We need to handle the route change from client to keep the view transition persistent
 */
let useApplyFirstVariant = () => {
  let { product } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!product.selectedVariant) {
      let selectedOptions = product.variants?.nodes?.[0]?.selectedOptions;
      if (selectedOptions) {
        for (const option of selectedOptions) {
          searchParams.set(option.name, option.value);
        }
      }
      setSearchParams(searchParams, {
        replace: true, // prevent adding a new entry to the history stack
      });
    }
    // eslint-disable-next-line
  }, [product, searchParams, setSearchParams]);
};

export default function Product() {
  useApplyFirstVariant();
  return <WeaverseContent />;
}

async function getRecommendedProducts(
  storefront: Storefront,
  productId: string,
) {
  const products = await storefront.query<ProductRecommendationsQuery>(
    RECOMMENDED_PRODUCTS_QUERY,
    {
      variables: { productId, count: 12 },
    },
  );

  invariant(products, "No data returned from Shopify API");

  const mergedProducts = (products.recommended ?? [])
    .concat(products.additional.nodes)
    .filter(
      (value, index, array) =>
        array.findIndex((value2) => value2.id === value.id) === index,
    );

  const originalProduct = mergedProducts.findIndex(
    (item) => item.id === productId,
  );

  mergedProducts.splice(originalProduct, 1);

  return { nodes: mergedProducts };
}
