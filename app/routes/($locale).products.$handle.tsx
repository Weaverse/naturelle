import {
  type MetaFunction,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import {
  AnalyticsPageType,
  type SeoConfig,
  type ShopifyAnalyticsProduct,
  getSeoMeta,
} from "@shopify/hydrogen";
import type { SelectedOptionInput } from "@shopify/hydrogen/storefront-api-types";
import {
  type ActionFunctionArgs,
  type HeadersFunction,
  type LoaderFunctionArgs,
  data,
} from "@shopify/remix-oxygen";
import { getSelectedProductOptions } from "@weaverse/hydrogen";
import { useEffect } from "react";
import type { ProductRecommendationsQuery } from "storefrontapi.generated";
import invariant from "tiny-invariant";
import { routeHeaders } from "~/data/cache";
import {
  PRODUCT_QUERY,
  RECOMMENDED_PRODUCTS_QUERY,
  VARIANTS_QUERY,
} from "~/graphql/data/queries";
import { seoPayload } from "~/lib/seo.server";
import type { Storefront } from "~/lib/types/type-locale";
import { createJudgemeReview, getJudgemeReviews } from "~/lib/utils/judgeme";
import { WeaverseContent } from "~/weaverse";

export const headers: HeadersFunction = ({ loaderHeaders, actionHeaders }) => {
  return {
    ...routeHeaders,
    ...(loaderHeaders || {}),
    ...(actionHeaders || {}),
  };
};

export async function loader({ params, request, context }: LoaderFunctionArgs) {
  const { handle } = params;

  invariant(handle, "Missing productHandle param, check route filename");

  const selectedOptions = getSelectedProductOptions(request);
  let metafield = context.env.PRODUCT_CUSTOM_DATA_METAFIELD || 'custom.details';
  const { shop, product } = await context.storefront.query(PRODUCT_QUERY, {
    variables: {
      handle: handle,
      selectedOptions,
      namespace: metafield.split('.')[0],
      key: metafield.split('.')[1],
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

  if (!product?.id) {
    throw new Response("product", { status: 404 });
  }

  if (!product.selectedVariant && product.options.length) {
    // set the selectedVariant to the first variant if there is only one option
    if (product.options.length < 2) {
      product.selectedVariant = product.variants.nodes[0];
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into its own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deferred query resolves, the UI will update.
  const variants = await context.storefront.query(VARIANTS_QUERY, {
    variables: {
      handle: handle,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
    },
  });

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

  let judgeme_API_TOKEN = context.env.JUDGEME_PRIVATE_API_TOKEN;
  let shop_domain = context.env.PUBLIC_STORE_DOMAIN;
  let judgemeReviews = await getJudgemeReviews(
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
    weaverseData: await context.weaverse.loadPage({
      type: "PRODUCT",
      handle: handle,
    }),
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

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return getSeoMeta(data!.seo as SeoConfig);
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
      selectedOptions?.forEach((option: SelectedOptionInput) => {
        searchParams.set(option.name, option.value);
      });
      setSearchParams(searchParams, {
        replace: true, // prevent adding a new entry to the history stack
      });
    }
    // eslint-disable-next-line
  }, [product]);
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
