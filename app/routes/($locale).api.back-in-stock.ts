import { type ActionFunctionArgs, data } from "react-router";
import {
  createKlaviyoBackInStockSubscription,
  getKlaviyoErrorLogContext,
  getKlaviyoUserError,
  hasKlaviyoErrorCode,
  KLAVIYO_GENERIC_ERROR,
  KLAVIYO_INVALID_EMAIL_ERROR,
  KLAVIYO_VARIANT_NOT_FOUND_ERROR,
  readKlaviyoErrorPayload,
} from "~/utils/klaviyo.server";
import { isSameOriginPost } from "~/utils/request-security.server";
import { shopifyNumericId } from "~/utils/shopify-id";

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "POST") {
    return data(
      { ok: false, error: KLAVIYO_GENERIC_ERROR },
      { status: 405, headers: { Allow: "POST" } },
    );
  }
  if (!isSameOriginPost(request)) {
    return data({ ok: false, error: KLAVIYO_GENERIC_ERROR }, { status: 403 });
  }

  const apiToken = context.env.KLAVIYO_PRIVATE_API_TOKEN;
  if (!apiToken) {
    console.error(
      "Back-in-stock signup unavailable: KLAVIYO_PRIVATE_API_TOKEN is not set",
    );
    return data({ ok: false, error: KLAVIYO_GENERIC_ERROR }, { status: 503 });
  }

  const formData = await request.formData();
  const submittedEmail = formData.get("email");
  const submittedVariantId = formData.get("variantId");
  const email =
    typeof submittedEmail === "string"
      ? submittedEmail.trim().toLowerCase()
      : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return data(
      { ok: false, error: KLAVIYO_INVALID_EMAIL_ERROR },
      { status: 400 },
    );
  }

  const variantId =
    typeof submittedVariantId === "string"
      ? shopifyNumericId(submittedVariantId)
      : "";
  if (!variantId) {
    return data(
      { ok: false, error: "A product variant is required" },
      { status: 400 },
    );
  }

  try {
    const response = await createKlaviyoBackInStockSubscription({
      apiToken,
      email,
      variantId,
    });
    if (response.ok) {
      return data({ ok: true }, { status: 201 });
    }

    const payload = await readKlaviyoErrorPayload(response);
    if (
      response.status === 409 ||
      hasKlaviyoErrorCode(payload, "duplicate") ||
      hasKlaviyoErrorCode(payload, "already_subscribed")
    ) {
      return data({ ok: true });
    }

    console.error(
      "Klaviyo back-in-stock failed",
      getKlaviyoErrorLogContext(response, payload),
    );
    const userError = getKlaviyoUserError(payload, "back-in-stock");
    if (userError === KLAVIYO_VARIANT_NOT_FOUND_ERROR) {
      return data({ ok: false, error: userError }, { status: 422 });
    }
    return data({ ok: false, error: userError }, { status: response.status });
  } catch {
    console.error("Klaviyo back-in-stock request failed");
    return data({ ok: false, error: KLAVIYO_GENERIC_ERROR }, { status: 500 });
  }
}
