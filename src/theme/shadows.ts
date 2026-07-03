/**
 * Elevation system. The wireframe uses exactly one `box-shadow` value —
 * `0 4px 24px rgba(13, 31, 60, 0.1)` — but it's a telling one: a
 * *navy-tinted* shadow (`rgba(13, 31, 60, ...)`, i.e. the same navy as
 * `colors.ts`'s `primary`) rather than a generic black one. Tinted shadows
 * read as more deliberately "designed" than default black shadows (the same
 * technique Stripe/Linear use) and are cheap to reproduce exactly: every
 * elevation step below is that same navy tint at a different blur/alpha.
 * The wireframe's one observed value is kept verbatim as `hover`.
 */
const shadowTint = '13, 31, 60';

export const shadows = {
  elevation0: 'none',
  elevation1: `0 1px 2px rgba(${shadowTint}, 0.06)`,
  elevation2: `0 2px 8px rgba(${shadowTint}, 0.08)`,
  elevation3: `0 4px 16px rgba(${shadowTint}, 0.1)`,
  elevation4: `0 8px 32px rgba(${shadowTint}, 0.12)`,
  /** Verbatim match for the wireframe's one observed `box-shadow` value. */
  hover: `0 4px 24px rgba(${shadowTint}, 0.1)`,
  dropdown: `0 4px 12px rgba(${shadowTint}, 0.14)`,
  modal: `0 16px 48px rgba(${shadowTint}, 0.18)`
} as const;

/**
 * A navy-tinted shadow disappears against a navy dark-mode surface — dark
 * surfaces read elevation through a *lighter*, higher-contrast shadow
 * instead. Keeping this as a parallel set (rather than trying to make one
 * set work for both modes) is what lets `ThemeProvider` pick the correct
 * one per mode without any component needing to know why.
 */
export const darkShadows = {
  elevation0: 'none',
  elevation1: '0 1px 2px rgba(0, 0, 0, 0.24)',
  elevation2: '0 2px 8px rgba(0, 0, 0, 0.32)',
  elevation3: '0 4px 16px rgba(0, 0, 0, 0.4)',
  elevation4: '0 8px 32px rgba(0, 0, 0, 0.48)',
  hover: '0 4px 24px rgba(0, 0, 0, 0.4)',
  dropdown: '0 4px 12px rgba(0, 0, 0, 0.44)',
  modal: '0 16px 48px rgba(0, 0, 0, 0.56)'
} as const;

export type ShadowToken = keyof typeof shadows;
