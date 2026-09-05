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
    let menuItems = menu.items as unknown as SingleMenuItem[];
    return (
      <Menubar.Root
        asChild
        value={value ?? ""}
        onValueChange={setValue}
        onMouseLeave={() => setValue(null)}
      >
        <nav className="z-30 hidden h-full grow items-center justify-center gap-9 md:flex">
          {menuItems.map((menuItem) => {
            let { id, items = [], title, to } = menuItem;
            let level = getMaxDepth(menuItem);
            let hasSubmenu = level > 1;
            let isJournal = title.trim().toLowerCase() === "journal";
            let isDropdown =
              !isJournal &&
              level === 2 &&
              items.every(
                ({ resource }) =>
                  !resource?.image && !resource?.articles?.nodes.length,
              );
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
                    ) : isJournal ? (
                      <JournalMenu items={items} />
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
  const blogItems = items.filter((item) => item.resource?.articles);
  const collectionItems = items.filter((item) => item.resource?.products);

  if (blogItems.length) {
    return <JournalMenu items={blogItems} />;
  }

  if (collectionItems.length) {
    const featuredCollection = collectionItems.find(
      (item) => item.resource?.image,
    );

    return (
      <div className="mx-auto flex min-h-70 w-full max-w-lg justify-center">
        <div className="grid min-w-0 flex-1 grid-cols-3">
          {collectionItems.map(({ id, title, to, resource }, idx) => (
            <SlideIn
              key={id}
              className="border-border-subtle border-r px-6 py-2 first:border-l"
              style={{ "--idx": idx } as React.CSSProperties}
            >
              <Link
                to={to}
                prefetch="intent"
                className="line-clamp-1 w-fit border-foreground border-b pb-2 font-heading text-base uppercase"
              >
                {resource?.title || title}
              </Link>
              <div className="mt-3 flex flex-col gap-2">
                {resource?.products?.nodes.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.handle}`}
                    prefetch="intent"
                    className="block w-full truncate text-sm transition-none"
                  >
                    {product.title}
                  </Link>
                ))}
              </div>
            </SlideIn>
          ))}
        </div>

        {featuredCollection?.resource?.image && (
          <SlideIn
            className="flex w-80 shrink-0 items-start justify-center px-10 py-2"
            style={{ "--idx": collectionItems.length } as React.CSSProperties}
          >
            <Link
              to={featuredCollection.to}
              prefetch="intent"
              className="group/featured relative block aspect-[226/248] w-full max-w-56 overflow-hidden rounded-xl"
            >
              <Image
                sizes="224px"
                data={featuredCollection.resource.image}
                className="h-full w-full object-cover transition-transform duration-300 group-hover/featured:scale-[1.03]"
                width={280}
              />
              <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover/featured:bg-black/40" />
              <p className="absolute inset-x-5 top-1/2 line-clamp-1 -translate-y-1/2 text-center font-heading text-xl text-white underline-offset-4 group-hover/featured:underline">
                {featuredCollection.resource.title || featuredCollection.title}
              </p>
            </Link>
          </SlideIn>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto flex justify-center gap-4">
      {items.map(({ id, title, to, items: children, resource }, idx) =>
        resource?.image && children.length === 0 ? (
          <SlideIn
            key={id}
            className="group/item w-60 max-w-60 grow overflow-hidden rounded-xl bg-background-subtle-1"
            style={{ "--idx": idx } as React.CSSProperties}
          >
            <Link to={to} prefetch="intent" className="block">
              <div className="relative aspect-[242/188] overflow-hidden">
                <Image
                  sizes="(min-width: 768px) 240px, 50vw"
                  data={resource.image}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover/item:scale-[1.03]"
                  width={300}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <p className="absolute line-clamp-1 right-3 bottom-3 left-3 font-heading text-base text-white">
                  {resource.title || title}
                </p>
              </div>
              <div className="flex min-h-16 flex-col gap-1 px-3 py-3">
                {resource.collections?.nodes[0]?.title && (
                  <p className="text-sm text-text-subtle">
                    {resource.collections.nodes[0].title}
                  </p>
                )}
                {resource.description && (
                  <p className="line-clamp-2 text-[11px] leading-relaxed text-text">
                    {resource.description}
                  </p>
                )}
              </div>
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

function JournalMenu({ items }: { items: SingleMenuItem[] }) {
  const blogs = items
    .map((item) => {
      if (item.resource?.articles) {
        return {
          id: item.id,
          title: item.resource.title || item.title,
          to: item.to,
          articles: item.resource.articles.nodes,
        };
      }
      if (item.resource?.blog) {
        return {
          id: item.resource.blog.handle,
          title: item.resource.blog.title,
          to: `/blogs/${item.resource.blog.handle}`,
          articles: item.resource.blog.articles.nodes,
        };
      }
      return null;
    })
    .filter((blog): blog is NonNullable<typeof blog> => Boolean(blog))
    .filter(
      (blog, index, allBlogs) =>
        allBlogs.findIndex((candidate) => candidate.to === blog.to) === index,
    );
  const [activeId, setActiveId] = useState(blogs[0]?.id ?? "");
  const activeBlog = blogs.find((blog) => blog.id === activeId) ?? blogs[0];
  const articleCards = (activeBlog?.articles ?? []).map((article) => ({
    ...article,
    to: `${activeBlog.to.replace(/\/$/, "")}/${article.handle}`,
  }));

  return (
    <div className="mx-auto grid min-h-76 w-full max-w-lg grid-cols-[250px_minmax(0,1fr)]">
      <div className="border-border-subtle flex flex-col gap-2 border-r px-4 py-1">
        {blogs.map((blog) => {
          const isActive = blog.id === activeBlog?.id;
          return (
            <Link
              key={blog.id}
              to={blog.to}
              prefetch="intent"
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 font-heading text-sm uppercase transition-colors",
                isActive && "bg-background-subtle-2",
              )}
              onMouseEnter={() => setActiveId(blog.id)}
              onFocus={() => setActiveId(blog.id)}
            >
              <span className="line-clamp-1">{blog.title}</span>
              <IconCaret direction="right" className="size-4 shrink-0" />
            </Link>
          );
        })}
      </div>

      <div className="grid content-start grid-cols-3 gap-4 px-5 py-1">
        {articleCards.slice(0, 6).map((article, idx) => (
          <SlideIn
            key={article.id}
            className="min-w-0"
            style={{ "--idx": idx } as React.CSSProperties}
          >
            <Link
              to={article.to}
              prefetch="intent"
              className="group/article relative block aspect-[236/132] overflow-hidden rounded-lg bg-background-subtle-2"
            >
              {article.image && (
                <Image
                  data={article.image}
                  sizes="(min-width: 768px) 236px, 50vw"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover/article:scale-[1.03]"
                  width={300}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <p className="absolute right-3 bottom-3 left-3 line-clamp-1 font-heading text-base text-white underline-offset-4 group-hover/article:underline">
                {article.title}
              </p>
            </Link>
          </SlideIn>
        ))}
      </div>
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
