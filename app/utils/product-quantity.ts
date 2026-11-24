const SHOPIFY_GRAPHQL_INT_MAX = 2_147_483_647;

export function getProductQuantityMax(
  quantityAvailable?: number | null,
): number | undefined {
  if (
    typeof quantityAvailable !== "number" ||
    !Number.isFinite(quantityAvailable) ||
    quantityAvailable < 1
  ) {
    return undefined;
  }

  return Math.min(Math.trunc(quantityAvailable), SHOPIFY_GRAPHQL_INT_MAX);
}

export function clampProductQuantity(
  quantity: number,
  quantityAvailable?: number | null,
): number {
  const normalizedQuantity = Number.isFinite(quantity)
    ? Math.min(Math.max(1, Math.trunc(quantity)), SHOPIFY_GRAPHQL_INT_MAX)
    : 1;
  const maxQuantity = getProductQuantityMax(quantityAvailable);

  return maxQuantity === undefined
    ? normalizedQuantity
    : Math.min(normalizedQuantity, maxQuantity);
}
