import { data, type LoaderFunctionArgs } from "react-router";
import { CART_LINES_LIMIT } from "~/graphql/fragments";

export async function loader({ context, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const cartRequestToken = url.searchParams.get("cartRequestToken") ?? "";

  return data(
    {
      cart: await context.cart.get({ numCartLines: CART_LINES_LIMIT }),
      cartRequestToken,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
