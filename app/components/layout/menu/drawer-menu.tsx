import { Disclosure } from "@headlessui/react";
import { useTranslation } from "@weaverse/hydrogen";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import {
  type EnhancedMenu,
  getMaxDepth,
  type SingleMenuItem,
} from "~/types/menu";
import { cn } from "~/utils/cn";
import { Drawer, useDrawer } from "../../drawer";
import { IconCaret, IconListMenu } from "../../icon";
import { SearchToggle } from "../search-toggle";

const headingClass =
  "font-heading text-xl leading-[150%] font-normal tracking-[-0.2px] text-text-subtle uppercase hover:text-text-primary";
const layoutClass =
  "overflow-auto border-t border-border-subtle px-6 pt-8 pb-16";
type MenuType = "brand" | "collection" | "multi" | "single" | "link";

const mobileContentVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

function menuType(item: SingleMenuItem): MenuType {
  const level = getMaxDepth(item);
  if (item.items.some((child) => child.resource?.__typename === "Collection")) {
    return "collection";
  }
  if (
    item.items.length &&
    item.items.every(
      (child) =>
        child.resource?.image && child.resource.__typename !== "Collection",
    )
  ) {
    return "brand";
  }
  if (level > 2) {
    return "multi";
  }
  if (level === 2) {
    return "single";
  }
  return "link";
}

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 60rem)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop;
}

export function HeaderMenuDrawer({
  menu,
  className,
}: {
  menu?: EnhancedMenu | null;
  className?: string;
}) {
  const { t } = useTranslation();
  const { isOpen, openDrawer, closeDrawer } = useDrawer();
  const desktop = useDesktop();
  const [active, setActive] = useState<SingleMenuItem | null>(null);
  const [direction, setDirection] = useState(1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset only when crossing into the desktop layout
  useEffect(() => {
    if (desktop) {
      setActive(null);
      setDirection(1);
      closeDrawer();
    }
  }, [desktop]);

  const close = () => {
    setActive(null);
    closeDrawer();
  };
  const back = () => {
    setDirection(-1);
    setActive(null);
  };

  return (
    <nav
      className={cn(
        "z-30 flex h-full min-w-0 flex-1 flex-col items-start",
        className,
      )}
    >
      <div className="flex h-full self-stretch items-center gap-3">
        <button
          type="button"
          aria-label={t("accessibility.openMenu")}
          className="flex size-6 shrink-0 items-center justify-center text-left"
          onClick={() => {
            setActive(null);
            setDirection(1);
            openDrawer();
          }}
        >
          <IconListMenu className="size-6" />
        </button>
        <SearchToggle isOpenDrawerHearder className="desktop:hidden" />
        <Drawer
          open={isOpen}
          onClose={close}
          onBack={back}
          openFrom="left"
          heading={!desktop && active ? active.title : t("navigation.menu")}
          isForm="menu"
          isBackMenu={!desktop && Boolean(active)}
        >
          {desktop ? (
            <DesktopMenu menu={menu} closeDrawer={close} />
          ) : (
            <MobileMenu
              menu={menu}
              active={active}
              direction={direction}
              closeDrawer={close}
              openMenu={(item) => {
                setDirection(1);
                setActive(item);
              }}
            />
          )}
        </Drawer>
      </div>
    </nav>
  );
}

function DesktopMenu({
  menu,
  closeDrawer,
}: {
  menu?: EnhancedMenu | null;
  closeDrawer: () => void;
}) {
  const items = (menu?.items as unknown as SingleMenuItem[]) ?? [];
  return (
    <nav className={cn("flex flex-col gap-5 text-text-subtle", layoutClass)}>
      {items.map((item) =>
        menuType(item) === "link" ? (
          <MenuLink key={item.id} item={item} closeDrawer={closeDrawer} />
        ) : (
          <DesktopSubmenu key={item.id} item={item} closeDrawer={closeDrawer} />
        ),
      )}
    </nav>
  );
}

function DesktopSubmenu({
  item,
  closeDrawer,
}: {
  item: SingleMenuItem;
  closeDrawer: () => void;
}) {
  const { isOpen, openDrawer, closeDrawer: closeSubmenu } = useDrawer();
  const type = menuType(item);
  const desktopLayoutClass = cn(
    "overflow-auto border-t border-border-subtle px-6 pb-16",
    type === "collection" || type === "brand" ? "pt-5" : "pt-8",
  );
  const closeAll = () => {
    closeSubmenu();
    closeDrawer();
  };
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={openDrawer}
      >
        <span className={headingClass}>{item.title}</span>
        <IconCaret direction="right" className="size-4" />
      </button>
      <Drawer
        open={isOpen}
        onClose={closeSubmenu}
        openFrom="left"
        heading={item.title}
        isForm="menu"
        isBackMenu
      >
        <div className={desktopLayoutClass}>
          <MenuContent item={item} onNavigate={closeAll} desktop />
        </div>
      </Drawer>
    </div>
  );
}

function MobileMenu({
  menu,
  active,
  direction,
  closeDrawer,
  openMenu,
}: {
  menu?: EnhancedMenu | null;
  active: SingleMenuItem | null;
  direction: number;
  closeDrawer: () => void;
  openMenu: (item: SingleMenuItem) => void;
}) {
  const items = (menu?.items as unknown as SingleMenuItem[]) ?? [];
  return (
    <nav className={layoutClass}>
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          key={active?.id ?? "main-menu"}
          custom={direction}
          variants={mobileContentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {active ? (
            <MenuContent item={active} onNavigate={closeDrawer} />
          ) : (
            <div className="flex flex-col gap-5 text-text-subtle">
              {items.map((item) =>
                menuType(item) === "link" ? (
                  <MenuLink
                    key={item.id}
                    item={item}
                    closeDrawer={closeDrawer}
                  />
                ) : (
                  <button
                    key={item.id}
                    type="button"
                    className="flex w-full items-center justify-between text-left"
                    onClick={() => openMenu(item)}
                  >
                    <span className={headingClass}>{item.title}</span>
                    <IconCaret direction="right" className="size-4" />
                  </button>
                ),
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </nav>
  );
}

function MenuLink({
  item,
  closeDrawer,
}: {
  item: SingleMenuItem;
  closeDrawer: () => void;
}) {
  return (
    <Link
      to={item.to}
      onClick={closeDrawer}
      className={({ isActive }) =>
        cn(
          "flex items-center justify-between",
          headingClass,
          isActive && "text-text-primary",
          isActive && item.to !== "/" && "underline",
        )
      }
    >
      {item.title}
    </Link>
  );
}

function MenuContent({
  item,
  onNavigate,
  desktop = false,
}: {
  item: SingleMenuItem;
  onNavigate: () => void;
  desktop?: boolean;
}) {
  const type = menuType(item);
  if (type === "collection") {
    return <CollectionContent items={item.items} onNavigate={onNavigate} />;
  }
  if (type === "brand") {
    return <BrandContent items={item.items} onNavigate={onNavigate} />;
  }
  if (type === "multi") {
    return <MultiContent items={item.items} onNavigate={onNavigate} />;
  }
  return (
    <SingleContent
      items={item.items}
      onNavigate={onNavigate}
      desktop={desktop}
    />
  );
}

function MultiContent({
  items,
  onNavigate,
}: {
  items: SingleMenuItem[];
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {items.map((item) => (
        <Disclosure key={item.id}>
          {({ open }) => (
            <div>
              <Disclosure.Button className="w-full text-left">
                <div className="flex w-full justify-between">
                  {item.items.length ? (
                    <span className={headingClass}>{item.title}</span>
                  ) : (
                    <Link
                      to={item.to}
                      prefetch="intent"
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        cn(
                          "font-heading text-base uppercase text-text-subtle hover:text-text-primary",
                          isActive && "text-text-primary underline",
                        )
                      }
                    >
                      {item.title}
                    </Link>
                  )}
                  {item.items.length ? (
                    <IconCaret
                      className="size-4"
                      direction={open ? "down" : "right"}
                    />
                  ) : null}
                </div>
              </Disclosure.Button>
              {item.items.length ? (
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <Disclosure.Panel static>
                      <ul className="flex flex-col gap-4 pt-5 desktop:max-h-48 desktop:overflow-y-auto">
                        {item.items.map((subItem) => (
                          <li key={subItem.id} className="leading-6">
                            <Link
                              to={subItem.to}
                              onClick={onNavigate}
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
                </div>
              ) : null}
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}

function CollectionContent({
  items,
  onNavigate,
}: {
  items: SingleMenuItem[];
  onNavigate: () => void;
}) {
  const collections = items.filter(
    (item) => item.resource?.__typename === "Collection",
  );
  return (
    <div className="flex flex-col gap-5">
      {collections.map((item) => (
        <Disclosure key={item.id}>
          {({ open }) => (
            <div>
              {item.items.length ? (
                <Disclosure.Button className="flex w-full items-center justify-between text-left">
                  <span className={headingClass}>
                    {item.resource?.title || item.title}
                  </span>
                  <IconCaret
                    className="size-4 shrink-0"
                    direction={open ? "down" : "right"}
                  />
                </Disclosure.Button>
              ) : (
                <Link
                  to={item.to}
                  prefetch="intent"
                  onClick={onNavigate}
                  className="block font-heading text-base uppercase text-text-subtle hover:text-text-primary"
                >
                  {item.resource?.title || item.title}
                </Link>
              )}
              {item.items.length ? (
                <Disclosure.Panel>
                  <ul className="flex flex-col gap-4 pt-5">
                    {item.items.map((product) => (
                      <li key={product.id}>
                        <Link
                          to={product.to}
                          prefetch="intent"
                          onClick={onNavigate}
                          className="block text-base text-text-subtle hover:text-text-primary"
                        >
                          {product.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Disclosure.Panel>
              ) : null}
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}

function BrandContent({
  items,
  onNavigate,
}: {
  items: SingleMenuItem[];
  onNavigate: () => void;
}) {
  const uniqueItems = items.filter(
    (item, index, all) =>
      all.findIndex(
        (candidate) => candidate.to === item.to || candidate.id === item.id,
      ) === index,
  );
  return (
    <div className="grid grid-cols-1">
      {uniqueItems.map((item) => (
        <Link
          key={item.id}
          to={item.to}
          prefetch="intent"
          onClick={onNavigate}
          className="group/brand relative mb-3 block h-[188px] max-h-[188px] w-full shrink-0 overflow-hidden rounded-xl bg-background-subtle-1 last:mb-0"
        >
          <Image
            data={item.resource?.image}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-300 group-hover/brand:scale-[1.03]"
            width={600}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <span className="absolute right-3 bottom-3 left-3 line-clamp-1 font-heading text-base text-text-inverse">
            {item.resource?.title || item.title}
          </span>
        </Link>
      ))}
    </div>
  );
}

function SingleContent({
  items,
  onNavigate,
  desktop,
}: {
  items: SingleMenuItem[];
  onNavigate: () => void;
  desktop: boolean;
}) {
  return (
    <ul className={cn("space-y-3", desktop && "pt-2 pb-3")}>
      {items.map((item) => (
        <li key={item.id} className="leading-6">
          <Link
            to={item.to}
            prefetch="intent"
            onClick={onNavigate}
            className={({ isActive }) =>
              isActive ? "text-text-primary underline" : "text-text-subtle"
            }
          >
            <span className="font-body hover:text-text-primary text-base font-normal">
              {item.title}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
