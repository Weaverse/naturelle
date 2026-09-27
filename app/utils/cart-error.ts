type CartError = { message?: string };

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
  data: { warnings?: CartError[] } | null | undefined,
) {
  return data?.warnings?.find((warning) => warning.message)?.message ?? null;
}
