import type {
  JudgeMeReviewType,
  JudgemeProduct,
  JudgemeRatingDistribution,
  JudgemeReviewsData,
  JudgemeStarsRatingData,
  JudgemeWidgetData,
} from "~/types/judgeme";

export * from "~/types/judgeme";

const WIDGET_REGEX =
  /class=['"]jdgm-rev-widg['"][^>]*data-average-rating=['"]([^'"]*)['"]/;
const REVIEWS_REGEX = /data-number-of-reviews=['"]([^'"]*)['"]/;
const HISTOGRAM_ROW_REGEX =
  /class=['"]jdgm-histogram__row['"][^>]*data-rating=['"](\d+)['"][^>]*data-frequency=['"](\d+)['"][^>]*data-percentage=['"](\d+)['"][^>]*>/g;

export function parseJudgemeWidgetHTML(html: string): JudgemeWidgetData {
  const ratingDistribution: JudgemeRatingDistribution[] = [];
  let match: RegExpExecArray | null;
  match = HISTOGRAM_ROW_REGEX.exec(html);
  while (match !== null) {
    const rating = Number.parseInt(match[1], 10);
    const frequency = Number.parseInt(match[2], 10);
    const percentage = Number.parseInt(match[3], 10);
    ratingDistribution.push({
      rating,
      frequency,
      percentage,
    });
    match = HISTOGRAM_ROW_REGEX.exec(html);
  }

  return {
    averageRating: Number.parseFloat(html.match(WIDGET_REGEX)?.[1] || "0"),
    totalReviews: Number.parseInt(html.match(REVIEWS_REGEX)?.[1] || "0", 10),
    ratingDistribution: ratingDistribution.sort((a, b) => b.rating - a.rating),
  };
}

const AVG_RATING_REGEX = /data-average-rating=['"]([^'"]+)['"]/;
const NUM_REVIEWS_REGEX = /data-number-of-reviews=['"]([^'"]+)['"]/;

const JUDGEME_PRODUCT_API = "https://judge.me/api/v1/products/-1";
const JUDGEME_WIDGET_API = "https://api.judge.me/api/v1/widgets/product_review";
const JUDGEME_REVIEWS_API = "https://api.judge.me/api/v1/reviews";

const EMPTY_REVIEWS: JudgemeReviewsData = {
  averageRating: 0,
  rating: 0,
  totalReviews: 0,
  reviewNumber: 0,
  ratingDistribution: [],
  currentPage: 1,
  totalPage: 0,
  perPage: 5,
  reviews: [],
};

type JsonFetcher = <T>(url: string, options?: RequestInit) => Promise<T>;
type JudgemeFetchContext = { fetchWithCache: JsonFetcher };
type JudgemeRequestOptions = {
  weaverseContext?: JudgemeFetchContext;
  perPage?: number;
};

function isFetchContext(
  value?: JudgemeFetchContext | JudgemeRequestOptions,
): value is JudgemeFetchContext {
  return Boolean(value && "fetchWithCache" in value);
}

function buildJudgemeUrl(
  endpoint: string,
  params: Record<string, string | number>,
) {
  const url = new URL(endpoint);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, String(value));
  }
  return url.toString();
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Judge.me request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function parseBadgeHtml(html: string): JudgemeStarsRatingData {
  return {
    totalReviews: Number.parseInt(
      html.match(NUM_REVIEWS_REGEX)?.[1] || "0",
      10,
    ),
    averageRating: Number.parseFloat(html.match(AVG_RATING_REGEX)?.[1] || "0"),
    badge: html,
  };
}

export async function getJudgemeReviews(
  apiToken: string | undefined,
  shopDomain: string | undefined,
  handle: string,
  contextOrOptions?: JudgemeFetchContext | JudgemeRequestOptions,
): Promise<JudgemeReviewsData> {
  if (!(apiToken && shopDomain && handle)) {
    return EMPTY_REVIEWS;
  }

  let fetcher = fetchJson;
  let perPage = 5;
  if (isFetchContext(contextOrOptions)) {
    fetcher = contextOrOptions.fetchWithCache;
  } else if (contextOrOptions) {
    fetcher = contextOrOptions.weaverseContext?.fetchWithCache || fetchJson;
    perPage = contextOrOptions.perPage || perPage;
  }
  try {
    const productData = await fetcher<{ product?: JudgemeProduct }>(
      buildJudgemeUrl(JUDGEME_PRODUCT_API, {
        api_token: apiToken,
        shop_domain: shopDomain,
        handle,
      }),
    );
    if (!productData.product?.id) {
      return EMPTY_REVIEWS;
    }

    const [widgetData, reviewsData] = await Promise.all([
      fetcher<{ widget?: string }>(
        buildJudgemeUrl(JUDGEME_WIDGET_API, {
          api_token: apiToken,
          shop_domain: shopDomain,
          handle,
          page: 1,
          per_page: perPage,
        }),
      ),
      fetcher<{
        reviews?: JudgeMeReviewType[];
        current_page?: number;
        per_page?: number;
      }>(
        buildJudgemeUrl(JUDGEME_REVIEWS_API, {
          api_token: apiToken,
          shop_domain: shopDomain,
          product_id: productData.product.id,
          page: 1,
          per_page: perPage,
        }),
      ),
    ]);
    const summary = widgetData.widget
      ? parseJudgemeWidgetHTML(widgetData.widget)
      : EMPTY_REVIEWS;

    return {
      averageRating: summary.averageRating,
      rating: summary.averageRating,
      totalReviews: summary.totalReviews,
      reviewNumber: summary.totalReviews,
      ratingDistribution: summary.ratingDistribution,
      reviews: reviewsData.reviews || [],
      currentPage: reviewsData.current_page || 1,
      totalPage: Math.ceil(summary.totalReviews / perPage),
      perPage: reviewsData.per_page || perPage,
    };
  } catch (error) {
    console.error("Unable to load Judge.me reviews", error);
    return EMPTY_REVIEWS;
  }
}

export async function createJudgemeReview(
  apiToken: string,
  shopDomain: string,
  formData: FormData,
) {
  const url = "https://judge.me/api/v1/reviews";
  const body = {
    name: formData.get("name"),
    email: formData.get("email"),
    rating: formData.get("rating"),
    title: formData.get("title"),
    body: formData.get("body"),
    id: formData.get("id"), // external_id (product id)
    url: formData.get("url"), // product handle or url
    shop_domain: shopDomain,
    platform: "shopify", // or custom
  };

  try {
    const res = await fetch(
      buildJudgemeUrl(url, {
        api_token: apiToken,
        shop_domain: shopDomain,
      }),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (res.ok) {
      return { status: 201, message: "Review created" };
    }
    return { status: res.status, message: "Failed to create review" };
  } catch (error) {
    console.error("Error creating Judge.me review:", error);
    return { status: 500, message: "Internal Server Error" };
  }
}
