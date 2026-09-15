import assert from "node:assert/strict";
import test from "node:test";
import type { SellingPlan } from "../app/utils/selling-plan.ts";
import {
  calculateSellingPlanPrice,
  getSellingPlanDiscount,
} from "../app/utils/selling-plan.ts";

const price = { amount: "100", currencyCode: "USD" as const };

function plan(adjustmentValue: unknown): SellingPlan {
  return {
    id: "gid://shopify/SellingPlan/1",
    name: "Subscribe",
    description: null,
    options: [],
    recurringDeliveries: true,
    priceAdjustments: [{ adjustmentValue }],
  } as SellingPlan;
}

test("calculates a percentage subscription discount", () => {
  const sellingPlan = plan({ adjustmentPercentage: 15 });

  assert.deepEqual(calculateSellingPlanPrice(price, sellingPlan), {
    amount: "85",
    currencyCode: "USD",
  });
  assert.equal(getSellingPlanDiscount(sellingPlan), "Save 15%");
});

test("calculates a fixed amount subscription discount without going negative", () => {
  const sellingPlan = plan({
    adjustmentAmount: { amount: "125", currencyCode: "USD" },
  });

  assert.deepEqual(calculateSellingPlanPrice(price, sellingPlan), {
    amount: "0",
    currencyCode: "USD",
  });
  assert.equal(getSellingPlanDiscount(sellingPlan), "Save USD 125");
});

test("uses the fixed selling plan price", () => {
  const sellingPlan = plan({
    price: { amount: "72.5", currencyCode: "USD" },
  });

  assert.deepEqual(calculateSellingPlanPrice(price, sellingPlan), {
    amount: "72.5",
    currencyCode: "USD",
  });
});

test("keeps the product price for a one-time purchase", () => {
  assert.equal(calculateSellingPlanPrice(price, null), price);
});
