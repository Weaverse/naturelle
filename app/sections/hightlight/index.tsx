import type {
    HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef } from 'react';
import { Section, sectionInspector, SectionProps } from '../atoms/Section';

type HighlightsProps = SectionProps;

const Highlights = forwardRef<
    HTMLElement,
    HighlightsProps
>((props, ref) => {
    let {
        children,
        ...rest
    } = props;

    return (
        <Section ref={ref} {...rest}>
            {children}
        </Section>
    );
});

export default Highlights;

export let schema: HydrogenComponentSchema = {
    type: 'highlight',
    title: 'Highlights',
    toolbar: ['general-settings', ['duplicate', 'delete']],
    inspector: sectionInspector,
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