import { getSeoMeta, type SeoConfig } from "@shopify/hydrogen";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { data } from "react-router";
import invariant from "tiny-invariant";
import { redirectIfHandleIsLocalized } from "~/.server/redirect";
import { seoPayload } from "~/.server/seo";
import { routeHeaders } from "~/utils/cache";
import { WeaverseContent } from "~/weaverse";

export const headers = routeHeaders;

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  invariant(params.handle, "Missing page handle");

  const [shopAndPage, weaverseData] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
        language: context.storefront.i18n.language,
      },
    }),
    context.weaverse.loadPage({
      type: "PAGE",
      handle: params.handle,
    }),
  ]);

  const { page } = shopAndPage;

  if (!page) {
    throw new Response(null, { status: 404 });
  }

  // Redirect if handle is localized
  redirectIfHandleIsLocalized(request, { handle: params.handle, data: page });

  const seo = seoPayload.page({ page, url: request.url });

  return data({
    page,
    seo,
    weaverseData,
  });
}

export const meta: MetaFunction<typeof loader> = ({ data: loaderData }) => {
  return getSeoMeta(loaderData?.seo as SeoConfig);
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
