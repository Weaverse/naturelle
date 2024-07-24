import {useThemeSettings} from '@weaverse/hydrogen';

const hexToPercent = (hex: string) => {
  const num = parseInt(hex, 16);
  return Math.floor((num / 255) * 100);
};

function hexToRgbString(hexColor = ''): string {
  hexColor = hexColor.replace('#', '');
  if (hexColor.length === 3) {
    hexColor = hexColor.replace(/(.)/g, '$1$1');
  }
  const r = parseInt(hexColor.substring(0, 2), 16) || '';
  const g = parseInt(hexColor.substring(2, 4), 16) || '';
  const b = parseInt(hexColor.substring(4, 6), 16) || '';
  const a = hexToPercent(hexColor.substring(6, 8)) || '';
  const val = `${r} ${g} ${b}`;
  return `${val}${a ? ` / ${a}%` : ''}`.trim();
}

export function GlobalStyle() {
  const settings = useThemeSettings();
  if (settings) {
    let {
      colorBackground,
      colorBackgroundSubtle,
      colorBackgroundSubtle2,
      colorBackgroundBasic,
      colorForeground,
      colorForegroundSubtle,
      colorForegroundBasic,
      colorPrimary,
      colorPrimaryForeground,
      colorSecondary,
      colorSecondaryForeground,
      colorOutline,
      colorOutlineForeground,
      colorBorder,
      colorBorderSubtle,
    } = settings;
    const {
      bodyBaseSize,
      bodyBaseSpacing,
      bodyBaseLineHeight,
      headingBaseSize,
      headingBaseSpacing,
      headingBaseLineHeight,
      navHeightDesktop,
      navHeightTablet,
      buttonPrimaryBg,
      buttonPrimaryBgHover,
      buttonPrimaryColor,
      buttonPrimaryColorHover,
      buttonPrimaryBorder,
      buttonPrimaryBorderHover,
      buttonSecondaryBg,
      buttonSecondaryBgHover,
      buttonSecondaryColor,
      buttonSecondaryColorHover,
      buttonSecondaryBorder,
      buttonSecondaryBorderHover,
      buttonSubtleBg,
      buttonSubtleBgHover,
      buttonSubtleColor,
      buttonSubtleColorHover,
      buttonSubtleBorder,
      buttonSubtleBorderHover,
      radius,
      pageWidth,
    } = settings;
    colorBackground = hexToRgbString(colorBackground);
    colorBackgroundSubtle = hexToRgbString(colorBackgroundSubtle);
    colorBackgroundSubtle2 = hexToRgbString(colorBackgroundSubtle2);
    colorBackgroundBasic = hexToRgbString(colorBackgroundBasic);
    colorForeground = hexToRgbString(colorForeground);
    colorForegroundSubtle = hexToRgbString(colorForegroundSubtle);
    colorForegroundBasic = hexToRgbString(colorForegroundBasic);
    colorPrimary = hexToRgbString(colorPrimary);
    colorPrimaryForeground = hexToRgbString(colorPrimaryForeground);
    colorSecondary = hexToRgbString(colorSecondary);
    colorSecondaryForeground = hexToRgbString(colorSecondaryForeground);
    colorOutline = hexToRgbString(colorOutline);
    colorOutlineForeground = hexToRgbString(colorOutlineForeground);
    colorBorder = hexToRgbString(colorBorder);
    colorBorderSubtle = hexToRgbString(colorBorderSubtle);
    return (
      <style
        id="global-theme-style"
        key="global-theme-style"
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              /* Colors */
              --color-background: ${colorBackground};
              --color-background-subtle: ${colorBackgroundSubtle};
              --color-background-subtle-2: ${colorBackgroundSubtle2};
              --color-background-basic: ${colorBackgroundBasic};
              --color-foreground: ${colorForeground};
              --color-foreground-subtle: ${colorForegroundSubtle};
              --color-foreground-basic: ${colorForegroundBasic};
              --color-primary: ${colorPrimary};
              --color-primary-foreground: ${colorPrimaryForeground};
              --color-secondary: ${colorSecondary};
              --color-secondary-foreground: ${colorSecondaryForeground};
              --color-outline: ${colorOutline};
              --color-outline-foreground: ${colorOutlineForeground};
              --color-border: ${colorBorder};
              --color-border-subtle: ${colorBorderSubtle};

              /* Typography */
              --body-base-size: ${bodyBaseSize}px;
              --body-base-spacing: ${bodyBaseSpacing};
              --body-base-line-height: ${bodyBaseLineHeight};
              --heading-base-size: ${headingBaseSize}px;
              --heading-base-spacing: ${headingBaseSpacing};
              --heading-base-line-height: ${headingBaseLineHeight};

              /* Button */
              --radius: ${radius}rem;

              /* Layout */
              --height-nav: ${settings.navHeightMobile}rem;
              --page-width: ${pageWidth}px;
            }

            body, button, input, select, textarea {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: 100%;
              font-size: calc(var(--body-base-size) * 0.92);
              letter-spacing: var(--body-base-spacing);
              line-height: var(--body-base-line-height);
              text-rendering: optimizeSpeed;
            }

            .h0, .h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
              letter-spacing: var(--heading-base-spacing);
              line-height: var(--heading-base-line-height);
            }

            /* Mobile sizes */
            h1, .h1 {
              font-size: calc(var(--heading-base-size) * 0.85);
            }
            h2, .h2 {
              font-size: calc(var(--heading-base-size) * 0.63);
            }
            h3, .h3 {
              font-size: calc(var(--heading-base-size) * 0.57);
            }
            h4, .h4 {
              font-size: calc(var(--heading-base-size) * 0.55);
            }

            /* Desktop sizes */
            @media (min-width: 32em) {
              h1, .h1 {
                font-size: var(--heading-base-size);
              }
              h2, .h2 {
                font-size: calc(var(--heading-base-size) * 0.85);
              }
              h3, .h3 {
                font-size: calc(var(--heading-base-size) * 0.7);
              }
            }

            @media (min-width: 32em) {
              body {
                --height-nav: ${navHeightTablet}rem;
              }
            }
            @media (min-width: 48em) {
              body {
                --height-nav: ${navHeightDesktop}rem;
              }
            }
            .btn-primary{
              background-color: ${buttonPrimaryBg};
              color: ${buttonPrimaryColor};
              border: 2px solid ${buttonPrimaryBorder};
            }
            .btn-primary:hover{
              background-color: ${buttonPrimaryBgHover}!important;
              color: ${buttonPrimaryColorHover}!important;
              border: 2px solid ${buttonPrimaryBorderHover} !important;
              transition: 0.3s background-color color border;
            }
            .btn-secondary{
              background-color: ${buttonSecondaryBg};
              color: ${buttonSecondaryColor};
              border: 2px solid ${buttonSecondaryBorder};
            }
            .btn-secondary:hover{
              background-color: ${buttonSecondaryBgHover}!important;
              color: ${buttonSecondaryColorHover}!important;
              border: 2px solid ${buttonSecondaryBorderHover} !important;
              transition: 0.3s background-color color border;
            }
            .btn-subtle{
              background-color: ${buttonSubtleBg};
              color: ${buttonSubtleColor};
              border: 2px solid ${buttonSubtleBorder};
            }
            .btn-subtle:hover{
              background-color: ${buttonSubtleBgHover}!important;
              color: ${buttonSubtleColorHover}!important;
              border: 2px solid ${buttonSubtleBorderHover} !important;
              transition: 0.3s background-color color border;
            }
          `,
        }}
      />
    );
  }
  return null;
}
