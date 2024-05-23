import type {
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import {forwardRef} from 'react';
import { Section, SectionProps, sectionInspector } from '../atoms/Section';

type HeaderImageProps = SectionProps;

let HeaderImage = forwardRef<HTMLElement, HeaderImageProps>((props, ref) => {
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

export default HeaderImage;

export let schema: HydrogenComponentSchema = {
  type: 'image-banner',
  title: 'Image banner',
  toolbar: ['general-settings', ['duplicate', 'delete']],
  inspector: [sectionInspector],
  childTypes: ['subheading', 'heading', 'description', 'button'],
  presets: {
    children: [
      {
        type: 'subheading',
        content: 'Subheading',
      },
      {
        type: 'heading',
        content: 'Heading for Image',
      },
      {
        type: 'description',
        content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      },
      {
        type: 'button',
        content: 'Button section',
      },
    ],
  },
};
