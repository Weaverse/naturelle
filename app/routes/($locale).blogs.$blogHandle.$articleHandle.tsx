import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {Button} from '@/components/ui/button';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.article.title ?? ''} article`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const {blog} = await context.storefront.query(ARTICLE_QUERY, {
    variables: {blogHandle, articleHandle},
  });

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  const article = blog.articleByHandle;

  return json({article});
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div className="article space-y-10 mb-10">
      {image && (
        <Image
          data={image}
          className="max-h-[720px] object-cover"
          sizes="90vw"
          loading="eager"
        />
      )}
      <div className="container space-y-10">
        <div className="space-y-4 text-center">
          <Button>Blog badge</Button>
          <h1 className="font-bold">{title}</h1>
        </div>
        <div
          dangerouslySetInnerHTML={{__html: contentHtml}}
          className="article"
        />
        <p className="text-foreground-subtle">
          <span>
            {publishedDate} &middot; {author?.name}
          </span>
        </p>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      articleByHandle(handle: $articleHandle) {
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;
