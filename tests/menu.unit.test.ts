import assert from "node:assert/strict";
import test from "node:test";
import {
  getMenuLayout,
  isCollectionCardMenu,
  isCollectionMenu,
  isImageCardMenu,
  type SingleMenuItem,
} from "../app/types/menu.ts";

const image = {
  altText: "",
  height: 100,
  id: "gid://shopify/Image/1",
  url: "https://cdn.shopify.com/image.jpg",
  width: 100,
};

function menuItem(overrides: Partial<SingleMenuItem> = {}): SingleMenuItem {
  return {
    id: "menu-item",
    items: [],
    title: "Menu item",
    to: "/",
    ...overrides,
  };
}

test("identifies a one-level menu of image-bearing collections as cards", () => {
  assert.equal(
    isCollectionCardMenu(
      menuItem({
        title: "Thương hiệu",
        to: "/san-pham",
        items: [
          {
            id: "brand-card",
            title: "Thương hiệu A",
            to: "/thuong-hieu/a",
            resource: { __typename: "Collection", image },
          } as SingleMenuItem,
        ],
      }),
    ),
    true,
  );
});

test("does not depend on the parent menu item type", () => {
  const collectionMenu = menuItem({
    title: "Shop by concern",
    to: "/collections",
    items: [
      menuItem({
        resource: { __typename: "Collection", image },
      }),
    ],
  });

  assert.equal(isCollectionCardMenu(collectionMenu), true);
  assert.equal(isCollectionMenu(collectionMenu), true);
});

test("keeps non-collection image menus available to the image-card fallback", () => {
  const imageMenu = menuItem({
    title: "Featured",
    items: [
      menuItem({
        resource: { __typename: "Product", image },
      }),
    ],
  });

  assert.equal(isCollectionCardMenu(imageMenu), false);
  assert.equal(isImageCardMenu(imageMenu), true);
});

test("requires every image card to be a leaf item", () => {
  const nestedImageMenu = menuItem({
    items: [
      menuItem({
        resource: { __typename: "Product", image },
        items: [menuItem()],
      }),
    ],
  });

  assert.equal(isImageCardMenu(nestedImageMenu), false);
});

test("requires every collection card to have an image", () => {
  assert.equal(
    isCollectionCardMenu(
      menuItem({
        title: "Collections",
        items: [
          menuItem({
            resource: { __typename: "Collection" },
          }),
        ],
      }),
    ),
    false,
  );
});

test("requires every collection card to be a leaf item", () => {
  assert.equal(
    isCollectionCardMenu(
      menuItem({
        title: "Collections",
        items: [
          menuItem({
            resource: { __typename: "Collection", image },
            items: [menuItem()],
          }),
        ],
      }),
    ),
    false,
  );
});

test("handles menu items whose children are absent at runtime", () => {
  assert.equal(isCollectionCardMenu({}), false);
  assert.equal(isImageCardMenu({}), false);
});

test("classifies menu layouts from shared resource and nesting rules", () => {
  const collectionCard = menuItem({
    items: [menuItem({ resource: { __typename: "Collection", image } })],
  });
  const collection = menuItem({
    items: [
      menuItem({
        resource: { __typename: "Collection", image },
        items: [menuItem({ resource: { __typename: "Product" } })],
      }),
    ],
  });
  const imageCard = menuItem({
    items: [menuItem({ resource: { __typename: "Product", image } })],
  });
  const journal = menuItem({
    items: [
      menuItem({
        resource: { __typename: "Blog" },
        items: [menuItem({ resource: { __typename: "Article", image } })],
      }),
    ],
  });
  const dropdown = menuItem({ items: [menuItem()] });
  const multi = menuItem({
    items: [menuItem({ items: [menuItem()] })],
  });

  assert.equal(getMenuLayout(menuItem()), "link");
  assert.equal(getMenuLayout(journal), "journal");
  assert.equal(getMenuLayout(collectionCard), "collection-card");
  assert.equal(getMenuLayout(collection), "collection");
  assert.equal(getMenuLayout(imageCard), "image-card");
  assert.equal(getMenuLayout(dropdown), "dropdown");
  assert.equal(getMenuLayout(multi), "multi");
});

test("keeps mixed nested resources in the generic multi layout", () => {
  const mixedMenu = menuItem({
    items: [
      menuItem({
        resource: { __typename: "Collection" },
        items: [menuItem()],
      }),
      menuItem({
        resource: { __typename: "Page" },
        items: [menuItem()],
      }),
    ],
  });

  assert.equal(isCollectionMenu(mixedMenu), false);
  assert.equal(getMenuLayout(mixedMenu), "multi");
});
