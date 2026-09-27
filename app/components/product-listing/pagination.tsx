import { Pagination } from "@shopify/hydrogen";
import type { ReactNode } from "react";

type ProductListingPaginationLink = React.ComponentType<{
  className?: string;
  children?: ReactNode;
}>;

type ProductListingPaginationRenderArgs<T = unknown> = {
  nodes: T[];
  isLoading: boolean;
  nextPageUrl?: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  state: unknown;
  PreviousLink: ProductListingPaginationLink;
  NextLink: ProductListingPaginationLink;
};

interface ProductListingPaginationProps<T = unknown> {
  connection: {
    nodes: T[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
  renderPageContent: (
    props: ProductListingPaginationRenderArgs<T>,
  ) => ReactNode;
  renderPrevious?: (props: ProductListingPaginationRenderArgs<T>) => ReactNode;
  renderNext?: (props: ProductListingPaginationRenderArgs<T>) => ReactNode;
}

export function ProductListingPagination<T>({
  connection,
  renderPageContent,
  renderPrevious,
  renderNext,
}: ProductListingPaginationProps<T>) {
  return (
    <Pagination connection={connection}>
      {(props: ProductListingPaginationRenderArgs<T>) => (
        <>
          {props.hasPreviousPage && renderPrevious?.(props)}
          {renderPageContent(props)}
          {props.hasNextPage && renderNext?.(props)}
        </>
      )}
    </Pagination>
  );
}
