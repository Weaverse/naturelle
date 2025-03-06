import { Disclosure } from "@headlessui/react";
import { Link } from "@remix-run/react";
import { Image } from "~/components/image";
import { Drawer, useDrawer } from "../../Drawer";
import { IconCaret, IconListMenu } from "../../Icon";
import { EnhancedMenu, getMaxDepth, SingleMenuItem } from "~/lib/types/menu";
import { SearchToggle } from "../SearchToggle";
import clsx from "clsx";

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
      className={clsx("z-30 flex items-center justify-start gap-3", className)}
      role="navigation"
    >
      <button className="text-left" onClick={openDrawer}>
        <IconListMenu />
      </button>
      <SearchToggle isOpenDrawerHearder={true} />
      <Drawer
        open={showMenu}
        onClose={closeDrawer}
        openFrom="left"
        heading="MENU"
        isForm="menu"
      >
        <DrawerMenu menu={menu} closeDrawer={closeDrawer} />
      </Drawer>
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
        let isResourceType =
          item.items.length &&
          item.items.every(
            (item) => item?.resource?.image && item.items.length === 0
          );
        let Comp: React.FC<SingleMenuItem & { closeDrawer: () => void }> =
          isResourceType
            ? ImageMenu
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
    <div
      className="flex items-center justify-between py-3"
      role="button"
      onClick={closeDrawer}
    >
      <Link to={to}>
        <h5 className="font-medium text-xl uppercase hover:text-text-primary">
          {title}
        </h5>
      </Link>
    </div>
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
                                className="text-text-subtle"
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
      <div
        className="flex items-center justify-between py-3 hover:text-text-primary"
        role="button"
        onClick={openMenu}
      >
        <h5 className="font-medium text-xl uppercase">{title}</h5>
        <IconCaret direction="right" className="h-4 w-4" />
      </div>
      {content}
    </div>
  );
}

function ImageMenu({
  title,
  items,
  to,
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
  let content = (
    <Drawer
      open={isMenuOpen}
      onClose={closeMenu}
      openFrom="left"
      heading={title}
      isBackMenu
      // bordered
    >
      <div className="grid grid-cols-2 gap-3 px-6 pb-16 pt-8 border-t border-border-subtle">
        {items.map((item, id) => (
          <Link
            to={item.to}
            prefetch="intent"
            key={id}
            onClick={handleCloseAll}
          >
            <div className="relative aspect-square w-full group">
              <Image
                data={item.resource?.image}
                className="h-full w-full rounded object-cover"
                sizes="auto"
              />
              <div className="absolute left-0 top-1/2 w-full -translate-y-1/2 text-center z-30 px-2">
                <span className="font-medium font-heading text-center text-white transition-all duration-300 text-2xl group-hover:underline line-clamp-1">
                  {item.title}
                </span>
              </div>
              <div className="absolute inset-0 bg-[#5546124D]/20 group-hover:bg-[#5546124D]/40 transition-opacity duration-300" />
            </div>
          </Link>
        ))}
      </div>
    </Drawer>
  );
  return (
    <div className="">
      <div
        className="flex items-center justify-between py-3 hover:text-text-primary"
        role="button"
        onClick={openMenu}
      >
        <h5 className="font-medium text-xl uppercase">{title}</h5>
        <IconCaret direction="right" className="h-4 w-4" />
      </div>
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
                className="text-text-subtle"
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
      <div
        className="flex items-center justify-between py-3 hover:text-text-primary"
        role="button"
        onClick={openMenu}
      >
        <h5 className="font-medium text-xl uppercase">{title}</h5>
        <IconCaret direction="right" className="h-4 w-4" />
      </div>
      {content}
    </div>
  );
}
