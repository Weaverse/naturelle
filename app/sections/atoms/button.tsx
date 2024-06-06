import {Button, type ButtonProps} from '@/components/button';
import type {HydrogenComponentSchema} from '@weaverse/hydrogen';
import {IconEllipse} from '~/components/Icon';
import {CSSProperties, forwardRef} from 'react';

const WeaverseButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const {href, target, value, variant, textColor, ...rest} = props;
    const Component = href ? 'a' : 'button';
    let style = {
      color: textColor,
    } as CSSProperties;
    return (
      <Button
        as={Component}
        to={href}
        target={href ? target || '_self' : undefined}
        variant={variant}
        ref={ref}
        {...rest}
        className={`mx-auto w-fit ${props.className}`}
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
          type: 'select',
          name: 'variant',
          label: 'Variant',
          defaultValue: 'default',
          configs: {
            options: [
              {label: 'Default', value: 'default'},
              {label: 'Outline', value: 'outline'},
              {label: 'Secondary', value: 'secondary'},
              {label: 'Primary', value: 'primary'},
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
          type: 'text',
          name: 'value',
          label: 'Text',
          defaultValue: 'Button',
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

export default WeaverseButton;
