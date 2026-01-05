import { getShopAnalytics } from "@shopify/hydrogen";
import type { AppLoadContext, LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { parseMenu } from "~/lib/utils";
import { seoPayload } from "~/lib/seo.server";

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
export async function loadCriticalData({
  request,
  context,
}: LoaderFunctionArgs) {
  const [layout, swatchesConfigs, weaverseTheme] = await Promise.all([
    getLayoutData(context),
    getSwatchesConfigs(context), // ✅ NEW: From Pilot
    context.weaverse.loadThemeSettings(),
  ]);

  const seo = seoPayload.root({ shop: layout.shop, url: request.url });

  const { storefront, env } = context;

  return {
    layout,
    seo,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    selectedLocale: storefront.i18n,
    weaverseTheme,
    googleGtmID: context.env.PUBLIC_GOOGLE_GTM_ID,
    swatchesConfigs, // ✅ NEW: Return swatches
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
export function loadDeferredData({ context }: LoaderFunctionArgs) {
  const { cart, customerAccount } = context;

  return {
    isLoggedIn: customerAccount.isLoggedIn(),
    cart: cart.get(),
  };
}

async function getLayoutData({ storefront, env }: AppLoadContext) {
  const data = await storefront.query(LAYOUT_QUERY, {
    variables: {
      headerMenuHandle: "main-menu",
      footerMenuHandle: "footer",
      language: storefront.i18n.language,
    },
  });

  invariant(data, "No data returned from Shopify API");

  /*
      Modify specific links/routes (optional)
      @see: https://shopify.dev/api/storefront/unstable/enums/MenuItemType
      e.g here we map:
        - /blogs/news -> /news
        - /blog/news/blog-post -> /news/blog-post
        - /collections/all -> /products
    */
  const customPrefixes = { CATALOG: "products" };

  const headerMenu = data?.headerMenu
    ? parseMenu(
      data.headerMenu,
      data.shop.primaryDomain.url,
      env,
      customPrefixes,
    )
    : undefined;

  const footerMenu = data?.footerMenu
    ? parseMenu(
      data.footerMenu,
      data.shop.primaryDomain.url,
      env,
      customPrefixes,
    )
    : undefined;

  return { shop: data.shop, headerMenu, footerMenu };
}

// ✅ NEW: Swatches configuration loading from Pilot
type Swatch = {
  id: string;
  name: string;
  value: string;
};

async function getSwatchesConfigs(context: AppLoadContext) {
  const { METAOBJECT_COLORS_TYPE: type } = context.env;
  if (!type) {
    return { colors: [], images: [] };
  }

  try {
    const { metaobjects } = await context.storefront.query(
      SWATCHES_QUERY,
      { variables: { type } },
    );

    const colors: Swatch[] = [];
    const images: Swatch[] = [];

    for (const { id, fields } of metaobjects.nodes) {
      const { value: color } = fields.find(({ key }) => key === "color") || {};
      const { reference: imageRef } =
        fields.find(({ key }) => key === "image") || {};
      const { value: name } = fields.find(({ key }) => key === "label") || {};

      if (imageRef) {
        const url = imageRef?.image?.url;
        if (url) {
          images.push({ id, name, value: url });
        }
      } else if (color) {
        colors.push({ id, name, value: color });
      }
    }

    return { colors, images };
  } catch (error) {
    console.error("Error loading swatches:", error);
    return { colors: [], images: [] };
  }
}

const LAYOUT_QUERY = `#graphql
  query layout(
    $language: LanguageCode
    $headerMenuHandle: String!
    $footerMenuHandle: String!
  ) @inContext(language: $language) {
    shop {
      ...Shop
    }
    headerMenu: menu(handle: $headerMenuHandle) {
      ...Menu
    }
    footerMenu: menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  fragment MenuItem on MenuItem {
    id
    resourceId
    resource {
      ... on Collection {
        image {
          altText
          height
          id
          url
          width
        }
      }
      ... on Product {
        image: featuredImage {
          altText
          height
          id
          url
          width
        }
      }
    }
    tags
    title
    type
    url
  }

  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem2 on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ParentMenuItem2
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

// ✅ NEW: Swatches GraphQL query from Pilot
const SWATCHES_QUERY = `#graphql
  query swatches($type: String!) {
    metaobjects(first: 250, type: $type) {
      nodes {
        id
        fields {
          key
          value
          reference {
            ... on MediaImage {
              image {
                id
                altText
                url: url(transform: { maxWidth: 300 })
                width
                height
              }
            }
          }
        }
      }
    }
  }
` as const;
