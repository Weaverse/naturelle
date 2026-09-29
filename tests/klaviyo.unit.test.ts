import assert from "node:assert/strict";
import test from "node:test";
import {
  getKlaviyoErrorLogContext,
  getKlaviyoUserError,
  KLAVIYO_GENERIC_ERROR,
  KLAVIYO_INVALID_EMAIL_ERROR,
  KLAVIYO_REVISION,
  KLAVIYO_VARIANT_NOT_FOUND_ERROR,
  subscribeKlaviyoProfile,
} from "../app/utils/klaviyo.server.ts";

test("subscribes an email to marketing and the configured list", async (t) => {
  let capturedInput: RequestInfo | URL | undefined;
  let capturedInit: RequestInit | undefined;
  t.mock.method(globalThis, "fetch", async (input, init) => {
    capturedInput = input;
    capturedInit = init;
    return new Response(null, { status: 202 });
  });

  const response = await subscribeKlaviyoProfile({
    apiToken: "private-token",
    email: "subscriber@example.com",
    listId: "newsletter-list",
  });

  assert.equal(response.status, 202);
  assert.equal(
    capturedInput,
    "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/",
  );
  assert.equal(capturedInit?.method, "POST");
  assert.deepEqual(capturedInit?.headers, {
    accept: "application/vnd.api+json",
    revision: KLAVIYO_REVISION,
    "content-type": "application/vnd.api+json",
    Authorization: "Klaviyo-API-Key private-token",
  });
  assert.deepEqual(JSON.parse(String(capturedInit?.body)), {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        custom_source: "Newsletter form",
        profiles: {
          data: [
            {
              type: "profile",
              attributes: {
                email: "subscriber@example.com",
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
          data: { type: "list", id: "newsletter-list" },
        },
      },
    },
  });
});

test("only exposes allowlisted Klaviyo error metadata to logs", () => {
  const response = new Response(null, {
    status: 400,
    headers: { "x-request-id": "req_123-safe" },
  });
  const context = getKlaviyoErrorLogContext(response, {
    errors: [
      {
        code: "invalid_email",
        detail: "subscriber@example.com is invalid",
      },
      {
        code: "subscriber@example.com",
        detail: "request body contained subscriber@example.com",
      },
    ],
  });

  assert.deepEqual(context, {
    status: 400,
    requestId: "req_123-safe",
    errorCodes: ["invalid_email"],
  });
  assert.doesNotMatch(JSON.stringify(context), /subscriber@example\.com/);
});

test("drops unsafe request IDs from Klaviyo log metadata", () => {
  const response = new Response(null, {
    status: 500,
    headers: { "x-klaviyo-request-id": "subscriber@example.com" },
  });

  assert.deepEqual(getKlaviyoErrorLogContext(response, {}), {
    status: 500,
    requestId: null,
    errorCodes: [],
  });
});

test("maps only explicit Klaviyo error codes to specific user messages", () => {
  assert.equal(
    getKlaviyoUserError({ errors: [{ code: "invalid_email" }] }, "newsletter"),
    KLAVIYO_INVALID_EMAIL_ERROR,
  );
  assert.equal(
    getKlaviyoUserError(
      { errors: [{ code: "variant_not_found" }] },
      "back-in-stock",
    ),
    KLAVIYO_VARIANT_NOT_FOUND_ERROR,
  );
  assert.equal(
    getKlaviyoUserError(
      { errors: [{ code: "invalid_list_id" }] },
      "newsletter",
    ),
    KLAVIYO_GENERIC_ERROR,
  );
  assert.equal(
    getKlaviyoUserError({ errors: [{ code: "invalid" }] }, "back-in-stock"),
    KLAVIYO_GENERIC_ERROR,
  );
});
