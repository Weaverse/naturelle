type CartError = { message?: string };

export function getCartMutationError(
  data:
    | {
        errors?: CartError[];
        userErrors?: CartError[];
        warnings?: CartError[];
      }
    | null
    | undefined,
) {
  return (
    data?.userErrors?.find((error) => error.message)?.message ??
    data?.warnings?.find((warning) => warning.message)?.message ??
    data?.errors?.find((error) => error.message)?.message ??
    null
  );
}
