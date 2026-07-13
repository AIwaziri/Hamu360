/**
 * Opacity scale. `hoverOverlay`/`activeOverlay` are the numeric alphas
 * already baked into `colors.ts`'s `hover`/`active` rgba tokens — exposed
 * separately here for the rare case a component needs to compose its own
 * overlay against a non-primary color rather than using the pre-mixed
 * token directly.
 */
export const opacity = {
  transparent: 0,
  hoverOverlay: 0.04,
  activeOverlay: 0.08,
  // Sprint A5 — the wireframe's strong wash family, previously all
  // approximated at `activeOverlay` (0.08, less than half strength):
  // `.ni.on`'s gold active-nav wash is exactly 0.18; the Partner Message
  // avatar ring (0.2) and the search box border (0.15) ride the same step
  // within ±0.03. Resolves the overlay half of DESIGN_TOKEN_DEBT.md #1.
  strongOverlay: 0.18,
  // Sprint A5 — the wireframe's white-on-navy text ladder, previously
  // collapsed onto `muted`/`disabled`. `faint` = the 0.32/0.33 timestamp
  // and footer step; `subtle` = the 0.5 placeholder/subtitle step;
  // `soft` = the 0.78 body-copy step (`.mp-msg`, `.anr-t`; `.ql` at 0.75
  // rides it within 0.03). `disabled` (0.4) and `muted` (0.65) already
  // matched the wireframe's 0.4 and 0.6–0.65 steps exactly or nearly.
  faint: 0.33,
  disabled: 0.4,
  subtle: 0.5,
  muted: 0.65,
  soft: 0.78,
  backdrop: 0.5,
  full: 1
} as const;

export type OpacityToken = keyof typeof opacity;
