import { type ActionFunctionArgs, data } from "react-router";
import {
  getKlaviyoErrorLogContext,
  getKlaviyoUserError,
  KLAVIYO_GENERIC_ERROR,
  KLAVIYO_INVALID_EMAIL_ERROR,
  readKlaviyoErrorPayload,
  subscribeKlaviyoProfile,
} from "~/utils/klaviyo.server";
import { isSameOriginPost } from "~/utils/request-security.server";

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
  const listId = context.env.KLAVIYO_NEWSLETTER_LIST_ID;
  if (!(apiToken && listId)) {
    console.error(
      "Klaviyo signup unavailable: KLAVIYO_PRIVATE_API_TOKEN and KLAVIYO_NEWSLETTER_LIST_ID must be set",
    );
    return data({ ok: false, error: KLAVIYO_GENERIC_ERROR }, { status: 503 });
  }

  const formData = await request.formData();
  const submittedEmail = formData.get("email");
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

  try {
    const response = await subscribeKlaviyoProfile({
      apiToken,
      email,
      listId,
    });
    if (response.ok) {
      return data({ ok: true }, { status: response.status });
    }

    const payload = await readKlaviyoErrorPayload(response);
    console.error(
      "Klaviyo signup failed",
      getKlaviyoErrorLogContext(response, payload),
    );
    return data(
      { ok: false, error: getKlaviyoUserError(payload, "newsletter") },
      { status: response.status },
    );
  } catch {
    console.error("Klaviyo signup request failed");
    return data({ ok: false, error: KLAVIYO_GENERIC_ERROR }, { status: 500 });
  }
}
