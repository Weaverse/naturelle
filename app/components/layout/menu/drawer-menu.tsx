import { Disclosure } from "@headlessui/react";
import { useTranslation } from "@weaverse/hydrogen";
import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode, useState } from "react";
import { Image } from "~/components/image";
import { Link } from "~/components/link";
import {
  type EnhancedMenu,
  getMenuLayout,
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
const mobileContentVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -24 : 24 }),
};

export function HeaderMenuDrawer({
  menu,
  className,
}: {
  menu?: EnhancedMenu | null;
  className?: string;
}) {
  const { t } = useTranslation();
  const { isOpen, openDrawer, closeDrawer } = useDrawer();
  const [active, setActive] = useState<SingleMenuItem | null>(null);
  const [direction, setDirection] = useState(1);

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
        <SearchToggle isOpenDrawerHeader className="desktop:hidden" />
        <Drawer
          open={isOpen}
          onClose={close}
          onBack={back}
          openFrom="left"
          heading={active ? active.title : t("navigation.menu")}
          isForm="menu"
          isBackMenu={Boolean(active)}
        >
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
        </Drawer>
      </div>
    </nav>
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
                getMenuLayout(item) === "link" ? (
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
}: {
  item: SingleMenuItem;
  onNavigate: () => void;
}) {
  const layout = getMenuLayout(item);
  if (layout === "collection") {
    return <CollectionContent items={item.items} onNavigate={onNavigate} />;
  }
  if (layout === "collection-card" || layout === "image-card") {
    return <ImageCardContent items={item.items} onNavigate={onNavigate} />;
  }
  if (layout === "journal" || layout === "multi") {
    return <MultiContent items={item.items} onNavigate={onNavigate} />;
  }
  return <SingleContent items={item.items} onNavigate={onNavigate} />;
}

function AccordionPanel({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      inert={!open}
      className={cn(
        "grid transition-[grid-template-rows] duration-300",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <Disclosure.Panel static>{children}</Disclosure.Panel>
      </div>
    </div>
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
      {items.map((item) =>
        item.items.length ? (
          <Disclosure key={item.id}>
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full justify-between text-left">
                  <span className={headingClass}>{item.title}</span>
                  <IconCaret
                    className="size-4"
                    direction={open ? "down" : "right"}
                  />
                </Disclosure.Button>
                <AccordionPanel open={open}>
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
                </AccordionPanel>
              </div>
            )}
          </Disclosure>
        ) : (
          <Link
            key={item.id}
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
        ),
      )}
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
      {collections.map((item) =>
        item.items.length ? (
          <Disclosure key={item.id}>
            {({ open }) => (
              <div>
                <Disclosure.Button className="flex w-full items-center justify-between text-left">
                  <span className={headingClass}>
                    {item.resource?.title || item.title}
                  </span>
                  <IconCaret
                    className="size-4 shrink-0"
                    direction={open ? "down" : "right"}
                  />
                </Disclosure.Button>
                <AccordionPanel open={open}>
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
                </AccordionPanel>
              </div>
            )}
          </Disclosure>
        ) : (
          <Link
            key={item.id}
            to={item.to}
            prefetch="intent"
            onClick={onNavigate}
            className="block font-heading text-base uppercase text-text-subtle hover:text-text-primary"
          >
            {item.resource?.title || item.title}
          </Link>
        ),
      )}
    </div>
  );
}

function ImageCardContent({
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
          className="group/card mb-3 flex w-full shrink-0 flex-col items-start self-stretch overflow-hidden rounded-2xl bg-background-subtle-1 last:mb-0"
        >
          <div className="relative flex h-45.5 w-full flex-col items-start self-stretch overflow-hidden">
            <Image
              data={item.resource?.image}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
              width={600}
            />
            <div className="absolute inset-x-0 bottom-0 flex h-18 flex-col items-start justify-center bg-gradient-to-b from-transparent to-menu-card-overlay p-4">
              <span className="line-clamp-1 font-brand text-[22px] leading-[110%] font-semibold tracking-[-0.44px] text-text-inverse">
                {item.resource?.title || item.title}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function SingleContent({
  items,
  onNavigate,
}: {
  items: SingleMenuItem[];
  onNavigate: () => void;
}) {
  return (
    <ul className="space-y-3">
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
