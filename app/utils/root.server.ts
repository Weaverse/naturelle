import { getShopAnalytics } from "@shopify/hydrogen";
import type { AppLoadContext, LoaderFunctionArgs } from "react-router";
import invariant from "tiny-invariant";
import { seoPayload } from "~/.server/seo";
import { POLICIES_QUERY } from "~/routes/($locale).policies._index";
import { parseMenu } from "~/utils/menu";

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
    getSwatchesConfigs(context),
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
      withPrivacyBanner: false,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    selectedLocale: storefront.i18n,
    weaverseTheme,
    googleGtmID: context.env.PUBLIC_GOOGLE_GTM_ID,
    swatchesConfigs,
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
  const [layoutData, policiesData] = await Promise.all([
    storefront.query(LAYOUT_QUERY, {
      variables: {
        headerMenuHandle: "main-menu",
        footerMenuHandle: "footer",
        language: storefront.i18n.language,
      },
      cache: storefront.CacheLong(),
    }),
    storefront.query(POLICIES_QUERY, {
      variables: {
        language: storefront.i18n.language,
      },
    }),
  ]);

  invariant(layoutData && policiesData, "No data returned from Shopify API");

  const customPrefixes = { CATALOG: "products" };

  const parsedHeaderMenu = layoutData?.headerMenu
    ? parseMenu(
        layoutData.headerMenu,
        layoutData.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;
  const headerMenu = parsedHeaderMenu
    ? {
        ...parsedHeaderMenu,
        journalBlogs: layoutData.journalBlogs.nodes,
      }
    : undefined;

  const footerMenu = layoutData?.footerMenu
    ? parseMenu(
        layoutData.footerMenu,
        layoutData.shop.primaryDomain.url,
        env,
        customPrefixes,
      )
    : undefined;

  return {
    shop: {
      ...layoutData.shop,
      ...policiesData.shop,
    },
    headerMenu,
    footerMenu,
  };
}

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
  const { metaobjects } = await context.storefront.query(SWATCHES_QUERY, {
    variables: { type },
  });
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
      ...FooterMenu
    }
    journalBlogs: blogs(first: 5) {
      nodes {
        id
        title
        handle
        articles(first: 6, sortKey: PUBLISHED_AT, reverse: true) {
          nodes {
            id
            title
            handle
            image {
              altText
              height
              url
              width
            }
          }
        }
      }
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
      __typename
      ... on Collection {
        title
        products(first: 5) {
          nodes {
            id
            title
            handle
          }
        }
        image {
          altText
          height
          url
          width
        }
      }
      ... on Product {
        title
        description
        image: featuredImage {
          altText
          height
          url
          width
        }
        collections(first: 1) {
          nodes {
            title
          }
        }
      }
      ... on Blog {
        title
        handle
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

  fragment FooterMenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment FooterChildMenuItem on MenuItem {
    ...FooterMenuItem
  }
  fragment FooterParentMenuItem2 on MenuItem {
    ...FooterMenuItem
    items {
      ...FooterChildMenuItem
    }
  }
  fragment FooterParentMenuItem on MenuItem {
    ...FooterMenuItem
    items {
      ...FooterParentMenuItem2
    }
  }
  fragment FooterMenu on Menu {
    id
    items {
      ...FooterParentMenuItem
    }
  }
` as const;

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
