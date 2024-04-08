import { Button, type ButtonProps } from '@/components/ui/button';
import type { HydrogenComponentSchema } from '@weaverse/hydrogen';
import { IconEllipse } from '~/components/Icon';
import { forwardRef } from 'react';

const WeaverseButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { href, target, value, variant, ...rest } = props;
    const Component = href ? 'a' : 'button';
    return (
      <Button
        as={Component}
        href={href}
        target={href ? (target || '_self') : undefined}
        variant={variant}
        ref={ref}
        {...rest}
        className={`w-fit mx-auto ${props.className}`}
      >
        {variant === 'primary' ? (
          <>
            <IconEllipse className='absolute inset-0 !w-[148px] !h-[61px] transform transition-transform duration-500 hover:rotate-[-11deg]'
              stroke='rgb(var(--color-foreground))'
              viewBox="0 0 148 61" />
            <div className='flex pl-4 pt-3'>{value}</div>
          </>
        ): (<>{value}</>)}
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
          type: 'select',
          name: 'variant',
          label: 'Variant',
          defaultValue: 'default',
          configs: {
            options: [
              { label: 'Default', value: 'default' },
              { label: 'Outline', value: 'outline' },
              { label: 'Secondary', value: 'secondary' },
              { label: 'Primary', value: 'primary' },
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
              { label: 'Default', value: 'default' },
              { label: 'Small', value: 'sm' },
              { label: 'Large', value: 'lg' },
              { label: 'Icon', value: 'icon' },
            ],
          },
        },
        {
          type: 'text',
          name: 'value',
          label: 'Text',
          defaultValue: 'Button',
        },
        {
          type: 'text',
          name: 'href',
          label: 'Link',
          defaultValue: '',
        },
        {
          type: 'select',
          name: 'target',
          label: 'Target',
          defaultValue: '_blank',
          configs: {
            options: [
              { label: 'Open the current page', value: '_self' },
              { label: 'Open a new page', value: '_blank' },
              { label: 'Open the parent page', value: '_parent' },
              { label: 'Open the first page', value: '_top' },
            ],
          },
        },
      ],
    },
  ],
};

export default WeaverseButton;
