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

test("preserves cart-wide failures without a field", () => {
  assert.equal(
    getCartQuantityError({
      userErrors: [
        {
          code: "SERVICE_UNAVAILABLE",
          field: null,
          message: "An error occurred while saving the cart.",
        },
      ],
    }),
    "An error occurred while saving the cart.",
  );
});

test("preserves unknown field-less failures", () => {
  assert.equal(
    getCartQuantityError({
      userErrors: [
        {
          code: "FUTURE_CART_ERROR",
          message: "The cart could not be updated.",
        },
      ],
    }),
    "The cart could not be updated.",
  );
});

test("preserves errors attached to the cart id", () => {
  assert.equal(
    getCartQuantityError({
      userErrors: [
        {
          code: "INVALID",
          field: ["cartId"],
          message: "The cart could not be found.",
        },
      ],
    }),
    "The cart could not be found.",
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

test("does not show discount warnings as quantity warnings", () => {
  assert.equal(
    getCartQuantityWarning(
      {
        warnings: [
          {
            code: "DISCOUNT_NOT_FOUND",
            message: "Enter a valid discount code",
          },
        ],
      },
      "Out of purchase limit",
    ),
    null,
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
