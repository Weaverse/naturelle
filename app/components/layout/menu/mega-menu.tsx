import * as Menubar from "@radix-ui/react-menubar";
import { useThemeSettings } from "@weaverse/hydrogen";
import clsx from "clsx";
import type React from "react";
import { useState } from "react";
import { IconCaret } from "~/components/icon";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import {
  type EnhancedMenu,
  getMaxDepth,
  type SingleMenuItem,
} from "~/types/menu";
import { cn } from "~/utils/cn";

export function MegaMenu(props: { menu: EnhancedMenu | null | undefined }) {
  let { menu } = props;
  let { typeOpenMenu } = useThemeSettings();
  let [value, setValue] = useState<string | null>(null);

  if (menu?.items?.length) {
    let items = menu.items as unknown as SingleMenuItem[];
    return (
      <Menubar.Root
        asChild
        value={value ?? ""}
        onValueChange={setValue}
        onMouseLeave={() => setValue(null)}
      >
        <nav className="z-30 hidden h-full grow items-center justify-center gap-9 md:flex">
          {items.map((menuItem) => {
            let { id, items = [], title, to } = menuItem;
            let level = getMaxDepth(menuItem);
            let hasSubmenu = level > 1;
            let isDropdown =
              level === 2 && items.every(({ resource }) => !resource?.image);
            return (
              <Menubar.Menu key={id} value={id}>
                <Menubar.Trigger
                  asChild={!hasSubmenu}
                  className={clsx([
                    "flex h-full cursor-pointer items-center gap-1 px-0 py-2",
                    "text-base font-semibold leading-[1.6] tracking-[-0.16px] focus:outline-none",
                  ])}
                  onMouseEnter={() => {
                    if (typeOpenMenu === "mouseHover" && value !== id) {
                      setValue(id);
                    }
                  }}
                >
                  {hasSubmenu ? (
                    <>
                      <span className="text-animation">{title}</span>
                      <IconCaret direction="down" className="size-4" />
                    </>
                  ) : (
                    <Link
                      to={to}
                      className={({ isActive }) =>
                        cn(
                          "text-animation transition-none",
                          isActive && "is-active",
                        )
                      }
                    >
                      <span>{title}</span>
                    </Link>
                  )}
                </Menubar.Trigger>
                {level > 1 && (
                  <Menubar.Content
                    className={cn([
                      "px-3 md:px-4 lg:px-6",
                      "bg-header-bg shadow-md border-t border-border-subtle mt-1.5",
                      isDropdown ? "py-6" : "w-screen py-8",
                    ])}
                  >
                    {isDropdown ? (
                      <DropdownSubMenu items={items} />
                    ) : (
                      <LayoutMenu items={items} />
                    )}
                  </Menubar.Content>
                )}
              </Menubar.Menu>
            );
          })}
        </nav>
      </Menubar.Root>
    );
  }
  return null;
}

function DropdownSubMenu({ items }: { items: SingleMenuItem[] }) {
  return (
    <ul
      className="space-y-1.5 animate-fade-in"
      style={{ "--fade-in-duration": "150ms" } as React.CSSProperties}
    >
      {items.map(({ id, to, title }) => (
        <li key={id}>
          <Link
            to={to}
            prefetch="intent"
            className={({ isActive }) =>
              cn("block transition-none", isActive && "is-active")
            }
          >
            <span className="text-animation line-clamp-2">{title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function LayoutMenu({ items }: { items: SingleMenuItem[] }) {
  return (
    <div className="container mx-auto flex justify-center gap-4">
      {items.map(({ id, title, to, items: children, resource }, idx) =>
        resource?.image && children.length === 0 ? (
          <SlideIn
            key={id}
            className="group/item relative aspect-square w-72 max-w-72 grow overflow-hidden rounded-md"
            style={{ "--idx": idx } as React.CSSProperties}
          >
            <Image
              sizes="auto"
              data={resource.image}
              className="rounded-md object-cover transition-transform duration-300 group-hover/item:scale-[1.03]"
              width={300}
            />
            <Link
              to={to}
              prefetch="intent"
              className={clsx([
                "absolute inset-0 p-2 flex items-center justify-center text-center",
                "bg-[#5546124D]/20 group-hover/item:bg-[#5546124D]/40 group-hover/item:underline",
                "h6 text-text-inverse font-medium transition-all duration-300 cursor-pointer",
              ])}
            >
              {title}
            </Link>
          </SlideIn>
        ) : (
          <SlideIn
            key={id}
            className="grow max-w-72 space-y-4"
            style={{ "--idx": idx } as React.CSSProperties}
          >
            <Link
              to={to}
              prefetch="intent"
              className={({ isActive }) =>
                cn(
                  "text-animation inline uppercase transition-none",
                  isActive && "is-active",
                )
              }
            >
              <span className="text-animation font-semibold text-xl font-heading">
                {title}
              </span>
            </Link>
            <div className="flex flex-col gap-1.5">
              {children.map((cItem) => (
                <Link
                  key={cItem.id}
                  to={cItem.to}
                  prefetch="intent"
                  className={({ isActive }) =>
                    cn(
                      "text-animation relative inline transition-none",
                      isActive && "is-active",
                    )
                  }
                >
                  <span className="text-animation">{cItem.title}</span>
                </Link>
              ))}
            </div>
          </SlideIn>
        ),
      )}
    </div>
  );
}

function SlideIn(props: {
  className?: string;
  children: React.ReactNode;
  style: React.CSSProperties;
}) {
  let { className, children, style } = props;
  return (
    <div
      className={cn(
        "opacity-0 animate-slide-left [animation-delay:calc(var(--idx)*0.1s+0.1s)]",
        className,
      )}
      style={
        {
          "--slide-left-from": "40px",
          "--slide-left-duration": "400ms",
          ...style,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
