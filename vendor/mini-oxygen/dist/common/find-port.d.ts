/**
 *
 * Finds an available port in the range of `portPreference` to `portPreference + range`.
 * Note: do not use this utility to find a port for MiniOxygen since that will be
 * handled by MiniOxygen itself. See https://github.com/Shopify/hydrogen/issues/1264
 */
declare function findPort(portPreference: number, range?: number): Promise<number>;

export { findPort };
