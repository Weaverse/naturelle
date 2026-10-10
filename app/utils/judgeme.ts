import type {
  JudgeMeReviewType,
  JudgemeProduct,
  JudgemeRatingDistribution,
  JudgemeReviewsData,
  JudgemeWidgetData,
} from "~/types/judgeme";

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

const JUDGEME_PRODUCT_API = "https://judge.me/api/v1/products/-1";
const JUDGEME_WIDGET_API = "https://api.judge.me/api/v1/widgets/product_review";
const JUDGEME_REVIEWS_API = "https://api.judge.me/api/v1/reviews";
const JUDGEME_REQUEST_TIMEOUT_MS = 5000;

export function emptyJudgemeReviews(perPage = 5): JudgemeReviewsData {
  return {
    averageRating: 0,
    rating: 0,
    totalReviews: 0,
    reviewNumber: 0,
    ratingDistribution: [],
    currentPage: 1,
    totalPage: 0,
    perPage,
    reviews: [],
  };
}

function emptyJudgemeReviewSummary(): JudgemeWidgetData {
  return {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [],
  };
}

type JsonFetcher = <T>(url: string, options?: RequestInit) => Promise<T>;
type JudgemeFetchContext = { fetchWithCache: JsonFetcher };
type JudgemeRequestOptions = {
  weaverseContext?: JudgemeFetchContext;
  perPage?: number;
  page?: number;
};

type JudgemeProductLookup =
  | { status: "found"; product: JudgemeProduct }
  | { status: "not-found" }
  | { status: "unavailable" };

class JudgemeRequestError extends Error {
  status: number;

  constructor(status: number) {
    super(`Judge.me request failed with status ${status}`);
    this.name = "JudgemeRequestError";
    this.status = status;
  }
}

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
    throw new JudgemeRequestError(response.status);
  }
  return response.json() as Promise<T>;
}

async function fetchJudgemeProduct(
  fetcher: JsonFetcher,
  apiToken: string,
  shopDomain: string,
  handle: string,
) {
  const productData = await fetcher<{ product?: JudgemeProduct }>(
    buildJudgemeUrl(JUDGEME_PRODUCT_API, {
      api_token: apiToken,
      shop_domain: shopDomain,
      handle,
    }),
    { signal: AbortSignal.timeout(JUDGEME_REQUEST_TIMEOUT_MS) },
  );
  return productData.product ?? null;
}

export async function getJudgemeProduct(
  apiToken: string,
  shopDomain: string,
  handle: string,
): Promise<JudgemeProductLookup> {
  try {
    const product = await fetchJudgemeProduct(
      fetchJson,
      apiToken,
      shopDomain,
      handle,
    );
    return product ? { status: "found", product } : { status: "not-found" };
  } catch (error) {
    if (error instanceof JudgemeRequestError && error.status === 404) {
      return { status: "not-found" };
    }
    // Do not log the request URL because Judge.me authenticates via query string.
    console.error("Unable to resolve Judge.me product");
    return { status: "unavailable" };
  }
}

export async function getJudgemeReviewSummary(
  apiToken: string | undefined,
  shopDomain: string | undefined,
  handle: string,
  context?: JudgemeFetchContext,
): Promise<JudgemeWidgetData> {
  if (!(apiToken && shopDomain && handle)) {
    return emptyJudgemeReviewSummary();
  }

  try {
    const widgetData = await (context?.fetchWithCache || fetchJson)<{
      widget?: string;
    }>(
      buildJudgemeUrl(JUDGEME_WIDGET_API, {
        api_token: apiToken,
        shop_domain: shopDomain,
        handle,
        page: 1,
        per_page: 1,
      }),
      { signal: AbortSignal.timeout(JUDGEME_REQUEST_TIMEOUT_MS) },
    );
    return widgetData.widget
      ? parseJudgemeWidgetHTML(widgetData.widget)
      : emptyJudgemeReviewSummary();
  } catch {
    // Do not log the request URL because Judge.me authenticates via query string.
    console.error("Unable to load Judge.me review summary");
    return emptyJudgemeReviewSummary();
  }
}

export async function getJudgemeReviews(
  apiToken: string | undefined,
  shopDomain: string | undefined,
  handle: string,
  contextOrOptions?: JudgemeFetchContext | JudgemeRequestOptions,
): Promise<JudgemeReviewsData> {
  if (!(apiToken && shopDomain && handle)) {
    return emptyJudgemeReviews();
  }

  let fetcher = fetchJson;
  let perPage = 5;
  let page = 1;
  if (isFetchContext(contextOrOptions)) {
    fetcher = contextOrOptions.fetchWithCache;
  } else if (contextOrOptions) {
    fetcher = contextOrOptions.weaverseContext?.fetchWithCache || fetchJson;
    perPage = contextOrOptions.perPage || perPage;
    page = contextOrOptions.page || page;
  }
  try {
    const product = await fetchJudgemeProduct(
      fetcher,
      apiToken,
      shopDomain,
      handle,
    );
    if (!product?.id) {
      return emptyJudgemeReviews(perPage);
    }

    const [widgetData, reviewsData] = await Promise.all([
      fetcher<{ widget?: string }>(
        buildJudgemeUrl(JUDGEME_WIDGET_API, {
          api_token: apiToken,
          shop_domain: shopDomain,
          handle,
          page,
          per_page: perPage,
        }),
        { signal: AbortSignal.timeout(JUDGEME_REQUEST_TIMEOUT_MS) },
      ),
      fetcher<{
        reviews?: JudgeMeReviewType[];
        current_page?: number;
        per_page?: number;
      }>(
        buildJudgemeUrl(JUDGEME_REVIEWS_API, {
          api_token: apiToken,
          shop_domain: shopDomain,
          product_id: product.id,
          page,
          per_page: perPage,
        }),
        { signal: AbortSignal.timeout(JUDGEME_REQUEST_TIMEOUT_MS) },
      ),
    ]);
    const summary = widgetData.widget
      ? parseJudgemeWidgetHTML(widgetData.widget)
      : emptyJudgemeReviews(perPage);

    return {
      averageRating: summary.averageRating,
      rating: summary.averageRating,
      totalReviews: summary.totalReviews,
      reviewNumber: summary.totalReviews,
      ratingDistribution: summary.ratingDistribution,
      reviews: reviewsData.reviews || [],
      currentPage: reviewsData.current_page || page,
      totalPage: Math.ceil(summary.totalReviews / perPage),
      perPage: reviewsData.per_page || perPage,
    };
  } catch {
    // Do not log the request URL because Judge.me authenticates via query string.
    console.error("Unable to load Judge.me reviews");
    return emptyJudgemeReviews(perPage);
  }
}

export async function createJudgemeReview(
  apiToken: string,
  shopDomain: string,
  submission: {
    name: string;
    email: string;
    rating: number;
    title: string;
    body: string;
    productExternalId: number;
    productHandle: string;
  },
) {
  const url = "https://judge.me/api/v1/reviews";
  const body = {
    name: submission.name,
    email: submission.email,
    rating: submission.rating,
    title: submission.title,
    body: submission.body,
    id: submission.productExternalId,
    url: submission.productHandle,
    shop_domain: shopDomain,
    platform: "shopify",
  };

  try {
    const res = await fetch(
      buildJudgemeUrl(url, {
        api_token: apiToken,
        shop_domain: shopDomain,
      }),
      {
        method: "POST",
        signal: AbortSignal.timeout(JUDGEME_REQUEST_TIMEOUT_MS),
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (res.ok) {
      return { status: res.status, message: "Review created" };
    }
    return { status: res.status, message: "Failed to create review" };
  } catch {
    console.error("Unable to create Judge.me review");
    return { status: 503, message: "Review service is unavailable" };
  }
}
