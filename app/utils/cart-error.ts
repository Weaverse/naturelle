type CartError = { message?: string };
type CartUserError = CartError & {
  code?: string | null;
  field?: string[] | null;
};
type CartWarning = CartError & { code?: string };

const CART_QUANTITY_ERROR_CODES = new Set([
  "INVALID_INCREMENT",
  "INVALID_MERCHANDISE_LINE",
  "LESS_THAN",
  "MAXIMUM_EXCEEDED",
  "MERCHANDISE_LINE_TRANSFORMERS_RUN_ERROR",
  "MERCHANDISE_NOT_APPLICABLE",
  "MINIMUM_NOT_MET",
]);

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
  if (field.length > 0) {
    return field.some(
      (segment) =>
        segment === "lines" || segment === "lineids" || segment === "quantity",
    );
  }
  return Boolean(error.code && CART_QUANTITY_ERROR_CODES.has(error.code));
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
  const warning = data?.warnings?.find((item) => item.message);
  if (!warning) {
    return null;
  }
  return warning.code === "MERCHANDISE_NOT_ENOUGH_STOCK"
    ? purchaseLimitMessage
    : warning.message;
}
