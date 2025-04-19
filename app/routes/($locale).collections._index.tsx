import type {MetaFunction} from '@remix-run/react';
import {
  getPaginationVariables,
  getSeoMeta,
  type SeoConfig,
} from '@shopify/hydrogen';
import { data, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { COLLECTIONS_QUERY } from '~/graphql/data/queries';
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
  return data({
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