import type {
  ChildMenuItemFragment,
  MenuFragment,
  ParentMenuItemFragment,
} from "storefront-api.generated";

export function getMaxDepth(item: { items: any[] }): number {
  if (item.items?.length > 0) {
    return Math.max(...item.items.map(getMaxDepth)) + 1;
  }
  return 1;
}

type EnhancedMenuItemProps = {
  to: string;
  target: string;
  isExternal?: boolean;
};

export type ChildEnhancedMenuItem = ChildMenuItemFragment &
  EnhancedMenuItemProps;

export type ParentEnhancedMenuItem = (ParentMenuItemFragment &
  EnhancedMenuItemProps) & {
  items: ChildEnhancedMenuItem[];
};

export type EnhancedMenu = Pick<MenuFragment, "id"> & {
  items: ParentEnhancedMenuItem[];
};

export interface SingleMenuItem {
  id: string;
  title: string;
  type?: string;
  items: SingleMenuItem[];
  to: string;
  resource?: {
    __typename?: string;
    title?: string;
    description?: string;
    collections?: {
      nodes: Array<{
        id: string;
        title: string;
      }>;
    };
    handle?: string;
    image?: {
      altText: string;
      height: number;
      id: string;
      url: string;
      width: number;
    };
  };
}

export function isBrandCardMenu(item: {
  items?: SingleMenuItem[];
  type?: string;
}) {
  const children = item.items ?? [];

  return (
    item.type === "CATALOG" &&
    children.length > 0 &&
    children.every(
      (child) =>
        Boolean(child.resource?.image) && (child.items?.length ?? 0) === 0,
    )
  );
}

export function isCollectionMenu(item: Pick<SingleMenuItem, "items">) {
  return item.items.some(
    (child) => child.resource?.__typename === "Collection",
  );
}
