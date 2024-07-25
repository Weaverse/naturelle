import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import clsx from 'clsx';
import { forwardRef, CSSProperties } from 'react';

interface ScrollingProps extends HydrogenComponentProps {
    content: string;
    textSize?: string;
    textColor?: string;
    borderColor?: string;
    backgroundColor?: string;
    verticalPadding?: number;
    verticalMargin?: number;
    speed?: number;
    visibleOnMobile?: boolean;
}

const ScrollingText = forwardRef<HTMLElement, ScrollingProps>((props, ref) => {
    let {
        content,
        textSize,
        textColor,
        borderColor,
        backgroundColor,
        verticalPadding,
        verticalMargin,
        speed,
        visibleOnMobile,
        ...rest
    } = props;

    let sectionStyle: CSSProperties = {
        '--text-color': textColor,
        '--border-color': borderColor,
        '--background-color': backgroundColor,
        '--vertical-padding': `${verticalPadding}px`,
        '--vertical-margin': `${verticalMargin}px`,
        '--speed': `${speed}s`,
    } as CSSProperties;

    return (
        <section ref={ref} {...rest} style={sectionStyle} className={clsx(
            'py-[var(--vertical-padding)] my-[var(--vertical-margin)] border-y border-y-[var(--border-color)] bg-[var(--background-color)]',
            !visibleOnMobile && 'hidden sm:block',
        )}>
            <div className='overflow-hidden flex'>
                <h3 className='font-medium whitespace-nowrap animate-scrollContent text-[var(--text-color)] '
                    style={{ animationDuration: `var(--speed)`, fontSize: `${textSize}px`, }}
                >
                    {`  ${content}  `.repeat(15)}
                </h3>
                <h3 className='font-medium whitespace-nowrap animate-scrollContent text-[var(--text-color)] '
                    style={{ animationDuration: `var(--speed)`, fontSize: `${textSize}px`, }}
                >
                    {`  ${content}  `.repeat(15)}
                </h3>
                <h3 className='font-medium whitespace-nowrap animate-scrollContent text-[var(--text-color)] '
                    style={{ animationDuration: `var(--speed)`, fontSize: `${textSize}px`, }}
                >
                    {`  ${content}  `.repeat(15)}
                </h3>
            </div>
        </section>
    );
});

export default ScrollingText;

export let schema: HydrogenComponentSchema = {
    type: 'scrolling-text',
    title: 'Scrolling Text',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: [
        {
            group: 'Scrolling Text',
            inputs: [
                {
                    type: 'textarea',
                    name: 'content',
                    label: 'Text',
                    defaultValue: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
                },
                {
                    type: 'toggle-group',
                    label: 'Text size',
                    name: 'textSize',
                    configs: {
                        options: [
                            { label: 'S', value: '16' },
                            { label: 'M', value: '18' },
                            { label: 'L', value: '20' },
                        ],
                    },
                    defaultValue: '16',
                },
                {
                    type: 'color',
                    name: 'textColor',
                    label: 'Text color',
                },
                {
                    type: 'color',
                    name: 'borderColor',
                    label: 'Border color',
                    defaultValue: '#3D490B',
                },
                {
                    type: 'color',
                    name: 'backgroundColor',
                    label: 'Background color',
                    defaultValue: '#E5E7D4',
                },
                {
                    type: 'range',
                    name: 'verticalPadding',
                    label: 'Vertical padding',
                    defaultValue: 10,
                    configs: {
                        min: 0,
                        max: 30,
                        step: 1,
                        unit: 'px',
                    },
                },
                {
                    type: 'range',
                    name: 'verticalMargin',
                    label: 'Vertical margin',
                    defaultValue: 0,
                    configs: {
                        min: 0,
                        max: 30,
                        step: 1,
                        unit: 'px',
                    },
                },
                {
                    type: 'range',
                    name: 'speed',
                    label: 'Speed',
                    defaultValue: 70,
                    configs: {
                        min: 10,
                        max: 200,
                        step: 1,
                        unit: 's',
                    },
                },
                {
                    type: 'switch',
                    name: 'visibleOnMobile',
                    label: 'Visible on mobile',
                    defaultValue: true,
                },
            ],
        },
    ],
}