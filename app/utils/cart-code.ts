export const CART_CODE_APPLY_ACTION = "CartCodeApply";

export function normalizeDiscountCode(code: string) {
  return code.trim().toUpperCase();
}

export function normalizeGiftCardCode(code: string) {
  return code.replace(/\s/g, "").toUpperCase();
}

export function mergeCartCodes(existingCodes: string[], code: string) {
  const normalizedCode = code.toLowerCase();
  return existingCodes.some(
    (existingCode) => existingCode.toLowerCase() === normalizedCode,
  )
    ? existingCodes
    : [...existingCodes, code];
}
