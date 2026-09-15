const KLAVIYO_REVISION = "2024-10-15";
const KLAVIYO_BACK_IN_STOCK_API =
  "https://a.klaviyo.com/api/back-in-stock-subscriptions";
const KLAVIYO_PROFILES_API = "https://a.klaviyo.com/api/profiles";

export const KLAVIYO_GENERIC_ERROR = "Something went wrong! Please try again.";
export const KLAVIYO_INVALID_EMAIL_ERROR =
  "Please enter a valid email address.";

type KlaviyoErrorPayload = {
  errors?: { code?: string; status?: number; detail?: string }[];
};

export function hasKlaviyoErrorCode(
  payload: KlaviyoErrorPayload,
  code: string,
) {
  return Boolean(payload.errors?.some((error) => error.code === code));
}

export async function readKlaviyoErrorPayload(
  response: Response,
): Promise<KlaviyoErrorPayload> {
  try {
    return (await response.json()) as KlaviyoErrorPayload;
  } catch {
    return {};
  }
}

export async function createKlaviyoBackInStockSubscription({
  apiToken,
  email,
  variantId,
}: {
  apiToken: string;
  email: string;
  variantId: string;
}) {
  return fetch(KLAVIYO_BACK_IN_STOCK_API, {
    method: "POST",
    headers: {
      accept: "application/vnd.api+json",
      revision: KLAVIYO_REVISION,
      "content-type": "application/vnd.api+json",
      Authorization: `Klaviyo-API-Key ${apiToken}`,
    },
    body: JSON.stringify({
      data: {
        type: "back-in-stock-subscription",
        attributes: {
          channels: ["EMAIL"],
          profile: { data: { type: "profile", attributes: { email } } },
        },
        relationships: {
          variant: {
            data: {
              type: "catalog-variant",
              id: `$shopify:::$default:::${variantId}`,
            },
          },
        },
      },
    }),
  });
}

export async function createKlaviyoProfile({
  apiToken,
  email,
}: {
  apiToken: string;
  email: string;
}) {
  return fetch(KLAVIYO_PROFILES_API, {
    method: "POST",
    headers: {
      accept: "application/vnd.api+json",
      revision: KLAVIYO_REVISION,
      "content-type": "application/vnd.api+json",
      Authorization: `Klaviyo-API-Key ${apiToken}`,
    },
    body: JSON.stringify({
      data: {
        type: "profile",
        attributes: { email },
      },
    }),
  });
}
