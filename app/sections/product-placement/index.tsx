import type {HydrogenComponentSchema} from '@weaverse/hydrogen';
import {forwardRef} from 'react';
import {Section, sectionInspector, SectionProps} from '../atoms/Section';

type ProductPlacementProps = SectionProps;

const ProductPlacement = forwardRef<HTMLElement, ProductPlacementProps>(
  (props, ref) => {
    let {children, ...rest} = props;
    return (
      <Section ref={ref} {...rest}>
        {children}
      </Section>
    );
  },
);

export default ProductPlacement;

export const schema: HydrogenComponentSchema = {
  type: 'product-placement',
  title: 'Product placement',
  inspector: sectionInspector,
  childTypes: [
    'subheading',
    'heading',
    'description',
    'product-placement--items',
  ],
  presets: {
    children: [
      {
        type: 'heading',
        content: 'Shop the look',
      },
      {
        type: 'product-placement--items',
      },
    ],
  },
};
