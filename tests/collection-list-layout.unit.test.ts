import assert from "node:assert/strict";
import test from "node:test";
import {
  getCollectionCardStyle,
  getCollectionListLayoutClasses,
} from "../app/sections/collection-list/layout.ts";

test("applies the Figma container spacing to fixed width", () => {
  const expected = {
    sectionClassName: "lg:px-6",
    containerClassName: "lg:max-w-[calc(var(--page-width,1440px)_-_3rem)]",
  };

  assert.deepEqual(getCollectionListLayoutClasses(undefined), expected);
  assert.deepEqual(getCollectionListLayoutClasses("fixed"), expected);
});

test("preserves the native full and stretch width layouts", () => {
  const expected = {
    sectionClassName: undefined,
    containerClassName: undefined,
  };

  assert.deepEqual(getCollectionListLayoutClasses("full"), expected);
  assert.deepEqual(getCollectionListLayoutClasses("stretch"), expected);
});

test("uses the Figma collection card colors by default", () => {
  assert.deepEqual(getCollectionCardStyle({}), {
    "--collection-card-overlay": "color-mix(in srgb, #453830 30%, transparent)",
    "--collection-card-overlay-hover":
      "color-mix(in srgb, #453830 50%, transparent)",
  });
});

test("creates collection card colors from section settings", () => {
  assert.deepEqual(
    getCollectionCardStyle({
      overlayColor: "#000000",
      overlayOpacity: 90,
    }),
    {
      "--collection-card-overlay":
        "color-mix(in srgb, #000000 90%, transparent)",
      "--collection-card-overlay-hover":
        "color-mix(in srgb, #000000 100%, transparent)",
    },
  );
});
