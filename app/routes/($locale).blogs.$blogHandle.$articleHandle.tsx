import type { MetaFunction } from "@remix-run/react";
import { type SeoConfig, getSeoMeta } from "@shopify/hydrogen";
import { data } from "@shopify/remix-oxygen";
import type { RouteLoaderArgs } from "@weaverse/hydrogen";
import type { ArticleDetailsQuery } from "storefrontapi.generated";
import invariant from "tiny-invariant";
import { routeHeaders } from "~/data/cache";
import { ARTICLE_QUERY } from "~/graphql/data/queries";
import { seoPayload } from "~/lib/seo.server";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export async function loader(args: RouteLoaderArgs) {
  let { request, params, context } = args;
  const { language, country } = context.storefront.i18n;

  invariant(params.blogHandle, "Missing blog handle");
  invariant(params.articleHandle, "Missing article handle");

  const { blog } = await context.storefront.query<ArticleDetailsQuery>(
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
    throw new Response(null, { status: 404 });
  }

  const article = blog.articleByHandle;
  const relatedArticles = blog.articles.nodes.filter(
    (art: any) => art?.handle !== params?.articleHandle,
  );

  const formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(article?.publishedAt!));

  const seo = seoPayload.article({ article, url: request.url });

  return data({
    article,
    blog: {
      handle: params.blogHandle,
    },
    relatedArticles,
    formattedDate,
    seo,
    weaverseData: await context.weaverse.loadPage({
      type: "ARTICLE",
      handle: params.articleHandle,
    }),
  });
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return getSeoMeta(data!.seo as SeoConfig);
};
export default function Article() {
  return <WeaverseContent />;
}
