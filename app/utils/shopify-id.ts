export function shopifyNumericId(gid?: string | null) {
  if (!gid) {
    return "";
  }
  const lastSegment = gid.split("/").at(-1)?.trim() ?? "";
  return /^\d+$/.test(lastSegment) ? lastSegment : "";
}
