import assert from "node:assert/strict";
import test from "node:test";
import {
  clampProductQuantity,
  getProductQuantityMax,
} from "../app/utils/product-quantity.ts";

test("uses a positive available quantity as the stock limit", () => {
  assert.equal(getProductQuantityMax(5), 5);
  assert.equal(getProductQuantityMax(null), undefined);
  assert.equal(getProductQuantityMax(-1), undefined);
});

test("keeps quantity between one and the available stock", () => {
  assert.equal(clampProductQuantity(0, 5), 1);
  assert.equal(clampProductQuantity(3, 5), 3);
  assert.equal(clampProductQuantity(8, 5), 5);
});

test("normalizes invalid and decimal quantities", () => {
  assert.equal(clampProductQuantity(Number.NaN, 5), 1);
  assert.equal(clampProductQuantity(3.8, 5), 3);
});

test("does not impose a limit when inventory is not tracked", () => {
  assert.equal(clampProductQuantity(12, null), 12);
  assert.equal(clampProductQuantity(12, -1), 12);
});

test("keeps quantities within Shopify's GraphQL Int range", () => {
  assert.equal(clampProductQuantity(2_147_483_648, null), 2_147_483_647);
  assert.equal(getProductQuantityMax(2_147_483_648), 2_147_483_647);
});
