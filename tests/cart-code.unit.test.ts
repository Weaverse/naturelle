import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeDiscountCode,
  normalizeGiftCardCode,
} from "../app/utils/cart-code.ts";
import { applyCartCode } from "../app/utils/cart-codes.server.ts";

type TestResult = {
  cart: {
    discountCodes: Array<{ code: string; applicable: boolean }>;
    appliedGiftCards: Array<{ id: string; lastCharacters?: string }>;
  };
  errors: Array<{ message: string }>;
  userErrors: Array<{ message: string }>;
  warnings: Array<{ code: string; message: string }>;
};

function result({
  discountCodes = [],
  appliedGiftCards = [],
  userErrors = [],
  warnings = [],
}: {
  discountCodes?: TestResult["cart"]["discountCodes"];
  appliedGiftCards?: TestResult["cart"]["appliedGiftCards"];
  userErrors?: TestResult["userErrors"];
  warnings?: TestResult["warnings"];
} = {}): TestResult {
  return {
    cart: { discountCodes, appliedGiftCards },
    errors: [],
    userErrors,
    warnings,
  };
}

test("preserves discount spaces but removes gift card spaces", () => {
  assert.equal(normalizeDiscountCode(" save 20 "), "SAVE 20");
  assert.equal(normalizeGiftCardCode(" gift 123 "), "GIFT123");
});

test("tries a discount code after the gift card is rejected", async () => {
  const calls: string[] = [];
  const cart = {
    async get() {
      return { discountCodes: [], appliedGiftCards: [] };
    },
    async updateDiscountCodes(codes: string[]) {
      calls.push(`discount:${codes.join(",")}`);
      return result({
        discountCodes: codes.map((code) => ({ code, applicable: true })),
      });
    },
    async addGiftCardCodes(codes: string[]) {
      calls.push(`gift-card:${codes.join(",")}`);
      return result();
    },
  };

  const response = await applyCartCode(cart, " save 20 ", {
    allowDiscountCode: true,
    allowGiftCard: true,
  });

  assert.equal(response.codeType, "discount");
  assert.equal(response.codeApplied, true);
  assert.deepEqual(calls, ["gift-card:SAVE20", "discount:SAVE 20"]);
});

test("accepts a gift card without trying it as a discount code", async () => {
  const calls: string[] = [];
  const cart = {
    async get() {
      return {
        discountCodes: [{ code: "EXISTING" }],
        appliedGiftCards: [{ id: "old-card" }],
      };
    },
    async updateDiscountCodes(codes: string[]) {
      calls.push(`discount:${codes.join(",")}`);
      return result({
        discountCodes: codes.map((code) => ({ code, applicable: true })),
        appliedGiftCards: [{ id: "old-card" }, { id: "new-card" }],
      });
    },
    async addGiftCardCodes(codes: string[]) {
      calls.push(`gift-card:${codes.join(",")}`);
      return result({
        discountCodes: [{ code: "EXISTING", applicable: true }],
        appliedGiftCards: [{ id: "old-card" }, { id: "new-card" }],
      });
    },
  };

  const response = await applyCartCode(cart, "gift 123", {
    allowDiscountCode: true,
    allowGiftCard: true,
  });

  assert.equal(response.codeType, "gift-card");
  assert.equal(response.codeApplied, true);
  assert.deepEqual(calls, ["gift-card:GIFT123"]);
  assert.deepEqual(response.cart.discountCodes, [
    { code: "EXISTING", applicable: true },
  ]);
});

test("accepts an already-applied gift card without trying it as a discount code", async () => {
  const calls: string[] = [];
  const existingGiftCard = {
    id: "existing-card",
    lastCharacters: "1234",
  };
  const cart = {
    async get() {
      return { discountCodes: [], appliedGiftCards: [existingGiftCard] };
    },
    async updateDiscountCodes(codes: string[]) {
      calls.push(`discount:${codes.join(",")}`);
      return result({
        discountCodes: codes.map((code) => ({ code, applicable: true })),
        appliedGiftCards: [existingGiftCard],
      });
    },
    async addGiftCardCodes(codes: string[]) {
      calls.push(`gift-card:${codes.join(",")}`);
      return result({ appliedGiftCards: [existingGiftCard] });
    },
  };

  const response = await applyCartCode(cart, "gift 1234", {
    allowDiscountCode: true,
    allowGiftCard: true,
  });

  assert.equal(response.codeType, "gift-card");
  assert.equal(response.codeApplied, true);
  assert.deepEqual(calls, ["gift-card:GIFT1234"]);
});

test("preserves a discount that may become applicable", async () => {
  const calls: string[] = [];
  const cart = {
    async get() {
      return { discountCodes: [], appliedGiftCards: [] };
    },
    async updateDiscountCodes(codes: string[]) {
      calls.push(`discount:${codes.join(",")}`);
      return result({
        discountCodes: codes.map((code) => ({ code, applicable: false })),
        warnings: [
          {
            code: "DISCOUNT_PURCHASE_NOT_IN_RANGE",
            message: "The purchase amount is not in range.",
          },
        ],
      });
    },
    async addGiftCardCodes(codes: string[]) {
      calls.push(`gift-card:${codes.join(",")}`);
      return result({
        userErrors: [{ message: "Gift card is invalid" }],
      });
    },
  };

  const response = await applyCartCode(cart, "invalid", {
    allowDiscountCode: true,
    allowGiftCard: true,
  });

  assert.equal(response.codeType, "discount");
  assert.equal(response.codeApplied, false);
  assert.deepEqual(calls, ["gift-card:INVALID", "discount:INVALID"]);
  assert.deepEqual(response.cart.discountCodes, [
    { code: "INVALID", applicable: false },
  ]);
});

test("removes a discount that does not exist", async () => {
  const calls: string[] = [];
  const cart = {
    async get() {
      return {
        discountCodes: [{ code: "EXISTING" }],
        appliedGiftCards: [],
      };
    },
    async updateDiscountCodes(codes: string[]) {
      calls.push(`discount:${codes.join(",")}`);
      if (codes.includes("MISSING")) {
        return result({
          discountCodes: codes.map((code) => ({
            code,
            applicable: code === "EXISTING",
          })),
          warnings: [
            {
              code: "DISCOUNT_NOT_FOUND",
              message: "Enter a valid discount code",
            },
          ],
        });
      }
      return result({
        discountCodes: codes.map((code) => ({ code, applicable: true })),
      });
    },
    async addGiftCardCodes(codes: string[]) {
      calls.push(`gift-card:${codes.join(",")}`);
      return result({
        userErrors: [{ message: "Gift card is invalid" }],
      });
    },
  };

  const response = await applyCartCode(cart, "missing", {
    allowDiscountCode: true,
    allowGiftCard: true,
  });

  assert.equal(response.codeType, "discount");
  assert.equal(response.codeApplied, false);
  assert.deepEqual(calls, [
    "gift-card:MISSING",
    "discount:EXISTING,MISSING",
    "discount:EXISTING",
  ]);
  assert.deepEqual(response.cart.discountCodes, [
    { code: "EXISTING", applicable: true },
  ]);
  assert.equal(response.warnings[0]?.code, "DISCOUNT_NOT_FOUND");
});
