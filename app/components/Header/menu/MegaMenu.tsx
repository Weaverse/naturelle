import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {getMaxDepth} from '~/lib/menu';
import {SingleMenuItem} from '~/lib/type';
import {EnhancedMenu} from '~/lib/utils';
import clsx from 'clsx';
import React from 'react';
import {IconCaret} from '../../Icon';

interface EnhancedMenuItem extends SingleMenuItem {
  isShowIconCaret?: boolean;
}

const dropdownContentClass =
  'absolute overflow-hidden bg-[var(--color-header-bg)] shadow-md z-10 dropdown-transition border-t';

export function MegaMenu(props: {menu: EnhancedMenu | null | undefined}) {
  let {menu} = props;
  let items = menu?.items as unknown as SingleMenuItem[];
  if (!items) return null;
  return (
    <nav className="flex h-full items-stretch">
      {items.map((item, id) => {
        let {title, ...rest} = item;
        let level = getMaxDepth(item);
        let isAllResourceType =
          item.items.length &&
          item.items.every(
            (item) => item?.resource?.image && item.items.length === 0,
          );
        let isShowIconCaret = level !== 1;
        let Comp: React.FC<EnhancedMenuItem> = isAllResourceType
          ? ImageMenu
          : level > 2
            ? MultiMenu
            : level === 2
              ? SingleMenu
              : GroupWrapper;
        return (
          <Comp
            key={id}
            isShowIconCaret={isShowIconCaret}
            {...(rest as SingleMenuItem)}
            title={title}
          />
        );
      })}
    </nav>
  );
}

function MultiMenu(props: SingleMenuItem & {isShowIconCaret?: boolean}) {
  let {title, items, to, isShowIconCaret} = props;

  let renderList = (item: SingleMenuItem, idx: number) => (
    <div
      className="fly-in max-w-80 flex-1"
      key={idx}
      style={{'--item-index': idx} as {[key: string]: any}}
    >
      <h5 className="mb-4 font-semibold uppercase text-text-primary">
        <Link to={item.to} prefetch="intent">
          <span className="text-animation">{item.title}</span>
        </Link>
      </h5>
      <ul className="space-y-1.5">
        {item.items.map((subItem, ind) => (
          <li key={ind} className="leading-6">
            <Link
              key={ind}
              to={subItem.to}
              prefetch="intent"
              className="relative"
            >
              <span className="text-animation font-normal">
                {subItem.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  let renderImageItem = (item: SingleMenuItem, idx: number) => (
    <div
      className="group/item fly-in relative aspect-square w-full max-w-80 flex-1 overflow-hidden rounded"
      key={idx}
      style={{'--item-index': idx} as {[key: string]: any}}
    >
      <Link to={item.to} prefetch="intent">
        <Image
          sizes="auto"
          data={item.resource?.image}
          className="z-30 h-full w-full rounded object-cover"
        />
      </Link>
      <h4 className="absolute inset-0 z-40 flex w-full cursor-pointer items-center justify-center p-2 text-center font-medium text-white transition-all duration-300 group-hover/item:underline">
        {item.title}
      </h4>
      <div className="absolute inset-0 z-30 bg-foreground-subtle opacity-30 transition-opacity duration-300 group-hover/item:opacity-50" />
    </div>
  );
  return (
    <GroupWrapper title={title} to={to} isShowIconCaret={isShowIconCaret}>
      <div className={clsx('left-0 top-full w-full', dropdownContentClass)}>
        <div className="container mx-auto py-6">
          <div className="flex w-full justify-center gap-6">
            {items.map((item, id) =>
              item.resource && item.items.length === 0
                ? renderImageItem(item, id)
                : renderList(item, id),
            )}
          </div>
          <div className="flex gap-6"></div>
        </div>
      </div>
    </GroupWrapper>
  );
}

function SingleMenu(props: SingleMenuItem & {isShowIconCaret?: boolean}) {
  let {title, items, to, isShowIconCaret} = props;
  return (
    <GroupWrapper
      title={title}
      to={to}
      isShowIconCaret={isShowIconCaret}
      className="relative"
    >
      <div
        className={clsx(
          '-left-3 top-full group-hover:h-auto',
          dropdownContentClass,
        )}
      >
        <div className="min-w-48 p-6">
          <div>
            <h5 className="mb-4 font-medium uppercase">
              <Link to={to} prefetch="intent">
                <span className="text-animation">{title}</span>
              </Link>
            </h5>
            <ul className="space-y-1.5">
              {items.map((subItem, ind) => (
                <li key={ind} className="leading-6">
                  <Link to={subItem.to} prefetch="intent">
                    <span className="text-animation">{subItem.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </GroupWrapper>
  );
}

function ImageMenu({
  title,
  items,
  to,
  isShowIconCaret,
}: SingleMenuItem & {isShowIconCaret?: boolean}) {
  return (
    <GroupWrapper title={title} to={to} isShowIconCaret={isShowIconCaret}>
      <div className={clsx('left-0 top-full w-full', dropdownContentClass)}>
        <div className="py-8">
          <div className="container mx-auto flex w-fit gap-6">
            {items.map((item, id) => (
              <Link
                to={item.to}
                prefetch="intent"
                key={id}
                className="fly-in flex-1"
                style={{'--item-index': id} as {[key: string]: any}}
              >
                <div className="group/item relative aspect-square overflow-hidden rounded">
                  <Image
                    data={item?.resource?.image}
                    className="h-full w-full rounded z-30 object-cover"
                    sizes="auto"
                  />
                  <h4 className="absolute inset-0 z-40 flex w-full cursor-pointer items-center justify-center p-2 text-center font-medium text-white transition-all duration-300 group-hover/item:underline">
                    {item.title}
                  </h4>
                  <div className="absolute inset-0 z-30 bg-foreground-subtle opacity-30 transition-opacity duration-300 group-hover/item:opacity-50" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </GroupWrapper>
  );
}

function GroupHeader({
  title,
  to,
  isShowIconCaret,
}: {
  title: string;
  to: string;
  isShowIconCaret?: boolean;
}) {
  return (
    <div className="relative z-30 flex h-full cursor-pointer items-center gap-1 px-3">
      <Link to={to} className="py-2">
        <span className="text-animation group/header font-body text-base font-normal uppercase">
          {title}
        </span>
      </Link>
      {isShowIconCaret && <IconCaret direction="down" className="h-4 w-4" />}
    </div>
  );
}

function GroupWrapper(props: {
  children?: React.ReactNode;
  className?: string;
  title: string;
  to: string;
  isShowIconCaret?: boolean;
}) {
  let {children, className, title, to, isShowIconCaret} = props;
  return (
    <div className={clsx('group', className)}>
      <GroupHeader title={title} to={to} isShowIconCaret={isShowIconCaret} />
      {children}
    </div>
  );
}
