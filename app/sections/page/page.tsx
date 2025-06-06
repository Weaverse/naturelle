import { useLoaderData } from "@remix-run/react";
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from "@weaverse/hydrogen";
import { forwardRef } from "react";
import type { PageDetailsQuery } from "storefrontapi.generated";
import { PageHeader, Section } from "~/components/Text";
import { prefixClassNames } from "~/lib/utils";

interface PageProps extends HydrogenComponentProps {
  paddingTop: number;
  paddingBottom: number;
}

let Page = forwardRef<HTMLElement, PageProps>((props, ref) => {
  let { page } = useLoaderData<PageDetailsQuery>();
  let { paddingTop, paddingBottom, ...rest } = props;

  let pageContent = prefixClassNames(page?.body ?? "", "wv-");

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
});

export default Page;

export let schema: HydrogenComponentSchema = {
  type: "page",
  title: "Page",
  limit: 1,
  enabledOn: {
    pages: ["PAGE"],
  },
  toolbar: ["general-settings"],
  inspector: [
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
};
