import { useLoaderData } from "@remix-run/react";
import { Image } from "@shopify/hydrogen";
import type { Article } from "@shopify/hydrogen/storefront-api-types";
import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { prefixClassNames } from "~/lib/utils";
import { Section, type SectionProps, layoutInputs } from "../atoms/Section";

type BlogPostProps = SectionProps;

let BlogPost = forwardRef<HTMLElement, BlogPostProps>((props, ref) => {
  let { ...rest } = props;
  let { article, formattedDate } = useLoaderData<{
    article: Article;
    formattedDate: string;
  }>();
  let { title, image, contentHtml, author, tags } = article;

  let articleContent = prefixClassNames(contentHtml, "wv-");

  if (article) {
    return (
      <Section ref={ref} {...rest} className="h-fit">
        <div className="flex flex-col h-fit">
          <div className="h-full flex flex-col">
            {image && (
              <Image
                data={image}
                className="w-full h-[330px] sm:h-[720px] object-cover"
              />
            )}
            <div className="h-full flex items-center lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm pt-16 pb-6 flex-col gap-4 mx-auto px-4 md:px-6 lg:px-0">
              <h5 className="py-1 px-4 bg-label-new-background text-white rounded">
                Product guidelines
              </h5>
              <h1 className="font-bold text-center">{title}</h1>
            </div>
          </div>
          <div className="lg:max-w-screen-lg lg:pb-10 md:pb-8 pb-6 md:max-w-screen-md max-w-screen-sm px-4 mx-auto space-y-8 md:space-y-16">
            <article
              className="prose-lg"
              dangerouslySetInnerHTML={{ __html: articleContent }}
            />
            <p className="font-semibold opacity-45 text-foreground-subtle mt-9">
              {formattedDate}
            </p>
          </div>
        </div>
      </Section>
    );
  }
  return <section ref={ref} {...rest} />;
});

export default BlogPost;

export let schema: HydrogenComponentSchema = {
  type: "blog-post",
  title: "Blog post",
  limit: 1,
  enabledOn: {
    pages: ["ARTICLE"],
  },
  toolbar: ["general-settings"],
  inspector: [
    {
      group: "Blog post",
      inputs: layoutInputs.filter(
        ({ name }) => name !== "divider" && name !== "borderRadius",
      ),
    },
  ],
};
