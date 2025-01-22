import { Link } from "@remix-run/react";
import { Image } from "@shopify/hydrogen";
import * as Menubar from "@radix-ui/react-menubar";
import { cn } from "~/lib/utils";
import clsx from "clsx";
import React, { useState } from "react";
import { useThemeSettings } from "@weaverse/hydrogen";
import { EnhancedMenu, getMaxDepth, SingleMenuItem } from "~/lib/types/menu";

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
        <nav className="hidden lg:flex grow justify-center h-full z-30">
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
                    "cursor-pointer px-3 py-2 h-full flex items-center gap-1.5",
                    "focus:outline-none uppercase",
                  ])}
                  onMouseEnter={() => {
                    if (typeOpenMenu === "mouseHover" && value !== id) {
                      setValue(id);
                    }
                  }}
                >
                  {hasSubmenu ? (
                    <>
                      <span className='text-animation'>{title}</span>
                    </>
                  ) : (
                    <Link to={to} className="transition-none">
                      <span className="text-animation">{title}</span>
                    </Link>
                  )}
                </Menubar.Trigger>
                {level > 1 && (
                  <Menubar.Content
                    className={cn([
                      "px-3 md:px-4 lg:px-6",
                      "bg-[--color-header-bg] shadow-md border-t border-border-subtle mt-1.5",
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
        <Link
          key={id}
          to={to}
          prefetch="intent"
          className="transition-none block"
        >
          <span className="text-animation line-clamp-2">{title}</span>
        </Link>
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
            className="grow max-w-72 w-72 aspect-square relative group/item overflow-hidden rounded"
            style={{ "--idx": idx } as React.CSSProperties}
          >
            <Image
              sizes="auto"
              data={resource.image}
              className="group-hover/item:scale-[1.03] transition-transform duration-300 rounded object-cover"
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
              className="uppercase inline transition-none"
            >
              <span className="text-animation font-semibold text-xl font-heading">{title}</span>
            </Link>
            <div className="flex flex-col gap-1.5">
              {children.map((cItem) => (
                <Link
                  key={cItem.id}
                  to={cItem.to}
                  prefetch="intent"
                  className="relative inline transition-none"
                >
                  <span className="text-animation">{cItem.title}</span>
                </Link>
              ))}
            </div>
          </SlideIn>
        )
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
        className
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
