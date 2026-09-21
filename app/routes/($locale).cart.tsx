import type { CartQueryDataReturn } from "@shopify/hydrogen";
import { CartForm, Image } from "@shopify/hydrogen";
import type { CartLineInput } from "@shopify/hydrogen/storefront-api-types";
import { useThemeSettings } from "@weaverse/hydrogen";
import {
  type ActionFunctionArgs,
  type AppLoadContext,
  data,
  type HeadersFunction,
  type MetaFunction,
  useFetcher,
} from "react-router";
import { Button } from "~/components/button";
import { CartMain } from "~/components/cart/cart";
import { IconNewsletter } from "~/components/icon";
import { Input } from "~/components/input";
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
  const { cart: cartResult, errors, userErrors, warnings } = result;

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
      warnings,
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
  const { cartBannerImage } = useThemeSettings();

  return (
    <main className="cart flex flex-col">
      <div className="flex flex-col gap-10">
        {cartBannerImage ? (
          <div className="relative flex min-h-48 items-center justify-center overflow-hidden md:min-h-80">
            <Image
              data={cartBannerImage}
              className="absolute inset-0 size-full object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/10" />
            <h1 className="relative z-10 text-center font-heading text-[44px] leading-[110%] font-normal text-text-inverse">
              Cart
            </h1>
          </div>
        ) : (
          <h1 className="sr-only">Cart</h1>
        )}
        <div className="mx-auto w-full max-w-page">
          <CartMain layout="page" />
        </div>
      </div>
      <CartNewsletter />
    </main>
  );
}

function CartNewsletter() {
  const fetcher = useFetcher<{ errors?: Array<{ message: string }> }>({
    key: "cart-newsletter",
  });
  const isSubmitting = fetcher.state === "submitting";
  const error = fetcher.state === "idle" && fetcher.data?.errors?.[0]?.message;

  return (
    <section className="flex w-full items-center justify-center bg-background-subtle-1 px-5 py-12 lg:py-20">
      <div className="flex w-full max-w-xl flex-col items-center gap-4">
        <IconNewsletter
          viewBox="0 0 65 64"
          className="size-16 text-text"
          aria-hidden="true"
        />
        <div className="flex flex-col items-center gap-2">
          <h2 className="max-w-72 text-center font-heading text-[44px] leading-[110%] font-normal text-text md:max-w-none">
            Sign up for the updates
          </h2>
          <p className="text-center font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-text">
            Get 15% off your first order
          </p>
        </div>
        <fetcher.Form
          method="POST"
          action="/api/customer"
          className="flex w-full items-stretch gap-3"
        >
          <Input
            variant="custom"
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            className="min-w-0 flex-1 rounded-xl border border-border-subtle bg-background-basic px-4 py-3 text-left font-body text-base leading-[160%] font-normal tracking-[-0.16px] text-text placeholder:text-text"
          />
          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="h-auto shrink-0 rounded-xl px-6 py-3 font-body text-base leading-[160%] font-semibold tracking-[-0.16px]"
          >
            Send
          </Button>
        </fetcher.Form>
        {error && <p className="text-sm text-red-700">{error}</p>}
      </div>
    </section>
  );
}
