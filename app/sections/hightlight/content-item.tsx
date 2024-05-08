import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import clsx from 'clsx';
import React, {forwardRef, CSSProperties} from 'react';

interface ContentProps extends HydrogenComponentProps {
    itemPerRow: number;
    gap: number;
}

let itemsPerRowClasses: { [item: number]: string } = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
};

const HighlightContent = forwardRef<HTMLDivElement, ContentProps>(
  (props, ref) => {
    let {itemPerRow, gap, children, ...rest} = props;
    let style: CSSProperties = {
        '--item-gap': `${gap}px`,
    } as CSSProperties;
    let actualItemPerRow = Math.min(itemPerRow, React.Children.count(children));
    return (
      <div ref={ref} {...rest}
        className={clsx(
          'flex flex-col sm:grid gap-[var(--item-gap)]',
          itemsPerRowClasses[actualItemPerRow],
        )}
        style={style}
      >
        {children}
      </div>
    );
  },
);

export default HighlightContent;

export let schema: HydrogenComponentSchema = {
  type: 'highlight-content--item',
  title: 'List items',
  toolbar: ['general-settings', ['duplicate', 'delete']],
  inspector: [
    {
      group: 'Highlights',
      inputs: [
        {
          type: 'range',
          name: 'itemPerRow',
          label: 'Items per row',
          defaultValue: 3,
          configs: {
            min: 1,
            max: 4,
            step: 1,
          },
        },
        {
          type: 'range',
          label: 'Gap',
          name: 'gap',
          configs: {
            min: 16,
            max: 40,
            step: 6,
          },
          defaultValue: 16,
        },
      ],
    },
  ],
  childTypes: ['highlight--item'],
    presets: {
        children: [
            {
                type: 'highlight--item',
            },
            {
                type: 'highlight--item',
            },
            {
                type: 'highlight--item',
            }
        ],
    },
};
