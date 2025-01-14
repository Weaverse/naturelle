import type {MetaFunction} from '@remix-run/react';
import {flattenConnection, getSeoMeta, type SeoConfig} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import {type RouteLoaderArgs} from '@weaverse/hydrogen';
import {routeHeaders} from '~/data/cache';
import {BLOGS_PAGE_QUERY} from '~/graphql/data/queries';
import {PAGINATION_SIZE} from '~/lib/utils/const';
import {seoPayload} from '~/lib/seo.server';
import {WeaverseContent} from '~/weaverse';
import type {BlogQuery} from 'storefrontapi.generated';
import invariant from 'tiny-invariant';

export const headers = routeHeaders;

export const loader = async (args: RouteLoaderArgs) => {
  let {params, request, context} = args;
  const {language, country} = context.storefront.i18n;

  invariant(params.blogHandle, 'Missing blog handle');

  const {blog} = await context.storefront.query<BlogQuery>(BLOGS_PAGE_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
      pageBy: PAGINATION_SIZE,
      language,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  const articles = flattenConnection(blog.articles).map((article) => {
    const {publishedAt} = article!;
    return {
      ...article,
      publishedAt: new Intl.DateTimeFormat(`${language}-${country}`, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(publishedAt!)),
    };
  });

  const seo = seoPayload.blog({blog, url: request.url});

  return json({
    blog,
    articles,
    seo,
    weaverseData: await context.weaverse.loadPage({
      type: 'BLOG',
      handle: params.blogHandle,
    }),
  });
};

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return getSeoMeta(data!.seo as SeoConfig);
};
export default function Blogs() {
  return (
    <div>
      <WeaverseContent />
    </div>
  );
}
