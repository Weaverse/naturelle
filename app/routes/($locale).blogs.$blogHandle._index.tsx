import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import { Image, Pagination, getPaginationVariables } from '@shopify/hydrogen';
import type { ArticleItemFragment } from 'storefrontapi.generated';
import { Button } from '@/components/ui/button';
import { WeaverseContent } from '~/weaverse';


export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.blog.title ?? ''} blog` }];
};

export const loader = async ({
  request,
  params,
  context,
}: LoaderFunctionArgs) => {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 2,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, { status: 404 });
  }

  const { blog } = await context.storefront.query(BLOGS_QUERY, {
    variables: {
      blogHandle: params.blogHandle,
      ...paginationVariables,
    },
  });

  if (!blog?.articles) {
    throw new Response('Not found', { status: 404 });
  }

  return json({ blog, weaverseData: await context.weaverse.loadPage({ type: 'BLOG' }), });
};

export default function Blog() {
  const { blog } = useLoaderData<typeof loader>();
  const { articles } = blog;

  return (
    <>
      <div className="blog">
        <div className="h-36 w-full flex items-center justify-center bg-slate-200">
          <h1>{blog.title}</h1>
        </div>
        <div className="container my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Pagination connection={articles}>
            {({ nodes, isLoading, PreviousLink, NextLink }) => {
              return (
                <>
                  <PreviousLink>
                    {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                  </PreviousLink>
                  {nodes.map((article, index) => {
                    return (
                      <ArticleItem
                        article={article}
                        key={article.id}
                        loading={index < 2 ? 'eager' : 'lazy'}
                      />
                    );
                  })}
                  <div className="text-center col-span-full p-4">
                    <NextLink>
                      {isLoading ? (
                        'Loading...'
                      ) : (
                        <Button variant="outline">Show more +</Button>
                      )}
                    </NextLink>
                  </div>
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

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  console.log('9779 article', article);
  return (
    <div className="space-y-4 divide-y divide-bar-subtle" key={article.id}>
      <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
        {article.image && (
          <div className="blog-article-image">
            <Image
              className="rounded-[4px]"
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
              data={article.image}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        )}
        <h2 className="mt-4 font-medium">{article.title}</h2>
      </Link>
      <div className="hidden md:block">
        <p
          className="py-4"
          dangerouslySetInnerHTML={{ __html: article.excerptHtml! }}
        />
        <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
          Read more -&gt;
        </Link>
      </div>

      {/* <small>{publishedAt}</small> */}
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    excerpt
    excerptHtml
    blog {
      handle
    }
  }
` as const;
