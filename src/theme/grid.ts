import type { BreakpointToken } from './breakpoints';

/**
 * Layout grid tokens. `maxContentWidth` (1180px) and the mobile
 * `containerPadding` (16px horizontal) are exact matches for the
 * wireframe's own `.shell { max-width: 1180px; padding: 24px 16px; }` —
 * the single most load-bearing measurement for reproducing the approved
 * layout, since it governs every page's outer gutter.
 */
export const grid: {
  columns: 12;
  maxContentWidth: 1180;
  containerPadding: Record<BreakpointToken, number>;
  gutter: 16;
  sectionSpacing: Record<BreakpointToken, number>;
} = {
  columns: 12,
  /** Content never exceeds this width, regardless of viewport — matches the wireframe's `.shell` exactly. */
  maxContentWidth: 1180,
  /** Horizontal container padding, mobile-first: 16px base, widening at tablet+ to match the wireframe's desktop gutter feel without cramping small screens. */
  containerPadding: {
    smallMobile: 16,
    mobile: 16,
    tablet: 24,
    laptop: 24,
    desktop: 24
  },
  /** Gap between grid columns. */
  gutter: 16,
  /** Vertical rhythm between major page sections — grows with viewport so dense mobile layouts don't inherit desktop's more generous breathing room. */
  sectionSpacing: {
    smallMobile: 32,
    mobile: 32,
    tablet: 48,
    laptop: 48,
    desktop: 64
  }
};
