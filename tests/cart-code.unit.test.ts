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
    appliedGiftCards: Array<{ id: string }>;
  };
  errors: Array<{ message: string }>;
  userErrors: Array<{ message: string }>;
};

function result({
  discountCodes = [],
  appliedGiftCards = [],
  userErrors = [],
}: {
  discountCodes?: TestResult["cart"]["discountCodes"];
  appliedGiftCards?: TestResult["cart"]["appliedGiftCards"];
  userErrors?: TestResult["userErrors"];
} = {}): TestResult {
  return {
    cart: { discountCodes, appliedGiftCards },
    errors: [],
    userErrors,
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

test("returns a shared invalid result after both code types are rejected", async () => {
  const calls: string[] = [];
  const cart = {
    async get() {
      return { discountCodes: [], appliedGiftCards: [] };
    },
    async updateDiscountCodes(codes: string[]) {
      calls.push(`discount:${codes.join(",")}`);
      return result({
        discountCodes: codes.map((code) => ({ code, applicable: false })),
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
  assert.deepEqual(calls, [
    "gift-card:INVALID",
    "discount:INVALID",
    "discount:",
  ]);
});
