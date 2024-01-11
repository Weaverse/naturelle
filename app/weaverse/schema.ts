import type {HydrogenThemeSchema} from '@weaverse/hydrogen';
export const themeSchema: HydrogenThemeSchema = {
  info: {
    version: '1.0.0',
    author: 'Weaverse',
    name: 'Pilot',
    authorProfilePhoto:
      'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Weaverse_logo_-_3000x_e2fa8c13-dac2-4dcb-a2c2-f7aaf7a58169.png?v=1698245759',
    documentationUrl: 'https://weaverse.io/docs',
    supportUrl: 'https://weaverse.io/contact',
  },
  inspector: [
    {
      group: 'Logo',
      inputs: [
        {
          type: 'image',
          name: 'logoData',
          label: 'Logo',
          defaultValue: {
            id: 'gid://shopify/MediaImage/34144817938616',
            altText: 'Logo',
            url: 'https://cdn.shopify.com/s/files/1/0623/5095/0584/files/Pilot_logo_b04f1938-06e5-414d-8a47-d5fcca424000.png?v=1697101908',
            width: 320,
            height: 116,
          },
        },
      ],
    },
    {
      group: 'Colors',
      inputs: [
        {
          type: 'color',
          label: 'Background',
          name: 'colorBackground',
          defaultValue: '#EEEFEA',
        },
        {
          type: 'color',
          label: 'Subtle background',
          name: 'colorBackgroundSubtle',
          defaultValue: '#E5E6D4',
        },
        {
          type: 'color',
          label: 'Subtle background 2',
          name: 'colorBackgroundSubtle2',
          defaultValue: '#C5C6BB',
        },
        {
          type: 'color',
          label: 'Basic background',
          name: 'colorBackgroundBasic',
          defaultValue: '#FFFFFF',
        },
        {
          type: 'color',
          label: 'Foreground',
          name: 'colorForeground',
          defaultValue: '#3D490B',
        },
        {
          type: 'color',
          label: 'Subtle foreground',
          name: 'colorForegroundSubtle',
          defaultValue: '#8B926D',
        },
        {
          type: 'color',
          label: 'Basic foreground',
          name: 'colorForegroundBasic',
          defaultValue: '#FFFFFF',
        },
        {
          type: 'color',
          label: 'Primary',
          name: 'colorPrimary',
          defaultValue: '#3D490B',
        },
        {
          type: 'color',
          label: 'Primary foreground',
          name: 'colorPrimaryForeground',
          defaultValue: '#EAEAD6',
        },
        {
          type: 'color',
          label: 'Secondary',
          name: 'colorSecondary',
          defaultValue: '#F8F8F0',
        },
        {
          type: 'color',
          label: 'Secondary foreground',
          name: 'colorSecondaryForeground',
          defaultValue: '#3D490B',
        },
        {
          type: 'color',
          label: 'Outline',
          name: 'colorOutline',
          defaultValue: '#3D490B',
        },
        {
          type: 'color',
          label: 'Outline foreground',
          name: 'colorOutlineForeground',
          defaultValue: '#3D490B',
        },
        {
          type: 'color',
          label: 'Border',
          name: 'colorBorder',
          defaultValue: '#3D490B',
        },
        {
          type: 'color',
          label: 'Border subtle',
          name: 'colorBorderSubtle',
          defaultValue: '#C5C8B6',
        },
      ],
    },
    {
      group: 'Typography',
      inputs: [
        {
          type: 'heading',
          label: 'Headings',
        },
        {
          type: 'select',
          label: 'Letter spacing',
          name: 'headingBaseSpacing',
          configs: {
            options: [
              {label: '-75', value: '-0.075em'},
              {label: '-50', value: '-0.05em'},
              {label: '-25', value: '-0.025em'},
              {label: '0', value: '0em'},
              {label: '25', value: '0.025em'},
              {label: '50', value: '0.05em'},
              {label: '75', value: '0.075em'},
              {label: '100', value: '0.1em'},
              {label: '150', value: '0.15em'},
              {label: '200', value: '0.2em'},
              {label: '250', value: '0.25em'},
            ],
          },
          defaultValue: '0.025em',
        },
      ],
    },
    {
      group: 'Layout',
      inputs: [
        {
          type: 'range',
          label: 'Nav height (mobile)',
          name: 'navHeightMobile',
          configs: {
            min: 2,
            max: 8,
            step: 1,
            unit: 'rem',
          },
          defaultValue: 3,
        },
      ],
    },
    {
      group: 'Buttons',
      inputs: [
        {
          type: 'heading',
          label: 'Primary',
        },
        {
          type: 'color',
          label: 'Background color',
          name: 'buttonPrimaryBg',
          defaultValue: '#000',
        },
      ],
    },
  ],
};
