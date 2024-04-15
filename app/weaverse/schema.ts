import type {HydrogenThemeSchema} from '@weaverse/hydrogen';
let variantSwatch = {
  configs: [],
  swatches: {
    imageSwatches: [],
    colorSwatches: [],
  },
};
export const themeSchema: HydrogenThemeSchema = {
  info: {
    version: '1.0.0',
    author: 'Weaverse',
    name: 'Naturélle',
    authorProfilePhoto:
      'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/Weaverse_logo_-_3000x_e2fa8c13-dac2-4dcb-a2c2-f7aaf7a58169.png?v=1698245759',
    documentationUrl: 'https://weaverse.io/docs',
    supportUrl: 'https://weaverse.io/contact',
  },
  inspector: [
    {
      group: 'Product swatches',
      inputs: [
        {
          type: 'swatches',
          name: 'swatches',
          label: 'Config swatches',
          defaultValue: variantSwatch,
        },
      ],
    },
    {
      group: 'Logo',
      inputs: [
        {
          type: 'image',
          name: 'logoData',
          label: 'Logo',
          defaultValue: {
            altText: 'Logo',
            url: 'https://cdn.shopify.com/s/files/1/0838/0052/3057/files/naturelle_logo.png?v=1705045487',
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
          defaultValue: '#9AA473',
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
        {
          type: 'range',
          label: 'Font size',
          name: 'headingBaseSize',
          configs: {
            min: 22,
            max: 60,
            step: 1,
            unit: 'px',
          },
          defaultValue: 38,
        },
        {
          type: 'range',
          label: 'Line height',
          name: 'headingBaseLineHeight',
          configs: {
            min: 0.8,
            max: 2,
            step: 0.1,
          },
          defaultValue: 1.2,
        },
        {
          type: 'heading',
          label: 'Body text',
        },
        {
          type: 'select',
          label: 'Letter spacing',
          name: 'bodyBaseSpacing',
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
        {
          type: 'range',
          label: 'Font size',
          name: 'bodyBaseSize',
          configs: {
            min: 12,
            max: 48,
            step: 1,
            unit: 'px',
          },
          defaultValue: 18,
        },
        {
          type: 'range',
          label: 'Line height',
          name: 'bodyBaseLineHeight',
          configs: {
            min: 0.8,
            max: 2,
            step: 0.1,
          },
          defaultValue: 1.2,
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
          type: 'range',
          label: 'Corner radius',
          name: 'radius',
          configs: {
            min: 0,
            max: 2,
            step: 0.1,
            unit: 'rem',
          },
          defaultValue: 2,
        },
      ],
    },
  ],
};
