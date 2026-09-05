import { Disclosure } from "@headlessui/react";
import clsx from "clsx";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import {
  type EnhancedMenu,
  getMaxDepth,
  type SingleMenuItem,
} from "~/types/menu";
import { Drawer, useDrawer } from "../../drawer";
import { IconCaret, IconListMenu } from "../../icon";
import { SearchToggle } from "../search-toggle";

export function HeaderMenuDrawer({
  menu,
  className,
}: {
  menu?: EnhancedMenu | null | undefined;
  className?: string;
}) {
  let { isOpen: showMenu, openDrawer, closeDrawer } = useDrawer();
  return (
    <nav
      className={clsx(
        "z-30 flex h-12.5 min-w-0 flex-1 flex-col items-start gap-2.5 py-2",
        className,
      )}
    >
      <div className="flex h-12.5 self-stretch items-center gap-3">
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-6 shrink-0 items-center justify-center text-left"
          onClick={openDrawer}
        >
          <IconListMenu className="size-6" />
        </button>
        <SearchToggle isOpenDrawerHearder={true} className="md:hidden" />
        <Drawer
          open={showMenu}
          onClose={closeDrawer}
          openFrom="left"
          heading="MENU"
          isForm="menu"
        >
          <DrawerMenu menu={menu} closeDrawer={closeDrawer} />
        </Drawer>
      </div>
    </nav>
  );
}

function DrawerMenu({
  menu,
  closeDrawer,
}: {
  menu: EnhancedMenu | null | undefined;
  closeDrawer: () => void;
}) {
  let items = menu?.items as unknown as SingleMenuItem[];
  return (
    <nav className="grid text-text-subtle overflow-auto border-t border-border-subtle px-6 pb-16 pt-8">
      {items.map((item, id) => {
        let { title, ...rest } = item;
        let level = getMaxDepth(item);
        let isCollectionMenu =
          item.items.length &&
          item.items.some((childItem) => childItem.resource?.products);
        let isBrandMenu =
          item.title.trim().toLowerCase() === "brands" &&
          item.items.length > 0 &&
          item.items.every((childItem) => childItem.resource?.image);
        let isJournalMenu = item.title.trim().toLowerCase() === "journal";
        let Comp: React.FC<SingleMenuItem & { closeDrawer: () => void }> =
          isCollectionMenu
            ? CollectionMenu
            : isBrandMenu
              ? BrandMenu
              : isJournalMenu
                ? JournalDrawerMenu
                : level > 2
                  ? MultiMenu
                  : level === 2
                    ? SingleMenu
                    : ItemHeader;
        return (
          <Comp key={id} title={title} closeDrawer={closeDrawer} {...rest} />
        );
      })}
    </nav>
  );
}

function ItemHeader({
  title,
  to,
  closeDrawer,
}: {
  title: string;
  to: string;
  closeDrawer: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={closeDrawer}
      className={({ isActive }) =>
        clsx(
          "flex items-center justify-between py-3",
          isActive && "text-text-primary",
          isActive && title.trim().toLowerCase() !== "home" && "underline",
        )
      }
    >
      <h5 className="font-medium text-xl uppercase hover:text-text-primary">
        {title}
      </h5>
    </Link>
  );
}

function MultiMenu(props: SingleMenuItem & { closeDrawer: () => void }) {
  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();
  let { title, items, to, closeDrawer } = props;
  const handleCloseAll = () => {
    closeMenu();
    closeDrawer();
  };
  let content = (
    <Drawer
      open={isMenuOpen}
      onClose={closeMenu}
      openFrom="left"
      heading={title}
      isForm="menu"
      isBackMenu
      // bordered
    >
      <div className="grid overflow-auto px-6 pb-16 pt-8 border-t border-border-subtle">
        {items.map((item, id) => (
          <div key={id}>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="w-full text-left">
                    <h5 className="flex w-full text-xl justify-between py-3 font-medium uppercase text-text-subtle hover:text-text-primary">
                      {item.items.length > 0 ? (
                        <span>{item.title}</span>
                      ) : (
                        <Link
                          to={item.to}
                          prefetch="intent"
                          onClick={handleCloseAll}
                          className={({ isActive }) =>
                            isActive ? "text-text-primary underline" : undefined
                          }
                        >
                          {item.title}
                        </Link>
                      )}
                      {item.items.length > 0 && (
                        <span className="">
                          <IconCaret
                            className="h-4 w-4"
                            direction={open ? "down" : "right"}
                          />
                        </span>
                      )}
                    </h5>
                  </Disclosure.Button>
                  {item?.items?.length > 0 ? (
                    <div
                      className={`${
                        open ? `h-fit max-h-48` : `max-h-0`
                      } overflow-hidden transition-all duration-300`}
                    >
                      <Disclosure.Panel static>
                        <ul className="space-y-3 pb-3 pt-2">
                          {item.items.map((subItem, ind) => (
                            <li key={ind} className="leading-6">
                              <Link
                                key={ind}
                                to={subItem.to}
                                onClick={handleCloseAll}
                                prefetch="intent"
                                className={({ isActive }) =>
                                  isActive
                                    ? "text-text-primary underline"
                                    : "text-text-subtle"
                                }
                              >
                                <span className="font-body hover:text-text-primary text-base font-normal">
                                  {subItem.title}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </Disclosure.Panel>
                    </div>
                  ) : null}
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Drawer>
  );
  return (
    <div className="">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left hover:text-text-primary"
        onClick={openMenu}
      >
        <h5 className="font-medium text-xl uppercase">{title}</h5>
        <IconCaret direction="right" className="h-4 w-4" />
      </button>
      {content}
    </div>
  );
}

function CollectionMenu({
  title,
  items,
  closeDrawer,
}: SingleMenuItem & { closeDrawer: () => void }) {
  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();
  const handleCloseAll = () => {
    closeMenu();
    closeDrawer();
  };
  const collectionItems = items.filter(
    (item) => item.title.trim().toLowerCase() !== "all collections",
  );
  let content = (
    <Drawer
      open={isMenuOpen}
      onClose={closeMenu}
      openFrom="left"
      heading={title}
      isForm="menu"
      isBackMenu
      // bordered
    >
      <div className="grid overflow-auto border-t border-border-subtle px-6 pt-5 pb-16">
        {collectionItems.map((item) => (
          <Disclosure key={item.id}>
            {({ open }) => {
              const products = item.resource?.products?.nodes ?? [];
              return (
                <div>
                  {products.length > 0 ? (
                    <Disclosure.Button className="flex w-full items-center justify-between py-3 text-left font-heading text-base uppercase text-text-subtle hover:text-text-primary">
                      <span>{item.resource?.title || item.title}</span>
                      <IconCaret
                        className="size-4 shrink-0"
                        direction={open ? "down" : "right"}
                      />
                    </Disclosure.Button>
                  ) : (
                    <Link
                      to={item.to}
                      prefetch="intent"
                      onClick={handleCloseAll}
                      className="block py-3 font-heading text-base uppercase text-text-subtle hover:text-text-primary"
                    >
                      {item.resource?.title || item.title}
                    </Link>
                  )}
                  {products.length > 0 && (
                    <Disclosure.Panel>
                      <ul className="space-y-2 pb-3">
                        {products.map((product) => (
                          <li key={product.id}>
                            <Link
                              to={`/products/${product.handle}`}
                              prefetch="intent"
                              onClick={handleCloseAll}
                              className="block text-sm text-text-subtle hover:text-text-primary"
                            >
                              {product.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Disclosure.Panel>
                  )}
                </div>
              );
            }}
          </Disclosure>
        ))}
      </div>
    </Drawer>
  );
  return (
    <div className="">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left hover:text-text-primary"
        onClick={openMenu}
      >
        <h5 className="font-medium text-xl uppercase">{title}</h5>
        <IconCaret direction="right" className="h-4 w-4" />
      </button>
      {content}
    </div>
  );
}

function BrandMenu({
  title,
  items,
  closeDrawer,
}: SingleMenuItem & { closeDrawer: () => void }) {
  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();
  const handleCloseAll = () => {
    closeMenu();
    closeDrawer();
  };
  const uniqueItems = items.filter(
    (item, index, allItems) =>
      allItems.findIndex(
        (candidate) => candidate.to === item.to || candidate.id === item.id,
      ) === index,
  );
  const content = (
    <Drawer
      open={isMenuOpen}
      onClose={closeMenu}
      openFrom="left"
      heading={title}
      isForm="menu"
      isBackMenu
    >
      <div className="grid grid-cols-1 overflow-auto border-t border-border-subtle px-6 pt-5 pb-16">
        {uniqueItems.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            prefetch="intent"
            onClick={handleCloseAll}
            className="group/brand relative mb-3 block h-[188px] max-h-[188px] w-full shrink-0 overflow-hidden rounded-xl bg-background-subtle-1 last:mb-0"
          >
            <Image
              data={item.resource?.image}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover/brand:scale-[1.03]"
              width={600}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <span className="absolute right-3 bottom-3 left-3 line-clamp-1 font-heading text-base text-white">
              {item.resource?.title || item.title}
            </span>
          </Link>
        ))}
      </div>
    </Drawer>
  );

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left hover:text-text-primary"
        onClick={openMenu}
      >
        <h5 className="font-medium text-xl uppercase">{title}</h5>
        <IconCaret direction="right" className="size-4" />
      </button>
      {content}
    </div>
  );
}

function JournalDrawerMenu({
  title,
  items,
  closeDrawer,
}: SingleMenuItem & { closeDrawer: () => void }) {
  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();
  const handleCloseAll = () => {
    closeMenu();
    closeDrawer();
  };
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

  const content = (
    <Drawer
      open={isMenuOpen}
      onClose={closeMenu}
      openFrom="left"
      heading={title}
      isForm="menu"
      isBackMenu
    >
      <div className="grid overflow-auto border-t border-border-subtle px-6 pt-5 pb-16">
        {blogs.map((blog) => (
          <Disclosure key={blog.id}>
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full items-center justify-between py-3 text-left font-heading text-base uppercase text-text-subtle hover:text-text-primary">
                  <span className="line-clamp-1">{blog.title}</span>
                  <IconCaret
                    className="size-4 shrink-0"
                    direction={open ? "down" : "right"}
                  />
                </Disclosure.Button>
                <Disclosure.Panel>
                  <ul className="space-y-2 pb-3">
                    {blog.articles.map((article) => (
                      <li key={article.id}>
                        <Link
                          to={`${blog.to.replace(/\/$/, "")}/${article.handle}`}
                          prefetch="intent"
                          onClick={handleCloseAll}
                          className="block text-sm text-text-subtle hover:text-text-primary"
                        >
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </Drawer>
  );

  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left hover:text-text-primary"
        onClick={openMenu}
      >
        <h5 className="font-medium text-xl uppercase">{title}</h5>
        <IconCaret direction="right" className="size-4" />
      </button>
      {content}
    </div>
  );
}

function SingleMenu(props: SingleMenuItem & { closeDrawer: () => void }) {
  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();
  let { title, items, to, closeDrawer } = props;
  const handleCloseAll = () => {
    closeMenu();
    closeDrawer();
  };
  let content = (
    <Drawer
      open={isMenuOpen}
      onClose={closeMenu}
      openFrom="left"
      heading={title}
      isForm="menu"
      isBackMenu
      // bordered
    >
      <div className="grid overflow-auto px-6 pb-16 pt-8 border-t border-border-subtle">
        <ul className="space-y-3 pb-3 pt-2">
          {items.map((subItem, ind) => (
            <li key={ind} className="leading-6" onClick={handleCloseAll}>
              <Link
                key={ind}
                to={subItem.to}
                prefetch="intent"
                className={({ isActive }) =>
                  isActive ? "text-text-primary underline" : "text-text-subtle"
                }
              >
                <span className="font-body hover:text-text-primary text-base font-normal">
                  {subItem.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Drawer>
  );
  return (
    <div className="">
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-left hover:text-text-primary"
        onClick={openMenu}
      >
        <h5 className="font-medium text-xl uppercase">{title}</h5>
        <IconCaret direction="right" className="h-4 w-4" />
      </button>
      {content}
    </div>
  );
}
