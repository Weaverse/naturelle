import type {
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { forwardRef} from 'react';
import { layoutInputs, Section, SectionProps } from '../atoms/Section';

type RelatedProductsProps = SectionProps;

let RelatedProducts = forwardRef<HTMLElement, RelatedProductsProps>(
  (props, ref) => {
    let {children, ...rest} = props;
      return (
        <Section ref={ref} {...rest}>
            {children}
        </Section>
      );
  },
);

export default RelatedProducts;

export let schema: HydrogenComponentSchema = {
  type: 'related-products',
  title: 'Related products',
  limit: 1,
  enabledOn: {
    pages: ['PRODUCT'],
  },
  inspector:[
    {
        group: 'Layout',
        inputs: layoutInputs.filter(({ name }) => name !== 'divider' && name !== 'borderRadius'),
    }
  ],
  toolbar: ['general-settings', ['duplicate', 'delete']],
  childTypes: ['heading', 'related-products--list'],
  presets: {
    children: [
      {
        type: 'heading',
        content: 'You may also like',
      },
      {
        type: 'related-products--list',
      },
    ],
  },
};
