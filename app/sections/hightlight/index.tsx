import type {
    HydrogenComponentProps,
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef, CSSProperties } from 'react';

interface HighlightsProps extends HydrogenComponentProps {
    backgroundColor: string;
    borderColor: string;
}

const Highlights = forwardRef<
    HTMLElement,
    HighlightsProps
>((props, ref) => {
    let {
        backgroundColor,
        borderColor,
        children,
        ...rest
    } = props;
    let sectionStyle: CSSProperties = {
        backgroundColor: backgroundColor,
        '--border-color': borderColor,
    } as CSSProperties;

    return (
        <section ref={ref} {...rest} className="w-full h-full flex justify-center" style={sectionStyle}>
            <div className="px-6 py-12 sm:py-20 sm:px-10 flex flex-col gap-12 container text-center">
                {children}
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
                    type: 'color',
                    label: 'Background color',
                    name: 'backgroundColor',
                    defaultValue: '#F8F8F0',
                },
                {
                    type: 'color',
                    label: 'Border color',
                    name: 'borderColor',
                    defaultValue: '#9AA473',
                },
            ],
        },
    ],
    childTypes: ['heading', 'highlight-content--item'],
    presets: {
        children: [
            {
                type: 'heading',
                content: 'Highlights',
            },
            {
                type: 'highlight-content--item',
            },
        ],
    },
};