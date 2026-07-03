/**
 * Static design tokens: brand palette + spacing scale. These are the
 * fallback values used before SharePoint's tenant theme has loaded (or in
 * the local workbench, where there is no tenant theme at all), and the base
 * that `createAppTheme` layers the live SharePoint theme on top of.
 *
 * Values are placeholders for Sprint 0 — swap `brand.primary` etc. for
 * Hamu360's actual brand colors once the design team provides them.
 */
export const colorTokens = {
  brand: {
    primary: '#03787c',
    primaryDark: '#014446'
  },
  neutral: {
    bodyText: '#323130',
    bodySubtext: '#605e5c',
    bodyBackground: '#ffffff'
  }
} as const;

/** 4px base spacing scale, matches the SCSS variables in `src/styles/_variables.scss`. */
export const spacingTokens = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px'
} as const;
