import { useRouteLoaderData } from "react-router";
import type { RootLoader } from "~/root";

// Try to import from both locations for compatibility
type EnhancedMenu = any; // Temporary fallback

export function useShopMenu() {
  let data = useRouteLoaderData<RootLoader>("root");
  let layout = data?.layout;
  let shopName = layout?.shop?.name;
  let headerMenu = layout?.headerMenu as EnhancedMenu;
  let footerMenu = layout?.footerMenu as EnhancedMenu;
  return {
    shopName,
    headerMenu,
    footerMenu,
  };
}
