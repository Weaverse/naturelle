import {Button, type ButtonProps} from '@/components/button';
import type {HydrogenComponentSchema} from '@weaverse/hydrogen';
import {IconEllipse} from '~/components/Icon';
import {CSSProperties, forwardRef} from 'react';

interface OriginalButtonProps extends ButtonProps {
  href?: string;
  target?: string;
  textColor?: string;
}

const WeaverseButton = forwardRef<HTMLButtonElement, OriginalButtonProps>(
  (props, ref) => {
    const {href, target, value, variant, shape, textColor, ...rest} = props;
    const Component = href ? 'a' : 'button';
    let style = {
      color: textColor,
    } as CSSProperties;
    return (
      <Button
        as={Component}
        to={href}
        target={target}
        variant={variant}
        shape={shape}
        ref={ref}
        {...rest}
        className={`w-fit ${props.className}`}
        style={style}
      >
        {variant === 'decor' ? (
          <>
            <IconEllipse
              className="absolute inset-0 !h-[61px] !w-[148px] transform transition-transform duration-500 hover:rotate-[-11deg]"
              stroke={textColor ? textColor : 'rgb(var(--color-foreground))'}
              viewBox="0 0 148 61"
            />
            <div className="flex pl-4 pt-2">{value}</div>
          </>
        ) : (
          <>{value}</>
        )}
      </Button>
    );
  },
);

export default WeaverseButton;

export const schema: HydrogenComponentSchema = {
  title: 'Button',
  type: 'button',
  inspector: [
    {
      group: 'Settings',
      inputs: [
        {
          type: 'color',
          label: 'Text color',
          name: 'textColor',
        },
        {
          type: 'text',
          name: 'value',
          label: 'Text',
          defaultValue: 'Shop now',
        },
        {
          type: 'select',
          name: 'variant',
          label: 'Variant',
          defaultValue: 'primary',
          configs: {
            options: [
              {label: 'Primary', value: 'primary'},
              {label: 'Outline', value: 'outline'},
              {label: 'Secondary', value: 'secondary'},
              {label: 'Decor', value: 'decor'},
            ],
          },
        },
        {
          type: 'select',
          name: 'size',
          label: 'Size',
          defaultValue: 'default',
          configs: {
            options: [
              {label: 'Default', value: 'default'},
              {label: 'Small', value: 'sm'},
              {label: 'Large', value: 'lg'},
              {label: 'Icon', value: 'icon'},
            ],
          },
          condition: `variant.ne.decor`,
        },
        {
          type: 'select',
          name: 'shape',
          label: 'Shape',
          defaultValue: 'round',
          configs: {
            options: [
              {label: 'Default', value: 'default'},
              {label: 'Round', value: 'round'},
            ],
          },
          condition: `variant.ne.decor`,
        },
        {
          type: 'url',
          name: 'href',
          label: 'Link to',
          defaultValue: '/products',
          placeholder: '/products',
        },
        {
          type: 'select',
          name: 'target',
          label: 'Target',
          defaultValue: '_self',
          configs: {
            options: [
              {label: 'Open the current page', value: '_self'},
              {label: 'Open a new page', value: '_blank'},
              {label: 'Open the parent page', value: '_parent'},
              {label: 'Open the first page', value: '_top'},
            ],
          },
        },
      ],
    },
  ],
};