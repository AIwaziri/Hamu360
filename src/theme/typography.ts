/**
 * Typography scale.
 *
 * Font sizes/weights are anchored to the approved wireframe wherever it
 * already establishes a value (Heading L/M/S and Title match the
 * wireframe's `.stat-num`, `.htitle`, `.shell-title`/`.mn`, and `.hub-hname`
 * classes exactly — see the size-by-size notes below); roles the wireframe
 * doesn't need (Display, Button, Code) are interpolated from the same
 * modular scale so they don't feel like a different system bolted on.
 *
 * Units are `px`, not `rem`. This is a deliberate, SPFx-specific choice: an
 * SPFx web part renders directly into the *host* SharePoint page's DOM
 * (there is no isolated iframe / shadow root by default), so a `rem` value
 * would be relative to whatever font-size the tenant's SharePoint theme
 * happens to set on `<html>` — something this app has no control over and
 * cannot assume. `px` is the only unit that renders identically regardless
 * of what page this app is embedded into.
 */

/** Segoe UI first: matches native Windows/Microsoft 365 rendering (most Hamu360 users are on managed Windows devices) without loading a webfont — no new dependency, no FOUT/FOIT. */
export const fontFamilyBase = "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif";

/** Reserved for the `code` role only — numeric/log/identifier display, not used for prose. */
export const fontFamilyMono = "'Cascadia Code', 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace";

export interface ITypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: string;
}

export type TypographyRole =
  | 'display'
  | 'headingXl'
  | 'headingL'
  | 'headingM'
  | 'headingS'
  | 'title'
  | 'bodyLarge'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'button'
  | 'code';

export const typography: Record<TypographyRole, ITypographyToken> = {
  // Reserved for rare, large numeric/empty-state moments. Not used by any
  // wireframe screen directly — sized proportionally above Heading XL.
  display: {
    fontFamily: fontFamilyBase,
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em'
  },
  // Matches the wireframe's `.fin-card i` icon-emphasis size (26px) — the
  // largest text-scale value the approved design actually uses.
  headingXl: {
    fontFamily: fontFamilyBase,
    fontSize: '26px',
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: '-0.01em'
  },
  // Matches `.stat-num` exactly (22px / 600) — the wireframe's KPI number style.
  headingL: {
    fontFamily: fontFamilyBase,
    fontSize: '22px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em'
  },
  // Matches `.htitle` exactly (20px / 600) — the wireframe's section header style.
  headingM: {
    fontFamily: fontFamilyBase,
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0'
  },
  // Matches `.shell-title` / `.mn` exactly (17px / 600).
  headingS: {
    fontFamily: fontFamilyBase,
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: 1.35,
    letterSpacing: '0'
  },
  // Matches `.hub-hname` exactly (15px / 600) — card/panel title weight.
  title: {
    fontFamily: fontFamilyBase,
    fontSize: '15px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0'
  },
  bodyLarge: {
    fontFamily: fontFamilyBase,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0'
  },
  // Matches the wireframe's most common body copy size (13px / 400).
  body: {
    fontFamily: fontFamilyBase,
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0'
  },
  bodySmall: {
    fontFamily: fontFamilyBase,
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.45,
    letterSpacing: '0'
  },
  // Matches the wireframe's frequent 11/11.5px meta-text size.
  caption: {
    fontFamily: fontFamilyBase,
    fontSize: '11px',
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: '0.01em'
  },
  // Matches `.v-badge` (10px / 600) — the wireframe's smallest, all-caps-style chip text.
  label: {
    fontFamily: fontFamilyBase,
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.03em'
  },
  // Deliberately larger/bolder than the wireframe's compact `.sel-btn` chip
  // text (11.5px / 500): the wireframe's chips are miniature UI chrome, but
  // the `button` role governs primary/secondary CTAs across the whole
  // system, which must stay comfortably legible per WCAG typography
  // guidance. Small chip-style controls should use `label`, not `button`.
  button: {
    fontFamily: fontFamilyBase,
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '0'
  },
  code: {
    fontFamily: fontFamilyMono,
    fontSize: '12.5px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0'
  }
};
