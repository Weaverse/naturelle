import type {MetaFunction} from '@remix-run/react';
import {
  getPaginationVariables,
  getSeoMeta,
  type SeoConfig,
} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {seoPayload} from '~/lib/seo.server';
import {WeaverseContent} from '~/weaverse';

export async function loader({context, request}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 16,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  const seo = seoPayload.listCollections({
    collections,
    url: request.url,
  });
  return json({
    collections,
    seo,
    weaverseData: await context.weaverse.loadPage({type: 'COLLECTION_LIST'}),
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return getSeoMeta(data!.seo as SeoConfig);
};
export default function Collections() {
  // const { collections } = useLoaderData<typeof loader>();

  return <WeaverseContent />;
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    description
    seo {
      title
      description
    }
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;