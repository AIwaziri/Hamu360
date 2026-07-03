/**
 * Breakpoint tokens. Mobile-first: each value is a *minimum* width at which
 * that tier's layout rules start to apply, matching the mobile-first
 * mixins in `src/styles/_breakpoints.scss`.
 *
 * `laptop` (1024px) is chosen deliberately so the wireframe's own
 * `max-width: 1180px` container comfortably fits starting at the `desktop`
 * tier, while `laptop` still gets a usable, slightly narrower layout rather
 * than jumping straight from tablet to full-width desktop.
 *
 * These values are also hand-mirrored as literal numbers in
 * `src/styles/_breakpoints.scss`'s `@media` mixins. CSS custom properties
 * cannot be used inside an `@media` feature query per spec, so — unlike
 * every other token category — breakpoints cannot be delivered to SCSS via
 * `ThemeProvider`'s runtime CSS variables; a literal-value mirror is the
 * only option. This is the same accepted tradeoff Sprint 0 documented for
 * spacing, scoped down to just this one token category where it's actually
 * unavoidable.
 */
export const breakpoints = {
  smallMobile: 0,
  mobile: 375,
  tablet: 768,
  laptop: 1024,
  desktop: 1280
} as const;

export type BreakpointToken = keyof typeof breakpoints;
