import type {MetaFunction} from '@remix-run/react';
import {getSeoMeta, type SeoConfig} from '@shopify/hydrogen';
import { data } from '@shopify/remix-oxygen';
import { type RouteLoaderArgs } from '@weaverse/hydrogen';
import { routeHeaders } from '~/data/cache';
import { seoPayload } from '~/lib/seo.server';
import { WeaverseContent } from '~/weaverse';
import invariant from 'tiny-invariant';

export const headers = routeHeaders;

export async function loader({request, params, context}: RouteLoaderArgs) {
  invariant(params.handle, 'Missing page handle');

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
      language: context.storefront.i18n.language,
    },
  });

  if (!page) {
    throw new Response(null, {status: 404});
  }

  const seo = seoPayload.page({page, url: request.url});

  return data({
    page,
    seo,
    weaverseData: await context.weaverse.loadPage({
      type: 'PAGE',
      handle: params.handle,
    }),
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return getSeoMeta(data!.seo as SeoConfig);
};
export default function Page() {
  return <WeaverseContent />;
}

const PAGE_QUERY = `#graphql
  query PageDetails($language: LanguageCode, $handle: String!)
  @inContext(language: $language) {
    page(handle: $handle) {
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
`;
