import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import type {VariantProps} from 'class-variance-authority';
import {cva} from 'class-variance-authority';
import clsx from 'clsx';
import {forwardRef} from 'react';

let variants = cva(
  'grow flex flex-col justify-center gap-5 py-6 md:py-8 [&_.paragraph]:mx-[unset] [&_.paragraph]:w-auto',
  {
    variants: {
      alignment: {
        left: 'items-start',
        center: 'items-center',
        right: 'items-end',
      },
    },
    defaultVariants: {
      alignment: 'center',
    },
  },
);

interface ImageWithTextContentProps
  extends VariantProps<typeof variants>,
    HydrogenComponentProps {}

let ImageWithTextContent = forwardRef<
  HTMLDivElement,
  ImageWithTextContentProps
>((props, ref) => {
  let {alignment, children, ...rest} = props;
  return (
    <div ref={ref} {...rest} className={clsx(variants({alignment}), 'flex-1')}>
      {children}
    </div>
  );
});

export default ImageWithTextContent;

export let schema: HydrogenComponentSchema = {
  type: 'image-with-text--content',
  title: 'Content',
  limit: 1,
  inspector: [
    {
      group: 'Content',
      inputs: [
        {
          type: 'select',
          name: 'alignment',
          label: 'Alignment',
          configs: {
            options: [
              {value: 'left', label: 'Left'},
              {value: 'center', label: 'Center'},
              {value: 'right', label: 'Right'},
            ],
          },
          helpText:
            'This will override the default alignment setting of all children components.',
        },
      ],
    },
  ],
  childTypes: ['subheading', 'heading', 'description', 'button'],
  presets: {
    alignment: 'center',
    children: [
      {
        type: 'subheading',
        content: 'Subheading',
      },
      {
        type: 'heading',
        content: 'Heading for image',
      },
      {
        type: 'description',
        content: 'Pair large text with an image to tell a story.',
      },
      {
        type: 'button',
        text: 'Shop now',
      },
    ],
  },
};
