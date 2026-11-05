import assert from "node:assert/strict";
import test from "node:test";
import { IMAGES_PLACEHOLDERS } from "@weaverse/hydrogen";
import {
  sectionImage,
  sectionImageSource,
} from "../app/utils/section-placeholder.ts";

test("empty section images resolve to official placeholders", () => {
  for (const empty of [undefined, null, "", "  ", {}, { url: "" }]) {
    assert.equal(sectionImage(empty).url, IMAGES_PLACEHOLDERS.image);
  }
  assert.equal(
    sectionImageSource(undefined, IMAGES_PLACEHOLDERS.banner_1),
    IMAGES_PLACEHOLDERS.banner_1,
  );
});

test("merchant-selected section images are preserved", () => {
  const selected = {
    id: "merchant-image",
    url: "https://merchant.example/custom.jpg",
    altText: "Merchant image",
    width: 1200,
    height: 800,
  };

  assert.deepEqual(sectionImage(selected), selected);
  assert.equal(sectionImageSource(selected.url), selected.url);
});
