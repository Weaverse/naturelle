import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { useLoaderData } from "react-router";
import type { PageDetailsQuery } from "storefront-api.generated";
import { PageHeader, Section } from "~/components/text";
import { usePrefixClassNames } from "~/utils/misc";

interface PageProps extends HydrogenComponentProps {
  paddingTop: number;
  paddingBottom: number;
}

let Page = ({
  ref,
  ...props
}: PageProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { page } = useLoaderData<PageDetailsQuery>();
  let { paddingTop, paddingBottom, ...rest } = props;

  let pageContent = usePrefixClassNames(page?.body ?? "", "wv-");
  const isContactPage = page?.handle === "contact";

  if (page && isContactPage) {
    return (
      <section ref={ref} {...rest}>
        <div
          className="w-full px-4 md:px-6 lg:px-0"
          style={{
            paddingTop: `${paddingTop}px`,
            paddingBottom: `${paddingBottom}px`,
          }}
        >
          <article
            className="mx-auto flex w-full max-w-page flex-col gap-12 font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-text [&_h2]:text-text [&>:first-child]:w-full [&>:first-child]:max-w-page [&>:first-child_img]:w-full [&>:first-child_img]:max-w-none [&>:not(:first-child)]:mx-auto [&>:not(:first-child)]:w-full [&>:not(:first-child)]:max-w-230"
            dangerouslySetInnerHTML={{ __html: pageContent }}
          />
        </div>
      </section>
    );
  }

  if (page) {
    return (
      <section ref={ref} {...rest}>
        <div
          className="grid w-full gap-8 px-6 md:px-8 lg:px-12 justify-items-start"
          style={{
            paddingTop: `${paddingTop}px`,
            paddingBottom: `${paddingBottom}px`,
          }}
        >
          <PageHeader heading={page.title} />
          <Section as="div" padding="all">
            <div className="lg:max-w-screen-lg md:max-w-screen-md max-w-screen-sm px-4 mx-auto space-y-8 md:space-y-16">
              <article
                className="prose-lg"
                dangerouslySetInnerHTML={{ __html: pageContent }}
              />
            </div>
          </Section>
        </div>
      </section>
    );
  }
  return <section ref={ref} {...rest} />;
};

export default Page;

export const schema = createSchema({
  type: "page",
  title: "Page",
  limit: 1,
  enabledOn: {
    pages: ["PAGE"],
  },
  settings: [
    {
      group: "Page",
      inputs: [
        {
          type: "range",
          label: "Top padding",
          name: "paddingTop",
          configs: {
            min: 0,
            max: 100,
            step: 4,
            unit: "px",
          },
          defaultValue: 32,
        },
        {
          type: "range",
          label: "Bottom padding",
          name: "paddingBottom",
          configs: {
            min: 0,
            max: 100,
            step: 4,
            unit: "px",
          },
          defaultValue: 32,
        },
      ],
    },
  ],
});
