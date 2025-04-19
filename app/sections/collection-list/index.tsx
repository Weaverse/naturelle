import type { HydrogenComponentSchema } from "@weaverse/hydrogen";
import { forwardRef } from "react";
import { Section, type SectionProps, layoutInputs } from "../atoms/Section";

type CollectionListProps = SectionProps;

let CollectionList = forwardRef<HTMLElement, CollectionListProps>(
  (props, ref) => {
    let { children, ...rest } = props;
    return (
      <Section ref={ref} {...rest}>
        {children}
      </Section>
    );
  },
);

export default CollectionList;

export let schema: HydrogenComponentSchema = {
  type: "collection-list",
  title: "Collection list",
  limit: 1,
  enabledOn: {
    pages: ["COLLECTION_LIST"],
  },
  toolbar: ["general-settings"],
  inspector: [
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
};
