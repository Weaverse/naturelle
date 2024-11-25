import {Image} from '@shopify/hydrogen';
import type {
  HydrogenComponentProps,
  HydrogenComponentSchema,
  WeaverseImage,
} from '@weaverse/hydrogen';
import {IconNewsletter} from '~/components/Icon';
import {CSSProperties, forwardRef} from 'react';

interface NewsletterIconProps extends HydrogenComponentProps {
  iconImage: WeaverseImage;
  iconImageSize: number;
}

const NewsletterIcon = forwardRef<HTMLDivElement, NewsletterIconProps>((props, ref) => {
  let {iconImage, iconImageSize, ...rest} = props;
  let style: CSSProperties = {
    '--image-size': `${iconImageSize}px`,
  } as CSSProperties;

  return (
    <div data-motion="fade-up" ref={ref} {...rest} style={style} className="flex items-center justify-center">
      {iconImage ? (
        <Image
          data={iconImage}
          className="!aspect-square !w-[var(--image-size)] object-cover"
        />
      ) : (
        <IconNewsletter viewBox="0 0 65 64" className="!h-16 !w-16" />
      )}
    </div>
  );
});

export default NewsletterIcon;

export let schema: HydrogenComponentSchema = {
  type: 'newsletter-icon',
  title: 'Icon',
  toolbar: ['general-settings', ['duplicate', 'delete']],
  inspector: [
    {
      group: 'Icon',
      inputs: [
        {
          type: 'image',
          name: 'iconImage',
          label: 'Icon image',
        },
        {
          type: 'range',
          name: 'iconImageSize',
          label: 'Icon image size',
          defaultValue: 50,
          configs: {
            min: 20,
            max: 100,
            step: 1,
          },
        },
      ],
    },
  ],
};
