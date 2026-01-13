import {
  AnalyticsPageType,
  getSeoMeta,
  type SeoConfig,
} from "@shopify/hydrogen";
import type { PageType } from "@weaverse/hydrogen";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { seoPayload } from "~/.server/seo";
import type { Storefront } from "~/types/type-locale";
import { WeaverseContent } from "~/weaverse";

export async function loader({ context, params }: LoaderFunctionArgs) {
  const storefront = context.storefront as Storefront;
  let { pathPrefix } = storefront.i18n;
  let locale = pathPrefix.slice(1);
  let type: PageType = "INDEX";

  if (params.locale && params.locale.toLowerCase() !== locale) {
    // Update for Weaverse: if it not locale, it probably is a custom page handle
    type = "CUSTOM";
  }
  let weaverseData = await context.weaverse.loadPage({ type });
  if (!weaverseData?.page?.id || weaverseData.page.id.includes("fallback")) {
    throw new Response(null, { status: 404 });
  }
  let seo = seoPayload.home();

  return {
    weaverseData,
    analytics: {
      pageType: AnalyticsPageType.home,
    },
    seo,
  };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return getSeoMeta(data?.seo as SeoConfig);
};
export default function Homepage() {
  return (
    <div className="home">
      <WeaverseContent />
    </div>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
