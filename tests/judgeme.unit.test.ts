import assert from "node:assert/strict";
import test from "node:test";
import {
  createJudgemeReview,
  getJudgemeProduct,
  getJudgemeReviewSummary,
  getJudgemeReviews,
} from "../app/utils/judgeme.ts";

const review = {
  id: "review-1",
  title: "Great product",
  created_at: "2026-09-15T00:00:00Z",
  body: "Works well.",
  rating: 5,
  product_external_id: 123,
  reviewer: {
    id: 1,
    email: "reviewer@example.com",
    name: "Reviewer",
    phone: "",
    accepts_marketing: false,
  },
  source: "web",
  curated: false,
  published: true,
  hidden: false,
  verified: true,
  featured: false,
  pinned: false,
  has_published_pictures: false,
  has_published_videos: false,
  pictures: [],
  ip_address: "",
};

function widgetHtml({ rating, count }: { rating: number; count: number }) {
  return `<div class="jdgm-rev-widg" data-average-rating="${rating}" data-number-of-reviews="${count}">
    <div class="jdgm-histogram__row" data-rating="5" data-frequency="${count}" data-percentage="${count > 0 ? 100 : 0}"></div>
  </div>`;
}

test("returns Judge.me reviews without exposing the API token", async () => {
  const apiToken = "private-test-token";
  const fetchWithCache = async <T>(url: string): Promise<T> => {
    if (url.includes("/products/-1")) {
      return { product: { id: 123, handle: "serum" } } as T;
    }
    if (url.includes("/widgets/product_review")) {
      return { widget: widgetHtml({ rating: 5, count: 1 }) } as T;
    }
    return { reviews: [review], current_page: 1, per_page: 5 } as T;
  };

  const result = await getJudgemeReviews(apiToken, "shop.example", "serum", {
    fetchWithCache,
  });

  assert.equal(result.rating, 5);
  assert.equal(result.reviewNumber, 1);
  assert.deepEqual(result.reviews, [review]);
  assert.equal(JSON.stringify(result).includes(apiToken), false);
});

test("returns an empty state when the product has no reviews", async () => {
  const fetchWithCache = async <T>(url: string): Promise<T> => {
    if (url.includes("/products/-1")) {
      return { product: { id: 123, handle: "serum" } } as T;
    }
    if (url.includes("/widgets/product_review")) {
      return { widget: widgetHtml({ rating: 0, count: 0 }) } as T;
    }
    return { reviews: [], current_page: 1, per_page: 5 } as T;
  };

  const result = await getJudgemeReviews(
    "private-test-token",
    "shop.example",
    "serum",
    { fetchWithCache },
  );

  assert.equal(result.rating, 0);
  assert.equal(result.reviewNumber, 0);
  assert.deepEqual(result.reviews, []);
});

test("returns an empty state without making a request when unconfigured", async () => {
  let requestCount = 0;
  const fetchWithCache = async <T>(): Promise<T> => {
    requestCount += 1;
    throw new Error("unexpected request");
  };

  const result = await getJudgemeReviews(undefined, "shop.example", "serum", {
    fetchWithCache,
  });

  assert.equal(requestCount, 0);
  assert.equal(result.reviewNumber, 0);
  assert.deepEqual(result.reviews, []);
});

test("returns an empty state when Judge.me fails or times out", async (t) => {
  t.mock.method(console, "error", () => undefined);
  const fetchWithCache = async <T>(): Promise<T> => {
    throw new DOMException("The operation timed out", "TimeoutError");
  };

  const result = await getJudgemeReviews(
    "private-test-token",
    "shop.example",
    "serum",
    { fetchWithCache },
  );

  assert.equal(result.reviewNumber, 0);
  assert.deepEqual(result.reviews, []);
});

test("resolves the review product from its handle on the server", async (t) => {
  let requestedUrl = "";
  t.mock.method(globalThis, "fetch", async (input) => {
    requestedUrl = String(input);
    return Response.json({
      product: { id: 123, external_id: 456, handle: "serum" },
    });
  });

  const product = await getJudgemeProduct(
    "private-test-token",
    "shop.example",
    "serum",
  );

  assert.equal(product.status, "found");
  assert.equal(
    product.status === "found" ? product.product.external_id : null,
    456,
  );
  assert.match(requestedUrl, /handle=serum/);
});

test("reports a missing Judge.me product", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({}, { status: 404 }),
  );

  const missingProduct = await getJudgemeProduct(
    "private-test-token",
    "shop.example",
    "missing-product",
  );
  assert.equal(missingProduct.status, "not-found");
});

test("reports an unavailable Judge.me service", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({}, { status: 503 }),
  );
  const unavailableProduct = await getJudgemeProduct(
    "private-test-token",
    "shop.example",
    "serum",
  );
  assert.equal(unavailableProduct.status, "unavailable");
});

test("creates a review with the server-resolved product id", async (t) => {
  let requestBody: Record<string, unknown> = {};
  t.mock.method(globalThis, "fetch", async (_input, init) => {
    requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;
    return new Response(null, { status: 201 });
  });

  const result = await createJudgemeReview(
    "private-test-token",
    "shop.example",
    {
      name: "Reviewer",
      email: "reviewer@example.com",
      rating: 5,
      title: "Great product",
      body: "Works well.",
      productExternalId: 456,
      productHandle: "serum",
    },
  );

  assert.equal(result.status, 201);
  assert.equal(requestBody.id, 456);
  assert.equal(requestBody.url, "serum");
});

test("returns the review summary with a single widget request", async () => {
  const apiToken = "private-test-token";
  const requestedUrls: string[] = [];
  const fetchWithCache = async <T>(url: string): Promise<T> => {
    requestedUrls.push(url);
    return { widget: widgetHtml({ rating: 4, count: 12 }) } as T;
  };

  const result = await getJudgemeReviewSummary(
    apiToken,
    "shop.example",
    "serum",
    { fetchWithCache },
  );

  assert.equal(result.averageRating, 4);
  assert.equal(result.totalReviews, 12);
  assert.equal(requestedUrls.length, 1);
  assert.match(requestedUrls[0], /\/widgets\/product_review/);
  assert.equal(JSON.stringify(result).includes(apiToken), false);
});

test("returns an empty summary without making a request when unconfigured", async () => {
  let requestCount = 0;
  const fetchWithCache = async <T>(): Promise<T> => {
    requestCount += 1;
    throw new Error("unexpected request");
  };

  const result = await getJudgemeReviewSummary(
    undefined,
    "shop.example",
    "serum",
    { fetchWithCache },
  );

  assert.equal(requestCount, 0);
  assert.equal(result.averageRating, 0);
  assert.equal(result.totalReviews, 0);
});

test("returns an empty summary when Judge.me fails or the widget is missing", async (t) => {
  t.mock.method(console, "error", () => undefined);

  const failing = await getJudgemeReviewSummary(
    "private-test-token",
    "shop.example",
    "serum",
    {
      fetchWithCache: async <T>(): Promise<T> => {
        throw new DOMException("The operation timed out", "TimeoutError");
      },
    },
  );
  assert.equal(failing.totalReviews, 0);
  assert.equal(failing.averageRating, 0);

  const missingWidget = await getJudgemeReviewSummary(
    "private-test-token",
    "shop.example",
    "serum",
    {
      fetchWithCache: async <T>(): Promise<T> => {
        return {} as T;
      },
    },
  );
  assert.equal(missingWidget.totalReviews, 0);
  assert.equal(missingWidget.averageRating, 0);
});
