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

/**
 * Arial first — Sprint A4. The approved wireframe's one and only font-family
 * declaration is `body { font-family: Arial, sans-serif; }`, and Sprint A4's
 * mandate ("the HTML wireframe is the Platform of Truth; replicate
 * typography faithfully") makes the family the first thing to match: Arial
 * and Segoe UI differ visibly in x-height, letterform width, and terminal
 * shapes at the small sizes this design leans on. Arial ships on every
 * Windows/macOS device Hamu360 targets, so the original rationale for Segoe
 * UI (no webfont, no FOUT/FOIT) holds just as well for Arial. Helvetica is
 * the metric-compatible fallback on platforms where Arial is aliased.
 */
export const fontFamilyBase = "Arial, 'Helvetica Neue', Helvetica, sans-serif";

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
  | 'captionStrong'
  | 'caption'
  | 'labelStrong'
  | 'label'
  | 'micro'
  | 'microLabel'
  | 'badge'
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
  // Sprint A4 — matches `.mp-name`/`.hub-name` exactly (11px / 600): the
  // wireframe's small-but-emphatic name/title style (Partner name, Hub Card
  // title). Same size as `caption`, at the wireframe's actual 600 weight.
  captionStrong: {
    fontFamily: fontFamilyBase,
    fontSize: '11px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0'
  },
  // Matches the wireframe's frequent 11/10.5px meta-text size. Sprint A4:
  // weight corrected 500 → 400 and letter-spacing 0.01em → 0 to match the
  // wireframe's `.ni` (nav items, 10.5px / regular / no tracking) — the
  // role's remaining call sites all wanted regular weight; the emphatic
  // 11px sites moved to `captionStrong` above.
  caption: {
    fontFamily: fontFamilyBase,
    fontSize: '11px',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0'
  },
  // Sprint A4 — matches `.lt` (logo wordmark) and `.ev-d` (event date-box
  // day numeral) exactly (12px / 600). Closes DESIGN_TOKEN_DEBT.md entry 5.
  labelStrong: {
    fontFamily: fontFamilyBase,
    fontSize: '12px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0'
  },
  // Matches `.wt`/`.ev-title`/`.jname`/`.dn` exactly (10px / 600) — the
  // wireframe's widget-title and row-title style. Sprint A4: letter-spacing
  // 0.03em → 0; none of the wireframe's 10px/600 sites set any tracking
  // (uppercase eyebrow uses override tracking per-site, as the wireframe
  // itself does).
  label: {
    fontFamily: fontFamilyBase,
    fontSize: '10px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0'
  },
  // Sprint A4 — the wireframe's small body copy cluster (9.5px / 400:
  // `.mp-msg`, `.anr-t`, `.ql`, `.rrtxt`, `.wrtxt`; `.hgreet`/`.srch` sit
  // within 0.5px). Closes the larger half of DESIGN_TOKEN_DEBT.md entry 3.
  micro: {
    fontFamily: fontFamilyBase,
    fontSize: '9.5px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0'
  },
  // Sprint A4 — the wireframe's metadata cluster (8–8.5px / 400:
  // `.ev-sub`, `.jrole`, `.hub-sub`, `.hcl`, `.mp-role`, `.mp-date`,
  // `.anr-dt`, `.rrdate`, `.ls`, `.ft`). 8.5px is the cluster's mode; the
  // 7.5–8px members land within 1px. Closes the smaller half of
  // DESIGN_TOKEN_DEBT.md entry 3.
  microLabel: {
    fontFamily: fontFamilyBase,
    fontSize: '8.5px',
    fontWeight: 400,
    lineHeight: 1.4,
    letterSpacing: '0'
  },
  // Sprint A4 — matches `.jbadge`/`.wrtag` exactly (7px / 700): the
  // wireframe's tiny bold chip/tag style. Decorative, always paired with a
  // tinted background and redundant adjacent text — never the sole carrier
  // of information (see accessibility note in Sprint A4's report).
  badge: {
    fontFamily: fontFamilyBase,
    fontSize: '7px',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '0'
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
