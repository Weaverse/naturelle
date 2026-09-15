import { type ActionFunctionArgs, data } from "react-router";
import {
  createKlaviyoProfile,
  hasKlaviyoErrorCode,
  KLAVIYO_GENERIC_ERROR,
  KLAVIYO_INVALID_EMAIL_ERROR,
  readKlaviyoErrorPayload,
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
  if (!apiToken) {
    console.error(
      "Klaviyo signup unavailable: KLAVIYO_PRIVATE_API_TOKEN is not set",
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
    const response = await createKlaviyoProfile({ apiToken, email });
    if (response.ok) {
      return data({ ok: true }, { status: 201 });
    }

    const payload = await readKlaviyoErrorPayload(response);
    if (
      response.status === 409 &&
      hasKlaviyoErrorCode(payload, "duplicate_profile")
    ) {
      return data({ ok: true });
    }

    console.error(
      `Klaviyo signup failed with status ${response.status}:`,
      JSON.stringify(payload),
    );
    if (response.status === 400) {
      return data(
        { ok: false, error: KLAVIYO_INVALID_EMAIL_ERROR },
        { status: 400 },
      );
    }
    return data(
      { ok: false, error: KLAVIYO_GENERIC_ERROR },
      { status: response.status },
    );
  } catch (error) {
    console.error("Klaviyo signup request failed:", error);
    return data({ ok: false, error: KLAVIYO_GENERIC_ERROR }, { status: 500 });
  }
}
