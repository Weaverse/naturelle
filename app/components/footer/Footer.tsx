import { Disclosure } from "@headlessui/react";
import { NavLink, useFetcher } from "@remix-run/react";
import { useThemeSettings } from "@weaverse/hydrogen";
import { cva } from "class-variance-authority";
import type React from "react";
import { Button } from "~/components/button";
import { Input } from "~/components/input";
import { useShopMenu } from "~/hooks/use-menu-shop";
import {
  type EnhancedMenu,
  type SingleMenuItem,
  getMaxDepth,
} from "~/lib/types/menu";
import { cn } from "~/lib/utils";
import { IconPlusLinkFooter } from "../Icon";
import { CountrySelector } from "./CountrySelector";

let variants = cva("", {
  variants: {
    width: {
      full: "w-full h-full",
      stretch: "w-full h-full",
      fixed: "w-full h-full container mx-auto",
    },
    padding: {
      full: "",
      stretch: "px-3 md:px-10 lg:px-16",
      fixed: "px-3 md:px-4 lg:px-6 mx-auto",
    },
  },
});

export function Footer() {
  let { footerMenu } = useShopMenu();
  let fetcher = useFetcher<any>();
  let isError = fetcher.state === "idle" && fetcher.data?.errors;
  const settings = useThemeSettings();
  let {
    footerWidth,
    footerTextCopyright,
    newsletterTitle,
    newsletterDescription,
    newsletterPlaceholder,
    newsletterButtonText,
    tagNameTitle: Tag = "h6",
  } = settings;
  return (
    <footer
      className={cn(
        "footer w-full bg-[var(--color-footer-bg)] text-[var(--color-footer-text)] border-t border-[var(--color-footer-text)]",
        variants({ padding: footerWidth }),
      )}
      style={
        {
          "--underline-color": "var(--color-footer-text)",
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "flex h-fit flex-col gap-6 px-4 pb-10 pt-6 md:gap-10 md:px-6 md:py-10 lg:gap-8 lg:px-0 lg:py-16",
          variants({ width: footerWidth }),
        )}
      >
        <div className="flex flex-col justify-center gap-4 md:flex-row md:gap-4 lg:gap-10">
          <div className="flex w-full flex-col items-start gap-6 border-b border-foreground pb-6 md:h-fit md:border-none md:pb-0">
            {newsletterTitle && (
              <Tag className="font-semibold">{newsletterTitle}</Tag>
            )}
            <div className="flex w-fit flex-col gap-4 md:h-fit">
              {newsletterDescription && <p>{newsletterDescription}</p>}
              {newsletterButtonText && (
                <fetcher.Form
                  method="POST"
                  action="/api/customer"
                  className="flex gap-2"
                >
                  <Input
                    className="bg-transparent"
                    type="email"
                    name="email"
                    placeholder={newsletterPlaceholder}
                    required
                  />
                  <Button
                    loading={fetcher.state === "submitting"}
                    type="submit"
                  >
                    {newsletterButtonText}
                  </Button>
                </fetcher.Form>
              )}
              {isError && (
                <p className="!mt-1 text-xs text-red-700">
                  {fetcher.data.errors[0].message}
                </p>
              )}
            </div>
          </div>
          {footerMenu && <FooterMenu menu={footerMenu} />}
        </div>
        <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <CountrySelector />
          <p className="text-xs">{footerTextCopyright}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterMenu({ menu }: { menu: EnhancedMenu | undefined | null }) {
  let items = menu?.items as unknown as SingleMenuItem[];
  if (!items) return null;
  return (
    <div className="w-full">
      <nav
        className="flex flex-col justify-between gap-4 md:flex-row md:gap-0"
        role="navigation"
      >
        {items.map((item, id) => {
          let { title, ...rest } = item;
          let level = getMaxDepth(item);
          let Comp: React.FC<SingleMenuItem>;
          if (level === 2) {
            Comp = MenuLink;
          } else if (level === 1) {
            Comp = HeaderText;
          } else {
            return null;
          }
          return <Comp key={id} {...rest} title={title} />;
        })}
      </nav>
    </div>
  );
}

function MenuLink(props: SingleMenuItem) {
  let { title, items, to } = props;
  const settings = useThemeSettings();
  let { tagNameTitle: Tag = "h6" } = settings || {};
  return (
    <>
      <div className="hidden flex-col gap-6 md:flex">
        <Tag className="font-semibold uppercase">{title}</Tag>
        <ul className="space-y-1.5">
          {items.map((subItem, ind) => (
            <li key={ind} className="leading-6">
              <NavLink to={subItem.to} prefetch="intent">
                <span className="text-animation font-body font-normal">
                  {subItem.title}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="block border-b border-foreground pb-4 md:hidden">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="w-full text-left">
                <Tag className="flex justify-between font-semibold uppercase">
                  {title}
                  <span>
                    <IconPlusLinkFooter
                      open={open}
                      className={`trasition-transform h-5 w-5 duration-300 ${
                        open ? "rotate-90" : "rotate-0"
                      }`}
                    />
                  </span>
                </Tag>
              </Disclosure.Button>
              <div
                className={`${
                  open ? `h-fit max-h-48` : `max-h-0`
                } overflow-hidden transition-all duration-300`}
              >
                <Disclosure.Panel static>
                  <ul className="space-y-3 pb-3 pt-2">
                    {items.map((subItem, ind) => (
                      <li key={ind} className="leading-6">
                        <NavLink key={ind} to={subItem.to} prefetch="intent">
                          <span className="font-body font-normal">
                            {subItem.title}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              </div>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}

function HeaderText({ title, to }: { title: string; to: string }) {
  const settings = useThemeSettings();
  let { tagNameTitle: Tag = "h6" } = settings || {};
  return <Tag className="font-semibold uppercase">{title}</Tag>;
}
