type CartError = { message?: string };
type CartUserError = CartError & {
  code?: string | null;
  field?: string[] | null;
};
type CartWarning = CartError & { code?: string };

export function getCartMutationError(
  data:
    | {
        errors?: CartError[];
        userErrors?: CartError[];
      }
    | null
    | undefined,
) {
  return (
    data?.userErrors?.find((error) => error.message)?.message ??
    data?.errors?.find((error) => error.message)?.message ??
    null
  );
}

function isCartQuantityUserError(error: CartUserError) {
  const field = error.field?.map((segment) => segment.toLowerCase()) ?? [];
  if (field.length === 0) {
    // Field-less errors describe the whole update (for example,
    // SERVICE_UNAVAILABLE) or cannot be safely attributed elsewhere.
    return true;
  }
  return field.some(
    (segment) =>
      segment === "cartid" ||
      segment === "lines" ||
      segment === "lineids" ||
      segment === "quantity",
  );
}

export function getCartQuantityError(
  data:
    | {
        errors?: CartError[];
        userErrors?: CartUserError[];
      }
    | null
    | undefined,
) {
  return (
    data?.userErrors?.find(
      (error) => error.message && isCartQuantityUserError(error),
    )?.message ??
    data?.errors?.find((error) => error.message)?.message ??
    null
  );
}

export function getCartMutationWarning(
  data: { warnings?: CartWarning[] } | null | undefined,
) {
  return data?.warnings?.find((warning) => warning.message)?.message ?? null;
}

export function getCartQuantityWarning(
  data: { warnings?: CartWarning[] } | null | undefined,
  purchaseLimitMessage: string,
) {
  const warning = data?.warnings?.find(
    (item) => item.message && !item.code?.startsWith("DISCOUNT_"),
  );
  if (!warning) {
    return null;
  }
  return warning.code === "MERCHANDISE_NOT_ENOUGH_STOCK"
    ? purchaseLimitMessage
    : warning.message;
}
