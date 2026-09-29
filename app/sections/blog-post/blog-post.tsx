import { Image } from "@shopify/hydrogen";
import type { Article } from "@shopify/hydrogen/storefront-api-types";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { useLoaderData } from "react-router";
import { IconArrowLeft, IconArrowRight } from "~/components/icon";
import { Link } from "~/components/link";
import { ProductShareLinks } from "~/components/product-form/pdp-form";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { usePrefixClassNames } from "~/utils/misc";

type BlogPostProps = SectionProps;

let BlogPost = ({
  ref,
  ...props
}: BlogPostProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { ...rest } = props;
  let {
    article,
    articleUrl,
    blog,
    formattedDate,
    previousArticle,
    nextArticle,
  } = useLoaderData<{
    article: Article;
    articleUrl: string;
    blog: { handle: string };
    formattedDate: string;
    previousArticle: Article | null;
    nextArticle: Article | null;
  }>();
  let { title, image, contentHtml, author, tags } = article;

  let articleContent = usePrefixClassNames(contentHtml, "wv-");

  if (article) {
    return (
      <Section
        ref={ref}
        {...rest}
        verticalPadding="none"
        className="h-fit max-w-230 py-10 px-4 md:px-6 lg:px-0"
      >
        <div className="flex flex-col h-fit gap-6">
          <div className="h-full flex flex-col">
            <div className="h-full flex items-center py-6 flex-col gap-4 mx-auto">
              {tags[0] && (
                <span className="rounded-sm bg-background-subtle-2 px-3.75 py-1 font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text">
                  Product guide
                </span>
              )}
              <h2 className="text-center text-text">{title}</h2>
              <p className="font-semibold text-text-subtle">
                {formattedDate}
                {author?.name && ` - ${author.name}`}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-9">
            {image && (
              <Image
                data={image}
                className="w-full h-[330px] sm:h-[720px] object-cover"
              />
            )}
            <article
              className="prose-lg"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />
            <div className="flex flex-col gap-2 py-0.5 sm:flex-row sm:items-center sm:justify-between">
              {tags.length > 0 && (
                <p className="font-body text-base leading-[160%] tracking-[-0.16px] text-text-subtle">
                  <span className="font-semibold">Tags:</span>{" "}
                  <span className="font-normal">{tags.join(", ")}</span>
                </p>
              )}
              <ProductShareLinks
                productUrl={articleUrl}
                title={title}
                className="gap-2 pt-0 text-base sm:ml-auto [&_a]:size-6 [&_svg]:size-6"
              />
            </div>
            <div aria-hidden="true" className="h-px w-full bg-border-subtle" />
            {(previousArticle || nextArticle) && (
              <nav
                aria-label="Article navigation"
                className="grid grid-cols-2 gap-6"
              >
                <div>
                  {previousArticle && (
                    <Link
                      to={`/blogs/${blog.handle}/${previousArticle.handle}`}
                      className="group flex flex-col gap-2 text-text"
                    >
                      <span className="flex items-center gap-2 font-body text-base leading-[160%] font-semibold tracking-[-0.16px] text-text-subtle">
                        <IconArrowLeft className="size-5" />
                        Prev
                      </span>
                      <span className="block font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text group-hover:underline">
                        {previousArticle.title}
                      </span>
                    </Link>
                  )}
                </div>
                <div className="text-right">
                  {nextArticle && (
                    <Link
                      to={`/blogs/${blog.handle}/${nextArticle.handle}`}
                      className="group flex flex-col gap-2 text-text"
                    >
                      <span className="flex items-center justify-end gap-2 text-right font-body text-base leading-[160%] font-semibold tracking-[-0.16px] text-text-subtle">
                        Next
                        <IconArrowRight className="size-5" />
                      </span>
                      <span className="block font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text group-hover:underline">
                        {nextArticle.title}
                      </span>
                    </Link>
                  )}
                </div>
              </nav>
            )}
          </div>
        </div>
      </Section>
    );
  }
  return <section ref={ref} {...rest} />;
};

export default BlogPost;

export const schema = createSchema({
  type: "blog-post",
  title: "Blog post",
  limit: 1,
  enabledOn: {
    pages: ["ARTICLE"],
  },
  settings: [
    {
      group: "Blog post",
      inputs: layoutInputs.filter(
        ({ name }) =>
          name !== "divider" &&
          name !== "borderRadius" &&
          name !== "verticalPadding",
      ),
    },
  ],
});
