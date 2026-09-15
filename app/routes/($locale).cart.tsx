import type { CartQueryDataReturn } from "@shopify/hydrogen";
import { CartForm } from "@shopify/hydrogen";
import type { CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import {
  type ActionFunctionArgs,
  type AppLoadContext,
  data,
  type HeadersFunction,
  type MetaFunction,
} from "react-router";
import { CartMain } from "~/components/cart/cart";
import { skipRevalidationForCartActions } from "~/utils/revalidation";

export const meta: MetaFunction = () => {
  return [{ title: `Hydrogen | Cart` }];
};

export const headers: HeadersFunction = ({ actionHeaders }) => actionHeaders;

export const shouldRevalidate = skipRevalidationForCartActions;

export async function action({ request, context }: ActionFunctionArgs) {
  const { cart } = context;
  const [formData, customerAccessToken] = await Promise.all([
    request.formData(),
    context.customerAccount.getAccessToken(),
  ]);

  const { action: formAction, inputs } = CartForm.getFormInput(formData);

  if (!formAction) {
    throw new Error("No action provided");
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (formAction) {
    case CartForm.ACTIONS.LinesAdd: {
      const lines = getCartLineInputs(
        (inputs.lines as CartLineInput[] | undefined) ?? [],
      );
      const hasInvalidLine =
        lines.length === 0 ||
        lines.some(
          (line) =>
            typeof line.merchandiseId !== "string" ||
            line.merchandiseId.length === 0 ||
            !Number.isInteger(line.quantity) ||
            Number(line.quantity) <= 0,
        );

      if (hasInvalidLine) {
        return data(
          {
            cart: undefined,
            userErrors: [
              {
                message: "Please select an available option.",
              },
            ],
            errors: undefined,
          },
          { status: 400 },
        );
      }

      result = await cart.addLines(lines);
      break;
    }
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove: {
      const requestedLineIds = Array.isArray(inputs.lineIds)
        ? inputs.lineIds.filter(
            (lineId): lineId is string =>
              typeof lineId === "string" && lineId.length > 0,
          )
        : [];

      if (!requestedLineIds.length) {
        return data(
          {
            cart: await getCartOrNull(cart),
            userErrors: [{ message: "No cart line selected." }],
            errors: undefined,
          },
          { status: 400 },
        );
      }

      const currentCart = await getCartOrNull(cart);
      const currentLineIds = new Set(
        currentCart?.lines?.nodes?.map((line) => line.id) ?? [],
      );
      const existingLineIds = requestedLineIds.filter((lineId) =>
        currentLineIds.has(lineId),
      );

      // Repeated remove requests have already reached the desired state.
      if (!existingLineIds.length) {
        return data({
          cart: currentCart,
          userErrors: [],
          errors: undefined,
        });
      }

      try {
        const removeResult = await cart.removeLines(existingLineIds);
        if (hasOnlyMissingCartLineErrors(removeResult)) {
          return data({
            cart: (await getCartOrNull(cart)) ?? removeResult.cart,
            userErrors: [],
            errors: undefined,
          });
        }
        result = removeResult;
      } catch (error) {
        if (!isMissingCartLineError(error)) {
          throw error;
        }
        return data({
          cart: await getCartOrNull(cart),
          userErrors: [],
          errors: undefined,
        });
      }
      break;
    }
    case CartForm.ACTIONS.NoteUpdate: {
      result = await cart.updateNote((inputs.cartNote as string) || "");
      break;
    }
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      const existingDiscountCodes = ((inputs.discountCodes as
        | string[]
        | undefined) || []) as string[];
      discountCodes.push(...existingDiscountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];
      giftCardCodes.push(...((inputs.giftCardCodes as string[]) || []));
      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      result = await cart.removeGiftCardCodes(inputs.giftCardCodes as string[]);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
        customerAccessToken,
      });
      break;
    }
    default:
      throw new Error(`${formAction} cart action is not defined`);
  }

  const responseHeaders = result.cart
    ? cart.setCartId(result.cart.id)
    : new Headers();
  const { cart: cartResult, errors, userErrors } = result;

  const redirectTo = formData.get("redirectTo") ?? null;
  if (typeof redirectTo === "string") {
    status = 303;
    responseHeaders.set("Location", redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      userErrors,
      analytics: {
        cartId: result.cart?.id,
      },
    },
    { status, headers: responseHeaders },
  );
}

function getCartLineInputs(lines: CartLineInput[]): CartLineInput[] {
  return lines.map(
    ({ attributes, merchandiseId, parent, quantity, sellingPlanId }) => ({
      attributes,
      merchandiseId,
      parent,
      quantity,
      sellingPlanId,
    }),
  );
}

function hasOnlyMissingCartLineErrors(result: CartQueryDataReturn) {
  const messages = [
    ...(result.userErrors ?? []).map((error) => error.message),
    ...getErrorMessages(result.errors),
  ].filter(Boolean);

  return messages.length > 0 && messages.every(isMissingCartLineError);
}

function isMissingCartLineError(error: unknown) {
  return getErrorMessages(error).some((message) =>
    /merchandise line with id .+ does not exist/i.test(message),
  );
}

function getErrorMessages(error: unknown): string[] {
  if (typeof error === "string") {
    return [error];
  }
  if (Array.isArray(error)) {
    return error.flatMap(getErrorMessages);
  }
  if (error instanceof Error) {
    return [error.message];
  }
  if (error && typeof error === "object" && "message" in error) {
    return getErrorMessages((error as { message?: unknown }).message);
  }
  return [];
}

async function getCartOrNull(cart: AppLoadContext["cart"]) {
  try {
    return await cart.get();
  } catch (error) {
    if (isMissingCartLineError(error)) {
      return null;
    }
    throw error;
  }
}

export default function Cart() {
  return (
    <main className="cart bg-background-subtle px-4 py-8 md:px-10 md:py-12 lg:px-16">
      <div className="mx-auto w-full max-w-page">
        <h1 className="mb-8 text-2xl font-normal leading-normal md:text-3xl">
          Cart
        </h1>
        <CartMain layout="page" />
      </div>
    </main>
  );
}
