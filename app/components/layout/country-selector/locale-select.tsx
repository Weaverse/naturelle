import * as Popover from "@radix-ui/react-popover";
import { CartForm } from "@shopify/hydrogen";
import type { CartBuyerIdentityInput } from "@shopify/hydrogen/storefront-api-types";
import { type ReactNode, useState } from "react";
import { IconCaret } from "~/components/icon";
import type { Locale } from "~/types/type-locale";
import { usePrefixPathWithLocale } from "~/utils/locale";

export type LocaleOption = { key: string; label: string; locale: Locale };

export function LocaleSelect({
  ariaLabel,
  label,
  options,
  getRedirectUrl,
  placement,
}: {
  ariaLabel: string;
  label: string;
  options: LocaleOption[];
  getRedirectUrl: (locale: Locale) => string;
  placement: "header" | "footer";
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={ariaLabel}
        className={
          placement === "header"
            ? "group flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold outline-none"
            : "group flex max-w-full min-w-0 items-center gap-2 rounded-xl border border-(--color-border-subtle) bg-(--color-background-basic) px-3.5 py-2 font-body text-[12px] leading-none font-normal tracking-[-0.12px] text-(--color-footer-text) outline-none"
        }
      >
        <span
          className={placement === "footer" ? "truncate" : "whitespace-nowrap"}
        >
          {label}
        </span>
        <IconCaret
          direction="down"
          className="size-3 shrink-0 transition-transform group-data-[state=open]:rotate-180"
        />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="center"
          side={placement === "header" ? "bottom" : "top"}
          sideOffset={placement === "header" ? 12 : 8}
          collisionPadding={12}
          onPointerDownOutside={() => setOpen(false)}
          onEscapeKeyDown={() => setOpen(false)}
          className="z-50 max-h-64 w-max min-w-[var(--radix-popover-trigger-width)] max-w-[var(--radix-popover-content-available-width)] overflow-y-auto rounded-xl border border-(--color-border-subtle) bg-(--color-background-basic) py-1 shadow-lg"
        >
          {options.map(({ key, label: optionLabel, locale }) => (
            <Popover.Close asChild key={key}>
              <ChangeLocaleForm
                redirectTo={getRedirectUrl(locale)}
                buyerIdentity={{ countryCode: locale.country }}
              >
                <button
                  type="submit"
                  className="block w-full cursor-pointer whitespace-normal px-3.5 py-2 text-left font-body text-[12px] leading-none font-normal tracking-[-0.12px] text-(--color-footer-text) hover:bg-black/5"
                >
                  {optionLabel}
                </button>
              </ChangeLocaleForm>
            </Popover.Close>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ChangeLocaleForm({
  children,
  buyerIdentity,
  redirectTo,
}: {
  children: ReactNode;
  buyerIdentity: CartBuyerIdentityInput;
  redirectTo: string;
}) {
  const cartRoute = usePrefixPathWithLocale("/cart");
  return (
    <CartForm
      route={cartRoute}
      action={CartForm.ACTIONS.BuyerIdentityUpdate}
      inputs={{ buyerIdentity }}
    >
      <input type="hidden" name="redirectTo" value={redirectTo} />
      {children}
    </CartForm>
  );
}
