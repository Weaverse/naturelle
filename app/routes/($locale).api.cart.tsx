import { data, type LoaderFunctionArgs } from "react-router";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const cartRequestToken = url.searchParams.get("cartRequestToken") ?? "";

  return data(
    {
      cart: await context.cart.get(),
      cartRequestToken,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
