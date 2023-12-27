import {Button, type ButtonProps} from '@/components/ui/button';
import type {HydrogenComponentSchema} from '@weaverse/hydrogen';
import {forwardRef} from 'react';

const WeaverseButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return (
      <Button ref={ref} {...props}>
        {props.value}
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
              {label: 'Default', value: 'default'},
              {label: 'Destructive', value: 'destructive'},
              {label: 'Outline', value: 'outline'},
              {label: 'Secondary', value: 'secondary'},
              {label: 'Ghost', value: 'ghost'},
              {label: 'Link', value: 'link'},
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
          type: 'text',
          name: 'target',
          label: 'Target',
          defaultValue: '',
        },
      ],
    },
  ],
};

export default WeaverseButton;
