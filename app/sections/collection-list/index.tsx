import { createSchema } from "@weaverse/hydrogen";
import type { CSSProperties, RefObject } from "react";
import { layoutInputs, Section, type SectionProps } from "~/components/section";
import { cn } from "~/utils/cn";
import {
  getCollectionCardStyle,
  getCollectionListLayoutClasses,
} from "./layout";

type CollectionListData = {
  cardOverlayColor?: string;
  cardOverlayOpacity?: number;
};

type CollectionListProps = SectionProps & CollectionListData;

let CollectionList = ({
  ref,
  ...props
}: CollectionListProps & { ref?: RefObject<HTMLElement | null> }) => {
  let {
    children,
    className,
    containerClassName,
    width,
    style,
    cardOverlayColor = "#453830",
    cardOverlayOpacity = 30,
    ...rest
  } = props;
  let resolvedWidth = width ?? "fixed";
  let { sectionClassName, containerClassName: fixedContainerClassName } =
    getCollectionListLayoutClasses(resolvedWidth);
  let collectionCardStyle = getCollectionCardStyle({
    overlayColor: cardOverlayColor,
    overlayOpacity: cardOverlayOpacity,
  });

  return (
    <Section
      ref={ref}
      {...rest}
      width={resolvedWidth}
      className={cn(className, sectionClassName)}
      containerClassName={cn(containerClassName, fixedContainerClassName)}
      style={{ ...style, ...collectionCardStyle } as CSSProperties}
    >
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
    {
      group: "Colors",
      inputs: [
        {
          type: "color",
          name: "cardOverlayColor",
          label: "Card overlay",
          defaultValue: "#453830",
        },
        {
          type: "range",
          name: "cardOverlayOpacity",
          label: "Card overlay opacity",
          defaultValue: 30,
          configs: { min: 0, max: 100, step: 1, unit: "%" },
        },
      ],
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
