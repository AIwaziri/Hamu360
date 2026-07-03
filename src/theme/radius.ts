/**
 * Border radius scale. Anchored to the wireframe's own observed values
 * (3–10px across its cards, chips, and buttons) rather than a generic
 * default like Fluent's 2/4px — the approved design reads as noticeably
 * softer/rounder than stock Fluent, which is part of what makes it feel
 * like a bespoke product rather than "generic SharePoint styling".
 */
export const radius = {
  small: '4px',
  medium: '6px',
  large: '8px',
  xl: '10px',
  /** Fully rounded regardless of element height — chips, tags, status pills. */
  pill: '9999px',
  /** Only correct on elements with equal width/height (avatars, status dots). */
  circle: '50%'
} as const;

export type RadiusToken = keyof typeof radius;
