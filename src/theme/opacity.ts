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
  disabled: 0.4,
  muted: 0.65,
  backdrop: 0.5,
  full: 1
} as const;

export type OpacityToken = keyof typeof opacity;
