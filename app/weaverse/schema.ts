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
      group: 'Header',
      inputs: [
        {
          type: "toggle-group",
          label: "Header menu type for desktop",
          name: "typeMenuHeader",
          configs: {
            options: [
              { value: "mega", label: "Mega" },
              { value: "drawer", label: "Drawer" },
            ]
          },
          defaultValue: "mega"
        },
        {
          type: "switch",
          label: "Enable transparent header",
          name: "enableTransparentHeader",
          defaultValue: true,
        },
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
        {
          type: 'image',
          name: 'transparentLogoData',
          label: 'Trasparent Logo',
          defaultValue: {
            altText: 'Logo',
            url: 'https://cdn.shopify.com/s/files/1/0652/5888/1081/files/Property_1_White.png?v=1720064102',
            width: 320,
            height: 116,
          },
        },
        {
          type: "toggle-group",
          label: "Search type for desktop",
          name: "searchType",
          configs: {
            options: [
              { value: "popupSearch", label: "Popup search" },
              { value: "drawerSearch", label: "Drawer search" },
            ]
          },
          defaultValue: "headerSearch"
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
              {label: '-12.5', value: '-0.0125em'},
              {label: '0', value: '0em'},
              {label: '12.5', value: '0.0125em'},
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
          type: "range",
          label: "Page width",
          name: "pageWidth",
          configs: {
            min: 1000,
            max: 1600,
            step: 10,
            unit: "px",
          },
          defaultValue: 1440,
        },
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
        {
          type: "range",
          label: "Nav height (tablet)",
          name: "navHeightTablet",
          configs: {
            min: 2,
            max: 8,
            step: 1,
            unit: "rem",
          },
          defaultValue: 4,
        },
        {
          type: "range",
          label: "Nav height (desktop)",
          name: "navHeightDesktop",
          configs: {
            min: 2,
            max: 8,
            step: 1,
            unit: "rem",
          },
          defaultValue: 6,
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
    {
      group: 'Quick view',
      inputs: [
        {
          type: 'text',
          label: 'Add to cart text',
          name: 'addToCartText',
          defaultValue: 'Add to cart',
          placeholder: 'Add to cart',
        },
        {
          type: 'text',
          label: 'Sold out text',
          name: 'soldOutText',
          defaultValue: 'Sold out',
          placeholder: 'Sold out',
        },
        {
          type: 'text',
          label: 'Unavailable text',
          name: 'unavailableText',
          defaultValue: 'Unavailable',
          placeholder: 'Unavailable',
        },
        {
          type: 'switch',
          label: 'Show vendor',
          name: 'showVendor',
          defaultValue: true,
        },
        {
          type: 'switch',
          label: 'Show sale price',
          name: 'showSalePrice',
          defaultValue: true,
        },
        {
          type: 'switch',
          label: 'Show details',
          name: 'showDetails',
          defaultValue: true,
        },
        {
          type: 'switch',
          label: 'Show shipping policy',
          name: 'showShippingPolicy',
          defaultValue: true,
        },
        {
          type: 'switch',
          label: 'Show refund policy',
          name: 'showRefundPolicy',
          defaultValue: true,
        },
        {
          label: 'Hide unavailable options',
          type: 'switch',
          name: 'hideUnavailableOptions',
        },
        {
          label: 'Show thumbnails',
          name: 'showThumbnails',
          type: 'switch',
          defaultValue: true,
        },
        {
          label: 'Number of thumbnails',
          name: 'numberOfThumbnails',
          type: 'range',
          condition: 'showThumbnails.eq.true',
          configs: {
            min: 1,
            max: 10,
          },
          defaultValue: 4,
        },
        {
          label: 'Gap between images',
          name: 'spacing',
          type: 'range',
          configs: {
            min: 0,
            step: 2,
            max: 100,
          },
          defaultValue: 10,
        },
      ],
    }
  ],
};
