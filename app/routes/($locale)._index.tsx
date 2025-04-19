import {type MetaFunction} from '@remix-run/react';
import {getSeoMeta, type SeoConfig} from '@shopify/hydrogen';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import {seoPayload} from '~/lib/seo.server';
import {WeaverseContent} from '~/weaverse';

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;
  const recommendedProducts = await storefront.query(
    RECOMMENDED_PRODUCTS_QUERY,
  );
  let seo = seoPayload.home();

  return {
    recommendedProducts,
    weaverseData: await context.weaverse.loadPage(),
    seo,
  };
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return getSeoMeta(data!.seo as SeoConfig);
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
