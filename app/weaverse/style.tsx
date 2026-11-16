import { useThemeSettings } from "@weaverse/hydrogen";

export function GlobalStyle() {
  const settings = useThemeSettings();
  if (settings) {
    const {
      colorBackground,
      colorBackgroundSubtle1,
      colorBackgroundSubtle2,
      colorBackgroundBasic,
      colorTextPrimary,
      colorText,
      colorTextSubtle,
      colorTextInverse,
      topbarTextColor,
      topbarBorderColor,
      topbarBgColor,
      headerText,
      transparentHeader,
      headerBgColor,
      headerBgColorSecondary,
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
      buttonTextActivePrimary,
      buttonBgActivePrimary,
      buttonBorderActivePrimary,
      buttonTextSecondary,
      buttonBgColorSecondary,
      buttonBorderColorSecondary,
      buttonTextHoverSecondary,
      buttonBgHoverSecondary,
      buttonBorderHoverSecondary,
      buttonTextActiveSecondary,
      buttonBgActiveSecondary,
      buttonBorderActiveSecondary,
      buttonTextOutline,
      buttonBorderColorOutline,
      buttonTextHoverOutline,
      buttonBorderHoverOutline,
      buttonTextActiveOutline,
      buttonBorderActiveOutline,
      labelBgSave,
      labelBgNew,
      labelBgSoldOut,
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

    return (
      <style
        id="global-theme-style"
        key="global-theme-style"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              /* Colors */
              --color-background: ${colorBackground};
              --color-background-subtle-1: ${colorBackgroundSubtle1};
              --color-background-subtle-2: ${colorBackgroundSubtle2};
              --color-background-basic: ${colorBackgroundBasic};
              --color-text-primary: ${colorTextPrimary};
              --color-text: ${colorText};
              --color-text-subtle: ${colorTextSubtle};
              --color-text-inverse: ${colorTextInverse};

              --color-topbar-text: ${topbarTextColor};
              --color-topbar-border: ${topbarBorderColor};
              --color-topbar-bg: ${topbarBgColor};

              --color-header-text: ${headerText};
              --color-transparent-header: ${transparentHeader};
              --color-header-bg: ${headerBgColor};
              --color-header-bg-secondary: ${headerBgColorSecondary};

              --color-footer-text: ${footerText};
              --color-footer-bg: ${footerBgColor};

              --color-border: ${borderColor};
              --color-border-subtle: ${borderSubtleColor};
              --color-drawer-bg: ${drawerBgColor};

              --color-label-bg-save: ${labelBgSave};
              --color-label-bg-new: ${labelBgNew};
              --color-label-bg-soldout: ${labelBgSoldOut};

              --color-button-primary-text: ${buttonTextPrimary};
              --color-button-primary-background: ${buttonBgColorPrimary};
              

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
              cursor: pointer;
            }
            .btn-primary:hover{
              background-color: ${buttonBgHoverPrimary}!important;
              color: ${buttonTextHoverPrimary}!important;
              border: 1px solid ${buttonBorderHoverPrimary}!important;
              transition: 0.3s background-color color border;
            }
            .btn-primary:active{
              background-color: ${buttonBgActivePrimary}!important;
              color: ${buttonTextActivePrimary}!important;
              border-color: ${buttonBorderActivePrimary}!important;
            }
            .btn-secondary{
              background-color: ${buttonBgColorSecondary};
              color: ${buttonTextSecondary}!important;
              border: 1px solid ${buttonBorderColorSecondary};
              cursor: pointer;
            }
            .btn-secondary:hover{
              background-color: ${buttonBgHoverSecondary}!important;
              color: ${buttonTextHoverSecondary}!important;
              border: 1px solid ${buttonBorderHoverSecondary}!important;
              transition: 0.3s background-color color border;
            }
            .btn-secondary:active{
              background-color: ${buttonBgActiveSecondary}!important;
              color: ${buttonTextActiveSecondary}!important;
              border-color: ${buttonBorderActiveSecondary}!important;
            }
            .btn-outline{
              color: ${buttonTextOutline}!important;
              border: 1px solid ${buttonBorderColorOutline};
            }
            .btn-outline:hover{
              color: ${buttonTextHoverOutline}!important;
              border: 1px solid ${buttonBorderHoverOutline} !important;
              transition: 0.3s color border;
            }
            .btn-outline:active{
              color: ${buttonTextActiveOutline}!important;
              border-color: ${buttonBorderActiveOutline}!important;
            }
          `,
        }}
      />
    );
  }
  return null;
}
