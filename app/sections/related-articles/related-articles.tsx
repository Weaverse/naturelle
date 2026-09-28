import { Image } from "@shopify/hydrogen";
import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema, useTranslation } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import type { ArticleFragment } from "storefront-api.generated";
import { Link } from "~/components/link";
import { Skeleton } from "~/components/skeleton";
import { useRootLoaderData } from "~/root";
import type { I18nLocale } from "~/types/type-locale";
import { DEFAULT_LOCALE } from "~/utils/const";
import { getImageLoadingPriority } from "~/utils/image";
import { formatDate } from "~/utils/locale";

interface RelatedArticlesProps extends HydrogenComponentProps {
  heading: string;
  articlesCount: number;
  showExcerpt: boolean;
  showReadmore: boolean;
  showDate: boolean;
  showAuthor: boolean;
  imageAspectRatio: string;
}

let RelatedArticles = ({
  ref,
  ...props
}: RelatedArticlesProps & { ref?: RefObject<HTMLElement | null> }) => {
  const { t } = useTranslation();
  const locale = useRootLoaderData()?.selectedLocale ?? DEFAULT_LOCALE;
  let { blog, relatedArticles } = useLoaderData<{
    relatedArticles: any[];
    blog: { handle: string };
  }>();
  let {
    heading,
    articlesCount,
    showExcerpt,
    showAuthor,
    showDate,
    showReadmore,
    imageAspectRatio,
    ...rest
  } = props;
  if (relatedArticles.length > 0) {
    return (
      <section ref={ref} {...rest}>
        <Suspense fallback={<Skeleton className="h-32" />}>
          <Await
            errorElement={t("blog.relatedError")}
            resolve={relatedArticles}
          >
            <div className="space-y-8 md:space-y-16 md:p-8 lg:p-12 p-4">
              <h2 className="text-3xl font-bold max-w-prose text-center mx-auto">
                {heading}
              </h2>
              <ol className="md:grid grid-cols-3 hiddenScroll md:gap-6">
                {relatedArticles.slice(0, articlesCount).map((article, i) => (
                  <ArticleCard
                    key={article.id}
                    blogHandle={blog?.handle}
                    article={article}
                    loading={getImageLoadingPriority(i, 2)}
                    showAuthor={showAuthor}
                    showExcerpt={showExcerpt}
                    showDate={showDate}
                    showReadmore={showReadmore}
                    imageAspectRatio={imageAspectRatio}
                    locale={locale}
                    readMoreText={t("blog.readMore")}
                  />
                ))}
              </ol>
            </div>
          </Await>
        </Suspense>
      </section>
    );
  }
  return <section ref={ref} />;
};

function ArticleCard({
  blogHandle,
  article,
  loading,
  showExcerpt,
  showAuthor,
  showDate,
  showReadmore,
  imageAspectRatio,
  locale,
  readMoreText,
}: {
  blogHandle: string;
  article: ArticleFragment;
  loading?: HTMLImageElement["loading"];
  showDate: boolean;
  showExcerpt: boolean;
  showAuthor: boolean;
  showReadmore: boolean;
  imageAspectRatio: string;
  locale: I18nLocale;
  readMoreText: string;
}) {
  return (
    <li key={article.id}>
      <Link to={`/blogs/${blogHandle}/${article.handle}`}>
        {article.image && (
          <div className="card-image aspect-[3/2]">
            <Image
              alt={article.image.altText || article.title}
              className="object-cover w-full"
              data={article.image}
              aspectRatio={imageAspectRatio}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        )}
        <div className="space-y-2.5">
          <h2 className="mt-4 font-medium text-2xl">{article.title}</h2>
          <div className="flex items-center space-x-1">
            {showDate && article.publishedAt && (
              <span className="block">
                {formatDate(article.publishedAt, locale)}
              </span>
            )}
            {showDate && showAuthor && <span>•</span>}
            {showAuthor && (
              <span className="block">{article.author?.name}</span>
            )}
          </div>
          {showExcerpt && <div className="text-sm"> {article.excerpt}</div>}
          {showReadmore && (
            <div>
              <span className="underline">{readMoreText}</span>
            </div>
          )}
        </div>
      </Link>
    </li>
  );
}

export default RelatedArticles;

export const schema = createSchema({
  type: "related-articles",
  title: "Related articles",
  limit: 1,
  enabledOn: {
    pages: ["ARTICLE"],
  },
  settings: [
    {
      group: "Related articles",
      inputs: [
        {
          type: "text",
          name: "heading",
          label: "Heading",
          defaultValue: "Related articles",
          placeholder: "Related articles",
        },
        {
          type: "range",
          name: "articlesCount",
          label: "Number of articles",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 12,
            step: 1,
          },
        },
        {
          type: "switch",
          name: "showExcerpt",
          label: "Show excerpt",
          defaultValue: false,
        },
        {
          type: "switch",
          name: "showDate",
          label: "Show date",
          defaultValue: false,
        },
        {
          type: "switch",
          name: "showAuthor",
          label: "Show author",
          defaultValue: false,
        },
        {
          type: "switch",
          name: "showReadmore",
          label: "Show read more",
          defaultValue: true,
        },
      ],
    },
  ],
});
