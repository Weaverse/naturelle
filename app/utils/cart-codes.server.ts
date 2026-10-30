import {
  mergeCartCodes,
  normalizeDiscountCode,
  normalizeGiftCardCode,
} from "./cart-code.ts";

type CartCodeResult = {
  errors?: unknown;
  userErrors?: unknown[];
  warnings?: Array<{ code?: string | null; target?: string | null }>;
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

function hasCartWarningForTarget(
  result: CartCodeResult,
  code: string,
  target: string,
) {
  const normalizedTarget = normalizeDiscountCode(target);
  return (
    result.warnings?.some(
      (warning) =>
        warning.code === code &&
        typeof warning.target === "string" &&
        normalizeDiscountCode(warning.target) === normalizedTarget,
    ) ?? false
  );
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

  const previousDiscountCodeValues = previousDiscountCodes.map(
    (discount) => discount.code,
  );
  const discountResult = await cart.updateDiscountCodes(
    mergeCartCodes(previousDiscountCodeValues, discountCode),
  );
  const submittedDiscount = discountResult.cart?.discountCodes?.find(
    (discount) => discount.code.toLowerCase() === discountCode.toLowerCase(),
  );
  const codeApplied = Boolean(
    !hasCartCodeErrors(discountResult) && submittedDiscount?.applicable,
  );

  if (
    !codeApplied &&
    !hasCartCodeErrors(discountResult) &&
    submittedDiscount &&
    !submittedDiscount.applicable &&
    hasCartWarningForTarget(discountResult, "DISCOUNT_NOT_FOUND", discountCode)
  ) {
    const cleanupResult = await cart.updateDiscountCodes(
      previousDiscountCodeValues.filter(
        (code) => code.toLowerCase() !== discountCode.toLowerCase(),
      ),
    );
    if (hasCartCodeErrors(cleanupResult)) {
      return {
        ...cleanupResult,
        codeType: "discount",
        codeApplied: false,
      };
    }
    return {
      ...discountResult,
      cart: cleanupResult.cart ?? discountResult.cart,
      codeType: "discount",
      codeApplied: false,
    };
  }

  return { ...discountResult, codeType: "discount", codeApplied };
}
