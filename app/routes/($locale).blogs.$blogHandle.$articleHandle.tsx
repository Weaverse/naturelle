import type {MetaFunction} from '@remix-run/react';
import {getSeoMeta, type SeoConfig} from '@shopify/hydrogen';
import {json} from '@shopify/remix-oxygen';
import {type RouteLoaderArgs} from '@weaverse/hydrogen';
import {routeHeaders} from '~/data/cache';
import {ARTICLE_QUERY} from '~/graphql/data/queries';
import {seoPayload} from '~/lib/seo.server';
import {WeaverseContent} from '~/weaverse';
import type {ArticleDetailsQuery} from 'storefrontapi.generated';
import invariant from 'tiny-invariant';

export const headers = routeHeaders;

export async function loader(args: RouteLoaderArgs) {
  let {request, params, context} = args;
  const {language, country} = context.storefront.i18n;

  invariant(params.blogHandle, 'Missing blog handle');
  invariant(params.articleHandle, 'Missing article handle');

  const {blog} = await context.storefront.query<ArticleDetailsQuery>(
    ARTICLE_QUERY,
    {
      variables: {
        blogHandle: params.blogHandle,
        articleHandle: params.articleHandle,
        language,
      },
    },
  );

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;
  const relatedArticles = blog.articles.nodes.filter(
    (art: any) => art?.handle !== params?.articleHandle,
  );

  const formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article?.publishedAt!));

  const seo = seoPayload.article({article, url: request.url});

  return json({
    article,
    blog: {
      handle: params.blogHandle,
    },
    relatedArticles,
    formattedDate,
    seo,
    weaverseData: await context.weaverse.loadPage({
      type: 'ARTICLE',
      handle: params.articleHandle,
    }),
  });
}

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return getSeoMeta(data!.seo as SeoConfig);
};
export default function Article() {
  return <WeaverseContent />;
}
