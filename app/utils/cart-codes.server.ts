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
    appliedGiftCards?: Array<{ id: string }>;
  } | null;
};

type CartCodeCart<Result extends CartCodeResult> = {
  get(): Promise<{
    discountCodes?: Array<{ code: string }>;
    appliedGiftCards?: Array<{ id: string }>;
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
    const previousGiftCardIds = new Set(
      (previousCart?.appliedGiftCards ?? []).map((card) => card.id),
    );
    const giftCardResult = await cart.addGiftCardCodes([
      normalizeGiftCardCode(rawCode),
    ]);
    const codeApplied = Boolean(
      !hasCartCodeErrors(giftCardResult) &&
        giftCardResult.cart?.appliedGiftCards?.some(
          (card) => !previousGiftCardIds.has(card.id),
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
  const isNewProbe = !previousDiscountCodes.some(
    (discount) => discount.code.toLowerCase() === discountCode.toLowerCase(),
  );

  if (
    options.allowGiftCard &&
    !hasCartCodeErrors(discountResult) &&
    !codeApplied &&
    isNewProbe &&
    discountResult.cart?.discountCodes?.some(
      (discount) => discount.code.toLowerCase() === discountCode.toLowerCase(),
    )
  ) {
    const remainingCodes = discountResult.cart.discountCodes
      .filter(
        (discount) =>
          discount.code.toLowerCase() !== discountCode.toLowerCase(),
      )
      .map((discount) => discount.code);
    return {
      ...(await cart.updateDiscountCodes(remainingCodes)),
      codeType: "discount",
      codeApplied: false,
    };
  }

  return { ...discountResult, codeType: "discount", codeApplied };
}
