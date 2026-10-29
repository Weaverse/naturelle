import assert from "node:assert/strict";
import test from "node:test";
import {
  getCartQuantityError,
  getCartQuantityWarning,
} from "../app/utils/cart-error.ts";

test("shows quantity errors identified by their field", () => {
  assert.equal(
    getCartQuantityError({
      userErrors: [
        {
          code: "INVALID",
          field: ["lines", "0", "quantity"],
          message: "Enter a valid quantity.",
        },
      ],
    }),
    "Enter a valid quantity.",
  );
});

test("shows quantity errors identified by their code", () => {
  assert.equal(
    getCartQuantityError({
      userErrors: [
        {
          code: "MAXIMUM_EXCEEDED",
          message: "The quantity exceeds the maximum allowed.",
        },
      ],
    }),
    "The quantity exceeds the maximum allowed.",
  );
});

test("does not show discount errors as quantity errors", () => {
  assert.equal(
    getCartQuantityError({
      userErrors: [
        {
          code: "INVALID",
          field: ["discountCodes", "0"],
          message: "Enter a valid discount code.",
        },
      ],
    }),
    null,
  );
});

test("preserves top-level API errors for quantity updates", () => {
  assert.equal(
    getCartQuantityError({
      errors: [{ message: "Unable to update cart quantity" }],
    }),
    "Unable to update cart quantity",
  );
});

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
