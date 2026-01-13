import { Pagination } from "@shopify/hydrogen";
import type { HydrogenComponentProps } from "@weaverse/hydrogen";
import { createSchema } from "@weaverse/hydrogen";
import type { RefObject } from "react";
import { useInView } from "react-intersection-observer";
import { useLoaderData } from "react-router";
import type { StoreCollectionsQuery } from "storefront-api.generated";
import { Button } from "~/components/button";
import { CollectionsLoadedOnScroll } from "./collection-loader-on-scroll";

interface CollectionListProps extends HydrogenComponentProps {
  collectionsPerRow: number;
  lazyLoadImage: boolean;
}

let CollectionListItem = ({
  ref: sectionRef,
  ...props
}: CollectionListProps & { ref?: RefObject<HTMLDivElement | null> }) => {
  let { ref, inView } = useInView();
  let { collections } = useLoaderData<StoreCollectionsQuery>();
  let { collectionsPerRow, lazyLoadImage, children, ...rest } = props;
  return (
    <div ref={sectionRef} {...rest}>
      <Pagination connection={collections}>
        {({
          nodes,
          isLoading,
          PreviousLink,
          previousPageUrl,
          hasPreviousPage,
          NextLink,
          nextPageUrl,
          hasNextPage,
          state,
        }) => (
          <>
            <div className="mb-6 flex items-center justify-center">
              <Button as={PreviousLink} variant="outline">
                {isLoading ? "Loading..." : "Previous collections"}
              </Button>
            </div>
            <CollectionsLoadedOnScroll
              nodes={nodes}
              collectionsPerRow={collectionsPerRow}
              lazyLoadImage={lazyLoadImage}
              inView={inView}
              previousPageUrl={previousPageUrl}
              hasPreviousPage={hasPreviousPage}
              nextPageUrl={nextPageUrl}
              hasNextPage={hasNextPage}
              state={state}
            />
            <div className="mt-6 flex items-center justify-center">
              <Button as={NextLink} variant="outline">
                {isLoading ? "Loading..." : "Next collections"}
              </Button>
            </div>
          </>
        )}
      </Pagination>
    </div>
  );
};

export default CollectionListItem;

export const schema = createSchema({
  type: "collection-list--item",
  title: "Collection list",
  limit: 1,
  settings: [
    {
      group: "Collection list",
      inputs: [
        {
          type: "range",
          name: "collectionsPerRow",
          label: "Collections per row",
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
        {
          type: "switch",
          name: "lazyLoadImage",
          label: "Lazy load image",
          defaultValue: true,
        },
      ],
    },
  ],
});
