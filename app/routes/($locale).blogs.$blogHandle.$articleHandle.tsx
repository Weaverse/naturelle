import { getSeoMeta, type SeoConfig } from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data } from "react-router";
import type { ArticleDetailsQuery } from "storefront-api.generated";
import invariant from "tiny-invariant";
import { redirectIfHandleIsLocalized } from "~/.server/redirect";
import { seoPayload } from "~/.server/seo";
import { ARTICLE_QUERY } from "~/graphql/queries";
import { routeHeaders } from "~/utils/cache";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  let { request, params, context } = args;
  const { language, country } = context.storefront.i18n;

  invariant(params.blogHandle, "Missing blog handle");
  invariant(params.articleHandle, "Missing article handle");

  const [shopAndBlog, weaverseData] = await Promise.all([
    context.storefront.query<ArticleDetailsQuery>(ARTICLE_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        articleHandle: params.articleHandle,
        language,
      },
    }),
    context.weaverse.loadPage({
      type: "ARTICLE",
      handle: params.articleHandle,
    }),
  ]);

  const { blog } = shopAndBlog;

  if (!blog?.articleByHandle) {
    throw new Response(null, { status: 404 });
  }

  const article = blog.articleByHandle;

  // Redirect if handles are localized
  redirectIfHandleIsLocalized(
    request,
    { handle: params.blogHandle, data: blog },
    { handle: params.articleHandle, data: article },
  );
  const relatedArticles = blog.articles.nodes.filter(
    (art: any) => art?.handle !== params?.articleHandle,
  );

  const formattedDate = new Intl.DateTimeFormat(`${language}-${country}`, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(article.publishedAt));

  const seo = seoPayload.article({ article, url: request.url });

  return data({
    article,
    blog: {
      handle: params.blogHandle,
    },
    relatedArticles,
    formattedDate,
    seo,
    weaverseData,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return getSeoMeta(loaderData?.seo as SeoConfig);
};
export default function Article() {
  return <WeaverseContent />;
}
