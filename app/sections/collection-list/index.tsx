import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { layoutInputs, Section, type SectionProps } from "~/components/section";

type CollectionListProps = SectionProps;

let CollectionList = ({
  ref,
  ...props
}: CollectionListProps & { ref?: RefObject<HTMLElement | null> }) => {
  let { children, ...rest } = props;
  return (
    <Section ref={ref} {...rest}>
      {children}
    </Section>
  );
};

export default CollectionList;

export const schema = createSchema({
  type: "collection-list",
  title: "Collection list",
  limit: 1,
  enabledOn: {
    pages: ["COLLECTION_LIST"],
  },
  settings: [
    {
      group: "Layout",
      inputs: layoutInputs.filter(
        ({ name }) => name !== "divider" && name !== "borderRadius",
      ),
    },
  ],
  childTypes: ["heading", "collection-list--item"],
  presets: {
    children: [
      {
        type: "heading",
        content: "Collections",
      },
      {
        type: "collection-list--item",
      },
    ],
  },
});
