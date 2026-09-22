import type { ComponentLoaderArgs } from "@weaverse/hydrogen";
import type { ProductDetailMetafieldQuery } from "storefront-api.generated";

export interface ProductDetailEntry {
  fields: Record<string, string>;
  fieldTypes: Record<string, string>;
  id: string;
}

export type ProductDetailMetafieldStatus =
  | "ready"
  | "loading"
  | "missing-config"
  | "invalid-config"
  | "missing-product"
  | "not-found"
  | "empty"
  | "query-error";

export interface ProductDetailMetafieldLoaderData {
  entries: ProductDetailEntry[];
  identifier?: string;
  status: ProductDetailMetafieldStatus;
}

interface ProductMetafieldData {
  metafield?: string;
}

type ProductDetailStorefront =
  ComponentLoaderArgs<ProductMetafieldData>["weaverse"]["storefront"];

interface MetaobjectReference {
  fields: Array<{
    key: string;
    type: string;
    value?: string | null;
  }>;
  id: string;
}

const PRODUCT_DETAIL_METAFIELD_QUERY = `#graphql
  query ProductDetailMetafield(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
    $namespace: String!
    $key: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      metafield(namespace: $namespace, key: $key) {
        type
        value
        reference {
          ... on Metaobject {
            id
            fields {
              key
              type
              value
            }
          }
        }
        references(first: 20) {
          nodes {
            ... on Metaobject {
              id
              fields {
                key
                type
                value
              }
            }
          }
        }
      }
    }
  }
` as const;

function getProductHandle(request: Request) {
  const pathname = new URL(request.url).pathname.replace(/\.data$/, "");
  const segments = pathname.split("/").filter(Boolean);
  const productsIndex = segments.lastIndexOf("products");
  const handle = segments[productsIndex + 1];
  return productsIndex >= 0 && handle ? decodeURIComponent(handle) : null;
}

function parseMetafieldIdentifier(identifier?: string) {
  const normalizedIdentifier = identifier?.trim();
  if (!normalizedIdentifier) {
    return null;
  }

  const separatorIndex = normalizedIdentifier.indexOf(".");
  if (separatorIndex === -1) {
    const key = normalizedIdentifier
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return key ? { namespace: "custom", key } : null;
  }

  const namespace = normalizedIdentifier.slice(0, separatorIndex).trim();
  const key = normalizedIdentifier.slice(separatorIndex + 1).trim();
  if (!(namespace && key)) {
    return null;
  }

  return {
    namespace,
    key,
  };
}

function normalizeEntry(entry: MetaobjectReference): ProductDetailEntry {
  return {
    id: entry.id,
    fields: Object.fromEntries(
      entry.fields.flatMap((field) =>
        field.value ? [[field.key, field.value]] : [],
      ),
    ),
    fieldTypes: Object.fromEntries(
      entry.fields.map((field) => [field.key, field.type]),
    ),
  };
}

function normalizeMetafieldValue(
  metafield: { type: string; value: string } | null | undefined,
  id: string,
): ProductDetailEntry[] {
  if (!metafield?.value) {
    return [];
  }

  if (metafield.type.startsWith("list.")) {
    try {
      const values = JSON.parse(metafield.value);
      if (Array.isArray(values)) {
        return values.flatMap((value, index) =>
          typeof value === "string"
            ? [
                {
                  id: `${id}:${index}`,
                  fields: { content: value },
                  fieldTypes: { content: metafield.type.slice(5) },
                },
              ]
            : [],
        );
      }
    } catch {
      return [];
    }
  }

  return [
    {
      id,
      fields: { content: metafield.value },
      fieldTypes: { content: metafield.type },
    },
  ];
}

export function getProductDetailField(entry: ProductDetailEntry, key: string) {
  const value = entry.fields[key] || "";
  if (entry.fieldTypes[key] !== "rich_text_field" || !value) {
    return value;
  }

  try {
    const document = JSON.parse(value);
    const lines: string[] = [];
    const visit = (node: unknown) => {
      if (!node || typeof node !== "object") {
        return;
      }
      const richTextNode = node as {
        children?: unknown[];
        type?: string;
        value?: string;
      };
      if (richTextNode.type === "text" && richTextNode.value) {
        lines.push(richTextNode.value);
      }
      richTextNode.children?.forEach(visit);
    };
    visit(document);
    return lines.join("\n");
  } catch {
    return value;
  }
}

export async function loadProductDetailMetafield({
  data,
  weaverse,
}: ComponentLoaderArgs<ProductMetafieldData>): Promise<ProductDetailMetafieldLoaderData> {
  return queryProductDetailMetafield({
    storefront: weaverse.storefront,
    handle: getProductHandle(weaverse.request),
    metafield: data.metafield,
  });
}

export async function queryProductDetailMetafield({
  storefront,
  handle,
  metafield: configuredValue,
}: {
  storefront: ProductDetailStorefront;
  handle: string | null;
  metafield?: string;
}): Promise<ProductDetailMetafieldLoaderData> {
  const configuredMetafield = configuredValue?.trim();
  const identifier = parseMetafieldIdentifier(configuredValue);
  if (!configuredMetafield) {
    return {
      entries: [],
      status: "missing-config",
    } satisfies ProductDetailMetafieldLoaderData;
  }
  if (!identifier) {
    return {
      entries: [],
      status: "invalid-config",
    } satisfies ProductDetailMetafieldLoaderData;
  }

  const normalizedIdentifier = `${identifier.namespace}.${identifier.key}`;
  if (!handle) {
    return {
      entries: [],
      identifier: normalizedIdentifier,
      status: "missing-product",
    } satisfies ProductDetailMetafieldLoaderData;
  }

  try {
    const result = await storefront.query<ProductDetailMetafieldQuery>(
      PRODUCT_DETAIL_METAFIELD_QUERY,
      {
        variables: {
          ...identifier,
          handle,
          country: storefront.i18n.country,
          language: storefront.i18n.language,
        },
      },
    );
    const metafield = result.product?.metafield;
    if (!metafield) {
      return {
        entries: [],
        identifier: normalizedIdentifier,
        status: "not-found",
      } satisfies ProductDetailMetafieldLoaderData;
    }
    const references = metafield.references?.nodes ?? [];
    const entries = references.length
      ? references
      : metafield.reference
        ? [metafield.reference]
        : [];

    const normalizedEntries = entries.length
      ? entries.map(normalizeEntry)
      : normalizeMetafieldValue(metafield, normalizedIdentifier);

    return {
      entries: normalizedEntries,
      identifier: normalizedIdentifier,
      status: normalizedEntries.length ? "ready" : "empty",
    } satisfies ProductDetailMetafieldLoaderData;
  } catch (error) {
    console.warn("Unable to load product detail metafield", {
      error,
      handle,
      metafield: normalizedIdentifier,
    });
    return {
      entries: [],
      identifier: normalizedIdentifier,
      status: "query-error",
    } satisfies ProductDetailMetafieldLoaderData;
  }
}

export const PRODUCT_DETAIL_METAFIELDS = {
  benefits: "benefit",
  story: "productdetail",
  ingredients: "key_ingredients",
  howToUse: "howtouse",
  results: "product_result",
} as const;

export function createMetafieldInput(defaultValue: string) {
  return {
    type: "text" as const,
    name: "metafield",
    label: "Product metafield",
    defaultValue,
    placeholder: defaultValue,
    helpText:
      "Enter a metafield name or key. The custom namespace is used by default; use namespace.key for another namespace.",
  };
}
