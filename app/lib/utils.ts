import typographicBase from 'typographic-base';
import type { MoneyV2 } from '@shopify/hydrogen/storefront-api-types';
import {countries} from '~/data/countries';
import {useRootLoaderData} from '~/root';
import type {I18nLocale} from './type';
import type { WeaverseImage } from '@weaverse/hydrogen';
import { ChildMenuItemFragment, MenuFragment, ParentMenuItemFragment } from 'storefrontapi.generated';


type EnhancedMenuItemProps = {
  to: string;
  target: string;
  isExternal?: boolean;
};

export type ChildEnhancedMenuItem = ChildMenuItemFragment &
  EnhancedMenuItemProps;

export type ParentEnhancedMenuItem = (ParentMenuItemFragment &
  EnhancedMenuItemProps) & {
  items: ChildEnhancedMenuItem[];
};

export type EnhancedMenu = Pick<MenuFragment, "id"> & {
  items: ParentEnhancedMenuItem[];
};

export function missingClass(string?: string, prefix?: string) {
  if (!string) {
    return true;
  }

  const regex = new RegExp(` ?${prefix}`, 'g');
  return string.match(regex) === null;
}

export function formatText(input?: string | React.ReactNode) {
  if (!input) {
    return;
  }

  if (typeof input !== 'string') {
    return input;
  }

  return typographicBase(input, { locale: 'en-us' }).replace(
    /\s([^\s<]+)\s*$/g,
    '\u00A0$1',
  );
}

export function getExcerpt(text: string) {
  const regex = /<p.*>(.*?)<\/p>/;
  const match = regex.exec(text);
  return match?.length ? match[0] : text;
}

export function isNewArrival(date: string, daysOld = 30) {
  return (
    new Date(date).valueOf() >
    new Date().setDate(new Date().getDate() - daysOld).valueOf()
  );
}

export function isDiscounted(price: MoneyV2, compareAtPrice: MoneyV2) {
  if (compareAtPrice?.amount > price?.amount) {
    return true;
  }
  return false;
}

export const DEFAULT_LOCALE: I18nLocale = Object.freeze({
  ...countries.default,
  pathPrefix: '',
});

export function usePrefixPathWithLocale(path: string) {
  const rootData = useRootLoaderData();
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;

  return `${selectedLocale.pathPrefix}${
    path.startsWith('/') ? path : '/' + path
  }`;
}

export function parseAsCurrency(value: number, locale: I18nLocale) {
  return new Intl.NumberFormat(locale.language + '-' + locale.country, {
    style: 'currency',
    currency: locale.currency,
  }).format(value);
}

export function getLocaleFromRequest(request: Request): I18nLocale {
  const url = new URL(request.url);
  const firstPathPart =
    '/' + url.pathname.substring(1).split('/')[0].toLowerCase();

  return countries[firstPathPart]
    ? {
        ...countries[firstPathPart],
        pathPrefix: firstPathPart,
      }
    : {
        ...countries['default'],
        pathPrefix: '',
      };
}

export function getImageAspectRatio(
  image: Partial<WeaverseImage>,
  aspectRatio: string,
) {
  let aspRt: string | undefined;
  if (aspectRatio === "adapt") {
    if (image?.width && image?.height) {
      aspRt = `${image.width}/${image.height}`;
    }
  } else {
    aspRt = aspectRatio;
  }
  return aspRt;
}

export function parseMenu(
  menu: MenuFragment,
  primaryDomain: string,
  env: Env,
  customPrefixes = {},
): EnhancedMenu | null {
  if (!menu?.items) {
    // eslint-disable-next-line no-console
    console.warn("Invalid menu passed to parseMenu");
    return null;
  }

  const parser = parseItem(primaryDomain, env, customPrefixes);

  const parsedMenu = {
    ...menu,
    items: menu.items.map(parser).filter(Boolean),
  } as EnhancedMenu;

  return parsedMenu;
}

function parseItem(primaryDomain: string, env: Env, customPrefixes = {}) {
  return function (
    item:
      | MenuFragment["items"][number]
      | MenuFragment["items"][number]["items"][number],
  ):
    | EnhancedMenu["items"][0]
    | EnhancedMenu["items"][number]["items"][0]
    | null {
    if (!item?.url || !item?.type) {
      // eslint-disable-next-line no-console
      console.warn("Invalid menu item.  Must include a url and type.");
      return null;
    }

    // extract path from url because we don't need the origin on internal to attributes
    const { host, pathname } = new URL(item.url);

    const isInternalLink =
      host === new URL(primaryDomain).host || host === env.PUBLIC_STORE_DOMAIN;

    const parsedItem = isInternalLink
      ? // internal links
        {
          ...item,
          isExternal: false,
          target: "_self",
          to: resolveToFromType({ type: item.type, customPrefixes, pathname }),
        }
      : // external links
        {
          ...item,
          isExternal: true,
          target: "_blank",
          to: item.url,
        };

    if ("items" in item) {
      return {
        ...parsedItem,
        items: item.items
          .map(parseItem(primaryDomain, env, customPrefixes))
          .filter(Boolean),
      } as EnhancedMenu["items"][number];
    } else {
      return parsedItem as EnhancedMenu["items"][number]["items"][number];
    }
  };
}

function resolveToFromType(
  {
    customPrefixes,
    pathname,
    type,
  }: {
    customPrefixes: Record<string, string>;
    pathname?: string;
    type?: string;
  } = {
    customPrefixes: {},
  },
) {
  if (!pathname || !type) return "";

  /*
    MenuItemType enum
    @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
  */
  const defaultPrefixes = {
    BLOG: "blogs",
    COLLECTION: "collections",
    COLLECTIONS: "collections", // Collections All (not documented)
    FRONTPAGE: "frontpage",
    HTTP: "",
    PAGE: "pages",
    CATALOG: "collections/all", // Products All
    PRODUCT: "products",
    SEARCH: "search",
    SHOP_POLICY: "policies",
  };

  const pathParts = pathname.split("/");
  const handle = pathParts.pop() || "";
  const routePrefix: Record<string, string> = {
    ...defaultPrefixes,
    ...customPrefixes,
  };

  switch (true) {
    // special cases
    case type === "FRONTPAGE":
      return "/";

    case type === "ARTICLE": {
      const blogHandle = pathParts.pop();
      return routePrefix.BLOG
        ? `/${routePrefix.BLOG}/${blogHandle}/${handle}/`
        : `/${blogHandle}/${handle}/`;
    }

    case type === "COLLECTIONS":
      return `/${routePrefix.COLLECTIONS}`;

    case type === "SEARCH":
      return `/${routePrefix.SEARCH}`;

    case type === "CATALOG":
      return `/${routePrefix.CATALOG}`;

    // common cases: BLOG, PAGE, COLLECTION, PRODUCT, SHOP_POLICY, HTTP
    default:
      return routePrefix[type]
        ? `/${routePrefix[type]}/${handle}`
        : `/${handle}`;
  }
}