import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';

interface BeforeAndAfterProps extends HydrogenComponentProps {
    backgroundColor: string;
    topPadding: number;
    bottomPadding: number;
}

const BeforeAndAfter = forwardRef<HTMLElement, BeforeAndAfterProps>((props, ref) => {
    let {
        backgroundColor,
        topPadding,
        bottomPadding,
        children,
        ...rest
    } = props;
    let sectionStyle: CSSProperties = {
        backgroundColor: backgroundColor,
        '--top-padding-desktop': `${topPadding}px`,
        '--bottom-padding-desktop': `${bottomPadding}px`,
        '--top-padding-mobile': `${topPadding > 20 ? topPadding - 20 : topPadding}px`,
        '--bottom-padding-mobile': `${bottomPadding > 20 ? bottomPadding - 20 : bottomPadding}px`,
    } as CSSProperties;
    return (
        <section ref={ref} {...rest} className='w-full h-full' style={sectionStyle}>
            <div className='flex flex-col gap-12 pt-[var(--top-padding-mobile)] pb-[var(--bottom-padding-mobile)] sm:pt-[var(--top-padding-desktop)] sm:pb-[var(--bottom-padding-desktop)]'>
                {children}
            </div>
        </section>
    )
});

export default BeforeAndAfter;

export let schema: HydrogenComponentSchema = {
    type: 'before-and-after',
    title: 'Before & after',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Before & after slider',
            inputs: [
                {
                    type: 'color',
                    label: 'Background color',
                    name: 'backgroundColor',
                    defaultValue: '#F8F8F0',
                },
                {
                    type: 'range',
                    name: 'topPadding',
                    label: 'Top padding',
                    defaultValue: 80,
                    configs: {
                        min: 10,
                        max: 100,
                        step: 1,
                        unit: 'px',
                    },
                },
                {
                    type: 'range',
                    name: 'bottomPadding',
                    label: 'Bottom padding',
                    defaultValue: 80,
                    configs: {
                        min: 10,
                        max: 100,
                        step: 1,
                        unit: 'px',
                    },
                },
            ],
        },
    ],
    childTypes: ['heading', 'before-after-slider'],
    presets: {
        children: [
            {
                type: 'heading',
                content: 'Before & After',
            },
            {
                type: 'before-after-slider',
            }
        ]
    }
}