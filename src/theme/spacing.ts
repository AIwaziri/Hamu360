/**
 * Spacing scale. The numeric scale below is the exact set requested by the
 * Sprint 1 brief — it is deliberately *not* a literal transcription of the
 * wireframe's every hand-tuned gap/padding value (the wireframe uses values
 * like 5, 7, 9, 11, 13, 14, 15, 18px in various places, typical of a
 * hand-tuned mockup). A design system's job is to replace that kind of ad
 * hoc fine-tuning with a small, disciplined set of steps that every future
 * component rounds to — components should pick the nearest scale step
 * rather than each inventing their own one-off pixel value. Colors,
 * typography, radius, and shadows are reproduced from the wireframe
 * exactly because those *are* the brand; spacing is systematized on
 * purpose.
 */

/** Raw numeric scale (px), keyed by its own value — mirrors the exact numbers requested in the brief. */
export const spacingScale = {
  0: 0,
  2: 2,
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  64: 64,
  80: 80,
  96: 96
} as const;

export type SpacingScaleKey = keyof typeof spacingScale;

/**
 * Semantic aliases for the steps components reach for most often. The full
 * numeric scale above remains available (via `spacingScale`) for the less
 * common in-between steps (12, 20, 40, 80, 96) — semantic names are only
 * assigned "where appropriate", per the brief, rather than forcing an
 * awkward name onto every single step.
 */
export const spacing = {
  none: spacingScale[0],
  xxs: spacingScale[2],
  xs: spacingScale[4],
  sm: spacingScale[8],
  md: spacingScale[16],
  lg: spacingScale[24],
  xl: spacingScale[32],
  xxl: spacingScale[48],
  xxxl: spacingScale[64]
} as const;

export type SpacingToken = keyof typeof spacing;

/** Ordered list of semantic keys — used to generate matching SCSS utility classes (`gap-md`, `spacing-lg`, ...) via a single `@each` loop instead of hand-writing one class per key. Keep in sync with the keys of `spacing` above. */
export const spacingTokenOrder: SpacingToken[] = ['none', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'];
