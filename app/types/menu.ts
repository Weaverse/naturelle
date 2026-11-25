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
  items: SingleMenuItem[];
  to: string;
  resource?: {
    __typename?: string;
    title?: string;
    description?: string;
    collections?: {
      nodes: {
        id: string;
        title: string;
      }[];
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

export type MenuLayout =
  | "link"
  | "journal"
  | "collection-card"
  | "collection"
  | "image-card"
  | "dropdown"
  | "multi";

type ImageMenuItem = SingleMenuItem & {
  resource: NonNullable<SingleMenuItem["resource"]> & {
    image: NonNullable<NonNullable<SingleMenuItem["resource"]>["image"]>;
  };
};

export type CollectionCardMenuItem = ImageMenuItem & {
  resource: ImageMenuItem["resource"] & {
    __typename: "Collection";
  };
};

/**
 * A one-level menu made entirely from image-bearing collections uses the
 * collection-card layout. Merchants opt into the layout through menu structure
 * instead of a locale-dependent title, URL, or collection tag.
 */
export function isCollectionCardMenu(item: {
  items?: SingleMenuItem[];
}): item is { items: CollectionCardMenuItem[] } {
  const children = item.items ?? [];

  return (
    children.length > 0 &&
    children.every(
      (child) =>
        child.resource?.__typename === "Collection" &&
        Boolean(child.resource.image) &&
        (child.items?.length ?? 0) === 0,
    )
  );
}

export function isImageCardMenu(item: {
  items?: SingleMenuItem[];
}): item is { items: ImageMenuItem[] } {
  const children = item.items ?? [];

  return (
    children.length > 0 &&
    children.every(
      (child) =>
        Boolean(child.resource?.image) &&
        child.resource?.__typename !== "Collection" &&
        (child.items?.length ?? 0) === 0,
    )
  );
}

export function isCollectionMenu(item: Pick<SingleMenuItem, "items">) {
  return (
    item.items.length > 0 &&
    item.items.every((child) => child.resource?.__typename === "Collection")
  );
}

/** Classifies a Shopify menu once so desktop and mobile share the same rules. */
export function getMenuLayout(item: SingleMenuItem): MenuLayout {
  const children = item.items ?? [];

  if (children.length === 0) {
    return "link";
  }
  if (children.some((child) => child.resource?.__typename === "Blog")) {
    return "journal";
  }
  if (isCollectionCardMenu(item)) {
    return "collection-card";
  }
  if (isImageCardMenu(item)) {
    return "image-card";
  }

  const level = getMaxDepth(item);
  if (level === 2) {
    return "dropdown";
  }
  if (isCollectionMenu(item)) {
    return "collection";
  }
  return "multi";
}
