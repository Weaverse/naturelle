import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';
import React from 'react';
import clsx from 'clsx';

interface HighlightsProps extends HydrogenComponentProps {
    heading: string;
    backgroundColor: string;
    itemPerRow: number;
    gap: number;
    sectionHeight: number;
}

let itemsPerRowClasses: { [item: number]: string } = {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
};

const Highlights = forwardRef<
    HTMLElement,
    HighlightsProps
>((props, ref) => {
    let {
        heading,
        backgroundColor,
        itemPerRow,
        gap,
        sectionHeight,
        children,
        ...rest
    } = props;
    let sectionStyle: CSSProperties = {
        backgroundColor: backgroundColor,
        '--section-height': `${sectionHeight}px`,
        '--item-gap': `${gap}px`,
    } as CSSProperties;
    let actualItemPerRow = Math.min(itemPerRow, React.Children.count(children));

    return (
        <section ref={ref} {...rest} className="w-full h-full" style={sectionStyle}>
            <div className="px-10 py-20 flex flex-col gap-12">
                {heading && <div className="flex justify-center">
                    <h2 className="font-medium">{heading}</h2>
                </div>}
                <div className={clsx(
                    "flex flex-col sm:grid gap-[var(--item-gap)]",
                    itemsPerRowClasses[actualItemPerRow],
                )}>
                    {children}
                </div>
            </div>
        </section>
    );
});

export default Highlights;

export let schema: HydrogenComponentSchema = {
    type: 'highlight',
    title: 'Highlights',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Highlights',
            inputs: [
                {
                    type: 'text',
                    name: 'heading',
                    label: 'Heading',
                    defaultValue: 'Highlights',
                    placeholder: 'Heading text',
                },
                {
                    type: 'color',
                    label: 'Background color',
                    name: 'backgroundColor',
                    defaultValue: '#F8F8F0',
                },
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