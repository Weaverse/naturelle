import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import {
  createJudgemeReview,
  emptyJudgemeReviews,
  getJudgemeProduct,
  getJudgemeReviews,
} from "~/utils/judgeme";
import { isSameOriginPost } from "~/utils/request-security.server";

export async function action({ request, context, params }: ActionFunctionArgs) {
  if (request.method.toUpperCase() !== "POST") {
    return data(
      { message: "Review submission is unavailable", success: false },
      { status: 405, headers: { Allow: "POST" } },
    );
  }
  if (!isSameOriginPost(request)) {
    return data(
      { message: "Review submission is unavailable", success: false },
      { status: 403 },
    );
  }

  const apiToken = context.env.JUDGEME_PRIVATE_API_TOKEN;
  const shopDomain = context.env.PUBLIC_STORE_DOMAIN;
  if (!(apiToken && shopDomain)) {
    return data(
      { message: "Review service is unavailable", success: false },
      { status: 503 },
    );
  }

  const productHandle = params.productHandle;
  if (!productHandle) {
    return data(
      { message: "A product is required", success: false },
      { status: 400 },
    );
  }

  const formData = await request.formData();
  const name = getFormText(formData, "name");
  const email = getFormText(formData, "email").toLowerCase();
  const title = getFormText(formData, "title");
  const body = getFormText(formData, "body");
  const rating = Number(getFormText(formData, "rating"));
  if (
    !name ||
    name.length > 100 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 320 ||
    !title ||
    title.length > 200 ||
    !body ||
    body.length > 500 ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return data(
      { message: "Please check your review details", success: false },
      { status: 400 },
    );
  }

  const productLookup = await getJudgemeProduct(
    apiToken,
    shopDomain,
    productHandle,
  );
  if (productLookup.status === "not-found") {
    return data(
      { message: "Product was not found", success: false },
      { status: 404 },
    );
  }
  if (
    productLookup.status === "unavailable" ||
    !productLookup.product.external_id ||
    !Number.isSafeInteger(productLookup.product.external_id)
  ) {
    return data(
      { message: "Review service is unavailable", success: false },
      { status: 503 },
    );
  }

  const { product } = productLookup;

  const response = await createJudgemeReview(apiToken, shopDomain, {
    name,
    email,
    rating,
    title,
    body,
    productExternalId: product.external_id,
    productHandle,
  });
  const { status, ...result } = response;
  return data(
    { ...result, success: status >= 200 && status < 300 },
    { status },
  );
}

function getFormText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const productHandle = params.productHandle;
  if (!productHandle) {
    return data(null, { status: 400 });
  }

  const searchParams = new URL(request.url).searchParams;
  const requestedPage = Number.parseInt(searchParams.get("page") || "1", 10);
  const requestedPerPage = Number.parseInt(
    searchParams.get("per_page") || "5",
    10,
  );
  const page = Number.isFinite(requestedPage) ? Math.max(1, requestedPage) : 1;
  const perPage = Number.isFinite(requestedPerPage)
    ? Math.min(20, Math.max(1, requestedPerPage))
    : 5;

  if (
    !(context.env.JUDGEME_PRIVATE_API_TOKEN && context.env.PUBLIC_STORE_DOMAIN)
  ) {
    return data({
      ...emptyJudgemeReviews(perPage),
      productHandle,
    });
  }

  const reviews = await getJudgemeReviews(
    context.env.JUDGEME_PRIVATE_API_TOKEN,
    context.env.PUBLIC_STORE_DOMAIN,
    productHandle,
    {
      weaverseContext: context.weaverse,
      page,
      perPage,
    },
  );

  return data({ ...reviews, productHandle });
}
