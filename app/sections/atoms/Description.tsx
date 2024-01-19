import {
  type HydrogenComponentProps,
  type HydrogenComponentSchema,
} from '@weaverse/hydrogen';
import { clsx } from 'clsx';
import { forwardRef, CSSProperties } from 'react';

type Alignment = 'left' | 'center' | 'right';
type DescriptionProps = HydrogenComponentProps & {
  content: string;
  textColor?: string;
  as?: 'p' | 'div';
  width?: Width;
  alignment?: Alignment;
  className?: string;
};

type Width = 'full' | 'narrow';

let widthClasses: Record<Width, string> = {
  full: 'w-full lg:w-3/4 mx-auto',
  narrow: 'w-full md:w-1/2 lg:w-3/4 max-w-4xl mx-auto',
};

let alignmentClasses: Record<Alignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

let Description = forwardRef<
  HTMLParagraphElement | HTMLDivElement,
  DescriptionProps
>((props, ref) => {
  let { as: Tag = 'p', width, content, alignment, className, textColor, ...rest } = props;
  let style = {
    color: textColor,
  } as CSSProperties;
  return (
    <Tag
      ref={ref}
      {...rest}
      style={style}
      className={clsx(
        widthClasses[width!],
        alignmentClasses[alignment!],
        className,
      )}
      dangerouslySetInnerHTML={{ __html: content }}
    >      
    </Tag>
  );
});

Description.defaultProps = {
  as: 'p',
  width: 'narrow',
  content:
    "Pair large text with an image or full-width video to showcase your brand's lifestyle to describe and showcase an important detail of your products that you can tag on your image.",
  alignment: 'center',
};

export default Description;

export let schema: HydrogenComponentSchema = {
  type: 'description',
  title: 'Description',
  inspector: [
    {
      group: 'Description',
      inputs: [
        {
          type: 'color',
          label: 'Text color',
          name: 'textColor',
          defaultValue: '#33333',
        },
        {
          type: 'select',
          name: 'as',
          label: 'Tag name',
          configs: {
            options: [
              { value: 'p', label: 'Paragraph' },
              { value: 'div', label: 'Div' },
            ],
          },
          defaultValue: 'p',
        },
        {
          type: 'richtext',
          name: 'content',
          label: 'Content',
          defaultValue:
            "Pair large text with an image or full-width video to showcase your brand's lifestyle to describe and showcase an important detail of your products that you can tag on your image.",
          placeholder:
            "Pair large text with an image or full-width video to showcase your brand's lifestyle to describe and showcase an important detail of your products that you can tag on your image.",
        },
        {
          type: 'toggle-group',
          name: 'width',
          label: 'Width',
          configs: {
            options: [
              { value: 'full', label: 'Full', icon: 'ArrowsHorizontal' },
              {
                value: 'narrow',
                label: 'Narrow',
                icon: 'ArrowsInLineHorizontal',
              },
            ],
          },
          defaultValue: 'full',
        },
        {
          type: 'toggle-group',
          name: 'alignment',
          label: 'Alignment',
          configs: {
            options: [
              { value: 'left', label: 'Left', icon: 'AlignLeft' },
              { value: 'center', label: 'Center', icon: 'AlignCenterHorizontal' },
              { value: 'right', label: 'Right', icon: 'AlignRight' },
            ],
          },
          defaultValue: 'center',
        },
      ],
    },
  ],
  toolbar: ['general-settings', ['duplicate', 'delete']],
};
