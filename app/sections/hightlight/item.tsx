import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import React from 'react';
import clsx from 'clsx';
import { useParentInstance } from '@weaverse/hydrogen';

interface HightlightProps extends HydrogenComponentProps {
    visibleOnMobile: boolean;
}

const HighlightItem = forwardRef<HTMLDivElement, HightlightProps>(
    (props, ref) => {
        let {
            visibleOnMobile,
            children,
            ...rest
        } = props;
        
        let parentInstance = useParentInstance();
        return (
            <div
                ref={ref}
                {...rest}
                className={clsx('flex flex-col gap-4 items-center w-full border-2 border-[var(--border-color)] rounded px-8 py-10',
                !visibleOnMobile && 'hidden sm:flex',
                )}
            >
                {React.Children.map(children, (child, index) => (
                    <>
                        <div className='w-full flex justify-center items-center gap-4'>
                            {index === 0 && (
                                <div className='w-fit h-fit'>
                                    <span className='flex justify-center items-center border border-[var(--border-color)] rounded-full font-heading font-medium w-11 h-11 text-2xl'>
                                        {(parentInstance?._store?.children as { id: string }[])?.findIndex((c) => c.id === child?.props.parentId) + 1}
                                    </span>
                                </div>
                            )}
                            {child}
                        </div>
                        {index < (children?.length ?? 0) - 1 && (
                            <div className="border-b-2 border-[var(--border-color)] w-full"></div>
                        )}
                    </>
                ))}
            </div>
        );
    },
);

export default HighlightItem;

export let schema: HydrogenComponentSchema = {
    type: 'highlight--item',
    title: 'Highlight',
    limit: 8,
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Highlight',
            inputs: [
                {
                    type: 'switch',
                    label: 'Visible on Mobile',
                    name: 'visibleOnMobile',
                    defaultValue: true,
                },
            ],
        },
    ],
    childTypes: ['heading', 'description'],
    presets: {
        children: [
            {
                type: 'heading',
                content: 'Heading',
            },
            {
                type: 'description',
                content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
            },
        ],
    },
};