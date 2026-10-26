import assert from "node:assert/strict";
import test from "node:test";
import { getCartQuantityWarning } from "../app/utils/cart-error.ts";

test("uses the short purchase-limit message for insufficient stock", () => {
  assert.equal(
    getCartQuantityWarning(
      {
        warnings: [
          {
            code: "MERCHANDISE_NOT_ENOUGH_STOCK",
            message:
              "Only 2 items were added to your cart due to availability.",
          },
        ],
      },
      "Out of purchase limit",
    ),
    "Out of purchase limit",
  );
});

test("preserves Shopify messages for other quantity warnings", () => {
  assert.equal(
    getCartQuantityWarning(
      {
        warnings: [
          {
            code: "MERCHANDISE_OUT_OF_STOCK",
            message: "This merchandise is out of stock.",
          },
        ],
      },
      "Out of purchase limit",
    ),
    "This merchandise is out of stock.",
  );
});
