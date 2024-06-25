import {Disclosure} from '@headlessui/react';
import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {Drawer, useDrawer} from '../Drawer';
import {IconCaret} from '../Icon';
import {
  Nav_Items,
  type ImageItem,
  type MultiMenuProps,
  type SingleMenuProps,
} from './defines';

const MenuByType = {
  multi: MultiMenu,
  image: ImageMenu,
  single: SingleMenu,
};

export function DrawerMenu() {
  return (
    <nav className="grid px-4 py-2">
      {Nav_Items.map((item, id) => {
        let {title, type, ...rest} = item;
        let Comp = MenuByType[type];
        return <Comp key={id} title={title} {...rest} />;
      })}
    </nav>
  );
}

function MultiMenu(props: MultiMenuProps) {
  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();
  let {title, items} = props;
  let content = (
    <Drawer
      open={isMenuOpen}
      onClose={closeMenu}
      openFrom="left"
      heading={title}
      isBackMenu
      // bordered
    >
      <div className="grid overflow-auto px-4 py-2">
        {items.map((item, id) => (
          <div key={id}>
            <Disclosure>
              {({open}) => (
                <>
                  <Disclosure.Button className="w-full text-left">
                    <h5 className="flex w-full justify-between py-3 font-medium uppercase">
                      {item.title}
                      <span className="">
                        <IconCaret
                          className="h-4 w-4"
                          direction={open ? 'down' : 'right'}
                        />
                      </span>
                    </h5>
                  </Disclosure.Button>
                  {item?.items?.length > 0 ? (
                    <div
                      className={`${
                        open ? `h-fit max-h-48` : `max-h-0`
                      } overflow-hidden transition-all duration-300` }
                    >
                      <Disclosure.Panel static>
                        <ul className="space-y-3 pb-3 pt-2">
                          {item.items.map((subItem, ind) => (
                            <li key={ind} className="leading-6">
                              <Link
                                key={ind}
                                to={subItem.to}
                                prefetch="intent"
                                className="animate-hover"
                              >
                                {subItem.title}
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
        className="flex items-center justify-between py-3"
        role="button"
        onClick={openMenu}
      >
        <span className="font-medium uppercase">{title}</span>{' '}
        <IconCaret direction="right" className="h-4 w-4" />
      </div>
      {content}
    </div>
  );
}

function ImageMenu({
  title,
  imageItems,
}: {
  title: string;
  imageItems: ImageItem[];
}) {
  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();
  let content = (
    <Drawer
      open={isMenuOpen}
      onClose={closeMenu}
      openFrom="left"
      heading={title}
      isBackMenu
      // bordered
    >
      <div className="grid grid-cols-2 gap-3 px-4 py-5">
        {imageItems.map((item, id) => (
          <Link to={item.to} prefetch="intent" key={id}>
            <div className="relative aspect-square w-full">
              <Image
                data={item.data}
                className="h-full w-full object-cover"
                sizes="auto"
              />
              <div className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2 text-center font-medium text-white">
                {item.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Drawer>
  );
  return (
    <div className="">
      <div
        className="flex items-center justify-between py-3"
        role="button"
        onClick={openMenu}
      >
        <span className="font-medium uppercase">{title}</span>{' '}
        <IconCaret direction="right" className="h-4 w-4" />
      </div>
      {content}
    </div>
  );
}

function SingleMenu(props: SingleMenuProps) {
  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();
  let {title, items, to} = props;
  let content = (
    <Drawer
      open={isMenuOpen}
      onClose={closeMenu}
      openFrom="left"
      heading={title}
      isBackMenu
      // bordered
    >
      <div className="grid overflow-auto px-4 py-2">
        <ul className="space-y-3 pb-3 pt-2">
          {items.map((subItem, ind) => (
            <li key={ind} className="leading-6">
              <Link
                key={ind}
                to={subItem.to}
                prefetch="intent"
                className="animate-hover"
              >
                {subItem.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Drawer>
  );
  return (
    <div className="">
      {items.length > 0 ? (
        <div
          className="flex items-center justify-between py-3"
          role="button"
          onClick={openMenu}
        >
          <span className="font-medium uppercase">{title}</span>
          <IconCaret direction="right" className="h-4 w-4" />
        </div>
      ) : (
        <Link
          className="flex items-center justify-between py-3"
          to={to}
          prefetch="intent"
        >
          <span className="font-medium uppercase">{title}</span>
        </Link>
      )}
      {items.length > 0 && content}
    </div>
  );
}
