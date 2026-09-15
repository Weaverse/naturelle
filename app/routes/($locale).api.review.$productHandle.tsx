import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { createJudgemeReview, getJudgemeReviews } from "~/utils/judgeme";

export async function action({ request, context }: ActionFunctionArgs) {
  const apiToken = context.env.JUDGEME_PRIVATE_API_TOKEN;
  const shopDomain = context.env.PUBLIC_STORE_DOMAIN;
  if (!(apiToken && shopDomain)) {
    return data(
      { message: "Judge.me is not configured", success: false },
      { status: 500 },
    );
  }

  const response = await createJudgemeReview(
    apiToken,
    shopDomain,
    await request.formData(),
  );
  const { status, ...result } = response;
  return data(
    { ...result, success: status >= 200 && status < 300 },
    { status },
  );
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

  return data(
    await getJudgemeReviews(
      context.env.JUDGEME_PRIVATE_API_TOKEN,
      context.env.PUBLIC_STORE_DOMAIN,
      productHandle,
      {
        weaverseContext: context.weaverse,
        page,
        perPage,
      },
    ),
  );
}
