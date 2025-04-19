import { useThemeSettings } from "@weaverse/hydrogen";

const hexToPercent = (hex: string) => {
  const num = Number.parseInt(hex, 16);
  return Math.floor((num / 255) * 100);
};

function hexToRgbString(hexColor = ""): string {
  hexColor = hexColor.replace("#", "");
  if (hexColor.length === 3) {
    hexColor = hexColor.replace(/(.)/g, "$1$1");
  }
  const r = Number.parseInt(hexColor.substring(0, 2), 16) || "";
  const g = Number.parseInt(hexColor.substring(2, 4), 16) || "";
  const b = Number.parseInt(hexColor.substring(4, 6), 16) || "";
  const a = hexToPercent(hexColor.substring(6, 8)) || "";
  const val = `${r} ${g} ${b}`;
  return `${val}${a ? ` / ${a}%` : ""}`.trim();
}

export function GlobalStyle() {
  const settings = useThemeSettings();
  if (settings) {
    let {
      colorBackground,
      colorTextPrimary,
      colorTextSubtle,
      colorTextInverse,
      topbarTextColor,
      topbarBorderColor,
      topbarBgColor,
      headerText,
      transparentHeader,
      headerBgColor,
      footerText,
      footerBgColor,
      borderColor,
      borderSubtleColor,
      drawerBgColor,
      buttonTextPrimary,
      buttonBgColorPrimary,
      buttonBorderColorPrimary,
      buttonTextHoverPrimary,
      buttonBgHoverPrimary,
      buttonBorderHoverPrimary,
      buttonTextSecondary,
      buttonBgColorSecondary,
      buttonBorderColorSecondary,
      buttonTextHoverSecondary,
      buttonBgHoverSecondary,
      buttonBorderHoverSecondary,
      buttonTextOutline,
      buttonBorderColorOutline,
      buttonTextHoverOutline,
      buttonBorderHoverOutline,
      labelText,
      labelBgSale,
      labelBgNew,
      labelBgSoldOut,
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
      footerMenuBackgroundColor,
      pageWidth,
    } = settings;
    colorBackground = hexToRgbString(colorBackground);
    colorTextPrimary = hexToRgbString(colorTextPrimary);
    colorTextSubtle = hexToRgbString(colorTextSubtle);
    colorTextInverse = hexToRgbString(colorTextInverse);
    borderColor = hexToRgbString(borderColor);
    borderSubtleColor = hexToRgbString(borderSubtleColor);
    labelText = hexToRgbString(labelText);
    labelBgSale = hexToRgbString(labelBgSale);
    labelBgNew = hexToRgbString(labelBgNew);
    labelBgSoldOut = hexToRgbString(labelBgSoldOut);
    return (
      <style
        id="global-theme-style"
        key="global-theme-style"
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              /* Colors */
              --color-background: ${colorBackground};
              --color-text-primary: ${colorTextPrimary};
              --color-text-subtle: ${colorTextSubtle};
              --color-text-inverse: ${colorTextInverse};

              --color-topbar-text: ${topbarTextColor};
              --color-topbar-border: ${topbarBorderColor};
              --color-topbar-bg: ${topbarBgColor};

              --color-header-text: ${headerText};
              --color-transparent-header: ${transparentHeader};
              --color-header-bg: ${headerBgColor};

              --color-footer-text: ${footerText};
              --color-footer-bg: ${footerBgColor};

              --color-border: ${borderColor};
              --color-border-subtle: ${borderSubtleColor};
              --color-drawer-bg: ${drawerBgColor};

              --color-label-text: ${labelText};
              --color-label-bg-sale: ${labelBgSale};
              --color-label-bg-new: ${labelBgNew};
              --color-label-bg-soldout: ${labelBgSoldOut};
              

              /* Typography */
              --body-base-size: ${bodyBaseSize}px;
              --body-base-spacing: ${bodyBaseSpacing};
              --body-base-line-height: ${bodyBaseLineHeight};
              --heading-base-size: ${headingBaseSize}px;
              --heading-base-spacing: ${headingBaseSpacing};
              --heading-base-line-height: ${headingBaseLineHeight};

              /* Layout */
              --height-nav: ${settings.navHeightMobile}rem;
              --page-width: ${pageWidth}px;
              --footer-menu-background-color: ${footerMenuBackgroundColor};
            }

            body, button, input, select, textarea {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: 100%;
              font-size: var(--body-base-size);
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
            h5, .h5 {
              font-size: calc(var(--heading-base-size) * 0.44);
            }
            h6, .h6 {
              font-size: calc(var(--heading-base-size) * 0.37);
            }

            /* Desktop sizes */
            @media (min-width: 32em) {
              h1, .h1 {
                font-size: var(--heading-base-size);
              }
              h2, .h2 {
                font-size: calc(var(--heading-base-size) * 0.828125);
              }
              h3, .h3 {
                font-size: calc(var(--heading-base-size) * 0.6875);
              }
              h4, .h4 {
                font-size: calc(var(--heading-base-size) * 0.578125);
              }
              h5, .h5 {
                font-size: calc(var(--heading-base-size) * 0.484375);
              }
              h6, .h6 {
                font-size: calc(var(--heading-base-size) * 0.40625);
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
              background-color: ${buttonBgColorPrimary};
              color: ${buttonTextPrimary}!important;
              border: 1px solid ${buttonBorderColorPrimary};
            }
            .btn-primary:hover{
              background-color: ${buttonBgHoverPrimary}!important;
              color: ${buttonTextHoverPrimary}!important;
              border: 1px solid ${buttonBorderHoverPrimary}!important;
              transition: 0.3s background-color color border;
            }
            .btn-secondary{
              background-color: ${buttonBgColorSecondary};
              color: ${buttonTextSecondary}!important;
              border: 1px solid ${buttonBorderColorSecondary};
            }
            .btn-secondary:hover{
              background-color: ${buttonBgHoverSecondary}!important;
              color: ${buttonTextHoverSecondary}!important;
              border: 1px solid ${buttonBorderHoverSecondary}!important;
              transition: 0.3s background-color color border;
            }
            .btn-outline{
              color: ${buttonTextOutline}!important;
              border: 1px solid ${buttonBorderColorOutline};
            }
            .btn-outline:hover{
              color: ${buttonTextHoverOutline}!important;
              border: 1px solid ${buttonBorderHoverOutline} !important;
              transition: 0.3s background-color color border;
            }
          `,
        }}
      />
    );
  }
  return null;
}
