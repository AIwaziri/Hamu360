/**
 * Motion tokens. The wireframe (a static mockup) has no animation to anchor
 * these to, so durations/easings follow the same restrained, "quiet"
 * character as the rest of the palette: short durations, standard
 * (not bouncy/springy) easing — motion that reads as precise and
 * professional rather than playful, consistent with the "Executive,
 * Trustworthy" design goals.
 *
 * These are the *source values*; the actual `prefers-reduced-motion`
 * enforcement lives in `src/styles/global.scss` (a single global rule is
 * more reliable than asking every component to remember to check a media
 * query) — see `usePrefersReducedMotion` in `src/hooks` for the rare case a
 * component needs the same signal in JS (e.g. to skip a JS-driven animation
 * entirely rather than just shortening its CSS transition).
 */

export const duration = {
  instant: '0ms',
  fast: '120ms',
  base: '180ms',
  moderate: '240ms',
  slow: '320ms',
  slower: '480ms'
} as const;

export type DurationToken = keyof typeof duration;

export const easing = {
  /** Default for most transitions — balanced acceleration/deceleration. */
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Entering elements (menus, tooltips appearing). */
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Exiting elements (dismissing a menu/tooltip). */
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Small, snappy state changes (hover, focus, press). */
  sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
} as const;

export type EasingToken = keyof typeof easing;

/**
 * Named composites for the interaction categories the brief calls out —
 * each just pairs a duration with an easing, so a component writes
 * `transition: transform var(--h360-motion-hover)` instead of assembling
 * duration+easing by hand every time.
 */
export const motionPresets = {
  hover: `${duration.fast} ${easing.sharp}`,
  scale: `${duration.base} ${easing.standard}`,
  fade: `${duration.base} ${easing.standard}`,
  slide: `${duration.moderate} ${easing.decelerate}`,
  focus: `${duration.fast} ${easing.sharp}`
} as const;

export type MotionPresetToken = keyof typeof motionPresets;
