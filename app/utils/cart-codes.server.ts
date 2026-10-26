import {
  mergeCartCodes,
  normalizeDiscountCode,
  normalizeGiftCardCode,
} from "./cart-code.ts";

type CartCodeResult = {
  errors?: unknown;
  userErrors?: unknown[];
  cart?: {
    discountCodes?: Array<{ code: string; applicable: boolean }>;
    appliedGiftCards?: Array<{ id: string; lastCharacters?: string }>;
  } | null;
};

type CartCodeCart<Result extends CartCodeResult> = {
  get(): Promise<{
    discountCodes?: Array<{ code: string }>;
    appliedGiftCards?: Array<{ id: string; lastCharacters?: string }>;
  } | null>;
  updateDiscountCodes(codes: string[]): Promise<Result>;
  addGiftCardCodes(codes: string[]): Promise<Result>;
};

function hasCartApiErrors(result: CartCodeResult) {
  return Array.isArray(result.errors)
    ? result.errors.length > 0
    : Boolean(result.errors);
}

function hasCartCodeErrors(result: CartCodeResult) {
  return hasCartApiErrors(result) || Boolean(result.userErrors?.length);
}

export async function applyCartCode<Result extends CartCodeResult>(
  cart: CartCodeCart<Result>,
  rawCode: string,
  options: { allowDiscountCode: boolean; allowGiftCard: boolean },
): Promise<
  Result & { codeType: "discount" | "gift-card"; codeApplied: boolean }
> {
  const discountCode = normalizeDiscountCode(rawCode);
  const previousCart = await cart.get();
  const previousDiscountCodes = previousCart?.discountCodes ?? [];

  if (options.allowGiftCard) {
    const giftCardCode = normalizeGiftCardCode(rawCode);
    const previousGiftCards = previousCart?.appliedGiftCards ?? [];
    const previousGiftCardIds = new Set(
      previousGiftCards.map((card) => card.id),
    );
    const matchingPreviousGiftCardIds = new Set(
      previousGiftCards
        .filter(
          (card) =>
            card.lastCharacters &&
            giftCardCode
              .toLowerCase()
              .endsWith(card.lastCharacters.toLowerCase()),
        )
        .map((card) => card.id),
    );
    const giftCardResult = await cart.addGiftCardCodes([giftCardCode]);
    const codeApplied = Boolean(
      !hasCartCodeErrors(giftCardResult) &&
        giftCardResult.cart?.appliedGiftCards?.some(
          (card) =>
            !previousGiftCardIds.has(card.id) ||
            matchingPreviousGiftCardIds.has(card.id),
        ),
    );

    if (
      codeApplied ||
      hasCartApiErrors(giftCardResult) ||
      !options.allowDiscountCode
    ) {
      return { ...giftCardResult, codeType: "gift-card", codeApplied };
    }
  }

  if (!options.allowDiscountCode) {
    throw new Error("No cart code type is enabled");
  }

  const discountResult = await cart.updateDiscountCodes(
    mergeCartCodes(
      previousDiscountCodes.map((discount) => discount.code),
      discountCode,
    ),
  );
  const codeApplied = Boolean(
    !hasCartCodeErrors(discountResult) &&
      discountResult.cart?.discountCodes?.some(
        (discount) =>
          discount.applicable &&
          discount.code.toLowerCase() === discountCode.toLowerCase(),
      ),
  );

  return { ...discountResult, codeType: "discount", codeApplied };
}
