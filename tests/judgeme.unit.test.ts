import assert from "node:assert/strict";
import test from "node:test";
import { getJudgemeReviews } from "../app/utils/judgeme.ts";

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
