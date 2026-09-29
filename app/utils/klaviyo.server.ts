export const KLAVIYO_REVISION = "2026-07-15";
const KLAVIYO_REQUEST_TIMEOUT_MS = 5000;
const KLAVIYO_BACK_IN_STOCK_API =
  "https://a.klaviyo.com/api/back-in-stock-subscriptions";
const KLAVIYO_PROFILE_SUBSCRIPTIONS_API =
  "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/";

export const KLAVIYO_GENERIC_ERROR = "Something went wrong! Please try again.";
export const KLAVIYO_INVALID_EMAIL_ERROR =
  "Please enter a valid email address.";
export const KLAVIYO_VARIANT_NOT_FOUND_ERROR =
  "This product isn't available for restock alerts yet. Please try again later.";

type KlaviyoErrorPayload = {
  errors?: { code?: string; status?: number; detail?: string }[];
};

const KLAVIYO_LOGGABLE_ERROR_CODES = new Set([
  "already_subscribed",
  "duplicate",
  "duplicate_profile",
  "invalid_email",
  "variant_not_found",
]);

export function hasKlaviyoErrorCode(
  payload: KlaviyoErrorPayload,
  code: string,
) {
  return Boolean(payload.errors?.some((error) => error.code === code));
}

export function getKlaviyoUserError(
  payload: KlaviyoErrorPayload,
  context: "newsletter" | "back-in-stock",
) {
  if (hasKlaviyoErrorCode(payload, "invalid_email")) {
    return KLAVIYO_INVALID_EMAIL_ERROR;
  }
  if (
    context === "back-in-stock" &&
    hasKlaviyoErrorCode(payload, "variant_not_found")
  ) {
    return KLAVIYO_VARIANT_NOT_FOUND_ERROR;
  }
  return KLAVIYO_GENERIC_ERROR;
}

export function getKlaviyoErrorLogContext(
  response: Response,
  payload: KlaviyoErrorPayload,
) {
  const rawRequestId =
    response.headers.get("x-klaviyo-request-id") ??
    response.headers.get("x-request-id");
  const requestId =
    rawRequestId && /^[a-zA-Z0-9._:-]{1,128}$/.test(rawRequestId)
      ? rawRequestId
      : null;
  const errorCodes = [
    ...new Set(
      payload.errors
        ?.map(({ code }) => code)
        .filter(
          (code): code is string =>
            typeof code === "string" && KLAVIYO_LOGGABLE_ERROR_CODES.has(code),
        ) ?? [],
    ),
  ];

  return { status: response.status, requestId, errorCodes };
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
    signal: AbortSignal.timeout(KLAVIYO_REQUEST_TIMEOUT_MS),
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

export async function subscribeKlaviyoProfile({
  apiToken,
  email,
  listId,
}: {
  apiToken: string;
  email: string;
  listId: string;
}) {
  return fetch(KLAVIYO_PROFILE_SUBSCRIPTIONS_API, {
    method: "POST",
    signal: AbortSignal.timeout(KLAVIYO_REQUEST_TIMEOUT_MS),
    headers: {
      accept: "application/vnd.api+json",
      revision: KLAVIYO_REVISION,
      "content-type": "application/vnd.api+json",
      Authorization: `Klaviyo-API-Key ${apiToken}`,
    },
    body: JSON.stringify({
      data: {
        type: "profile-subscription-bulk-create-job",
        attributes: {
          custom_source: "Newsletter form",
          profiles: {
            data: [
              {
                type: "profile",
                attributes: {
                  email,
                  subscriptions: {
                    email: {
                      marketing: { consent: "SUBSCRIBED" },
                    },
                  },
                },
              },
            ],
          },
        },
        relationships: {
          list: {
            data: { type: "list", id: listId },
          },
        },
      },
    }),
  });
}
