import * as Popover from "@radix-ui/react-popover";
import { CartForm } from "@shopify/hydrogen";
import { useTranslation } from "@weaverse/hydrogen";
import { useState } from "react";
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
  const { t } = useTranslation();
  const cartRoute = usePrefixPathWithLocale("/cart");
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={ariaLabel}
        className={
          placement === "header"
            ? "group flex cursor-pointer items-center gap-1.5 outline-none"
            : "group flex max-w-full min-w-0 items-center gap-2 rounded-xl border border-border-subtle bg-background-basic px-3.5 py-2 outline-none"
        }
      >
        <span
          className={
            placement === "footer"
              ? "truncate font-body text-xs leading-none font-normal not-italic tracking-[-0.12px] text-(--color-footer-text)"
              : "whitespace-nowrap font-body text-[13px] leading-normal font-semibold not-italic"
          }
        >
          {label}
        </span>
        <IconCaret direction="down" className="size-3.5 shrink-0" />
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
            <form key={key} method="post" action={cartRoute}>
              <input
                type="hidden"
                name="redirectTo"
                value={getRedirectUrl(locale)}
              />
              <input
                type="hidden"
                name={CartForm.INPUT_NAME}
                value={JSON.stringify({
                  action: CartForm.ACTIONS.BuyerIdentityUpdate,
                  inputs: { buyerIdentity: { countryCode: locale.country } },
                })}
              />
              <button
                type="submit"
                aria-label={t("locale.selectOption", { option: optionLabel })}
                className="block w-full cursor-pointer whitespace-normal px-3.5 py-2 text-left font-body leading-none font-normal tracking-[-0.12px] text-(--color-footer-text) hover:bg-black/5"
              >
                <span
                  className={placement === "footer" ? "text-xs" : "text-[13px]"}
                >
                  {optionLabel}
                </span>
              </button>
            </form>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
