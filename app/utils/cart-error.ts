type CartError = { message?: string };
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
