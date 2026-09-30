import assert from "node:assert/strict";
import test from "node:test";
import type { ShouldRevalidateFunctionArgs } from "react-router";
import { skipRevalidationForCartActions } from "../app/utils/revalidation.ts";

function args(
  overrides: Partial<ShouldRevalidateFunctionArgs> = {},
): ShouldRevalidateFunctionArgs {
  return {
    actionResult: undefined,
    currentParams: {},
    currentUrl: new URL("https://example.com/en-us/products/serum"),
    defaultShouldRevalidate: true,
    formAction: undefined,
    formData: undefined,
    formEncType: undefined,
    formMethod: undefined,
    json: undefined,
    nextParams: {},
    nextUrl: new URL("https://example.com/en-us/products/serum"),
    text: undefined,
    ...overrides,
  };
}

test("skips page revalidation after cart mutations", () => {
  assert.equal(
    skipRevalidationForCartActions(
      args({ formAction: "/en-us/cart", formMethod: "POST" }),
    ),
    false,
  );
});

test("revalidates when the locale route changes", () => {
  assert.equal(
    skipRevalidationForCartActions(
      args({
        formAction: "/en-us/cart",
        formMethod: "POST",
        nextUrl: new URL("https://example.com/vi-us/products/serum"),
      }),
    ),
    true,
  );
});

test("preserves React Router's default for unrelated actions", () => {
  assert.equal(
    skipRevalidationForCartActions(
      args({
        defaultShouldRevalidate: false,
        formAction: "/en-us/account/profile",
        formMethod: "POST",
      }),
    ),
    false,
  );
});
