import { Link, type MetaFunction, useLoaderData } from "@remix-run/react";
import { Pagination, getPaginationVariables } from "@shopify/hydrogen";
import { type LoaderFunctionArgs, data } from "@shopify/remix-oxygen";
import { WeaverseContent } from "~/weaverse";

export const meta: MetaFunction = () => {
  return [{ title: `Hydrogen | Blogs` }];
};

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const { blogs } = await context.storefront.query(BLOGS_QUERY, {
    variables: {
      ...paginationVariables,
    },
  });

  return data({
    blogs,
    weaverseData: await context.weaverse.loadPage({ type: "BLOG" }),
  });
};

export default function Blogs() {
  const { blogs } = useLoaderData<typeof loader>();

  return (
    <>
      <div className="blogs">
        <h1>Blogs</h1>
        <div className="blogs-grid">
          <Pagination connection={blogs}>
            {({ nodes, isLoading, PreviousLink, NextLink }) => {
              return (
                <>
                  <PreviousLink>
                    {isLoading ? "Loading..." : <span>↑ Load previous</span>}
                  </PreviousLink>
                  {nodes.map((blog) => {
                    return (
                      <Link
                        className="blog"
                        key={blog.handle}
                        prefetch="intent"
                        to={`/blogs/${blog.handle}`}
                      >
                        <h2>{blog.title}</h2>
                      </Link>
                    );
                  })}
                  <NextLink>
                    {isLoading ? "Loading..." : <span>Load more ↓</span>}
                  </NextLink>
                </>
              );
            }}
          </Pagination>
        </div>
      </div>
      <WeaverseContent />
    </>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
` as const;
