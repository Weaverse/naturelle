import assert from "node:assert/strict";
import test from "node:test";
import {
  isBrandCardMenu,
  isCollectionMenu,
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

test("identifies localized brand cards from the Shopify catalog type", () => {
  assert.equal(
    isBrandCardMenu(
      menuItem({
        title: "Thương hiệu",
        type: "CATALOG",
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

test("keeps another visual collection menu in the collection layout", () => {
  const collectionMenu = menuItem({
    title: "Shop by concern",
    type: "COLLECTIONS",
    to: "/collections",
    items: [
      menuItem({
        resource: { __typename: "Collection", image },
      }),
    ],
  });

  assert.equal(isBrandCardMenu(collectionMenu), false);
  assert.equal(isCollectionMenu(collectionMenu), true);
});

test("does not treat another image menu as brand cards", () => {
  assert.equal(
    isBrandCardMenu(
      menuItem({
        title: "Featured",
        type: "HTTP",
        items: [
          menuItem({
            resource: { __typename: "Product", image },
          }),
        ],
      }),
    ),
    false,
  );
});

test("requires every brand card to be an image-bearing leaf item", () => {
  assert.equal(
    isBrandCardMenu(
      menuItem({
        title: "Brands",
        type: "CATALOG",
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

test("handles menu items whose children are absent at runtime", () => {
  assert.equal(isBrandCardMenu({ type: "CATALOG" }), false);
});
