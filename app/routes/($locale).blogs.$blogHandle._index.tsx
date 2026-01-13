import {
  flattenConnection,
  getSeoMeta,
  type SeoConfig,
} from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data } from "react-router";
import type { BlogQuery } from "storefront-api.generated";
import invariant from "tiny-invariant";
import { redirectIfHandleIsLocalized } from "~/.server/redirect";
import { seoPayload } from "~/.server/seo";
import { BLOGS_PAGE_QUERY } from "~/graphql/queries";
import { routeHeaders } from "~/utils/cache";
import { PAGINATION_SIZE } from "~/utils/const";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export const loader = async (args: LoaderFunctionArgs) => {
  let { params, request, context } = args;
  const { language, country } = context.storefront.i18n;

  invariant(params.blogHandle, "Missing blog handle");

  const { blog } = await context.storefront.query<BlogQuery>(BLOGS_PAGE_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
      pageBy: PAGINATION_SIZE,
      language,
    },
  });

  if (!blog?.articles) {
    throw new Response("Not found", { status: 404 });
  }

  // Redirect if handle is localized
  redirectIfHandleIsLocalized(request, {
    handle: params.blogHandle,
    data: blog,
  });

  const articles = flattenConnection(blog.articles).map((article) => {
    const publishedAt = article?.publishedAt;
    return {
      ...article,
      publishedAt: publishedAt
        ? new Intl.DateTimeFormat(`${language}-${country}`, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(new Date(publishedAt))
        : "",
    };
  });

  const seo = seoPayload.blog({ blog, url: request.url });

  return data({
    blog,
    articles,
    seo,
    weaverseData: await context.weaverse.loadPage({
      type: "BLOG",
      handle: params.blogHandle,
    }),
  });
};

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return getSeoMeta(loaderData?.seo as SeoConfig);
};
export default function Blogs() {
  return (
    <div>
      <WeaverseContent />
    </div>
  );
}
