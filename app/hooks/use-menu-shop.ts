import { useRouteLoaderData } from "@remix-run/react";
import type { EnhancedMenu } from "~/lib/types/menu";
import type { RootLoader } from "~/root";

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
