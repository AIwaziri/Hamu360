import { breakpoints } from './breakpoints';
import { darkColors, lightColors, type ISemanticColorTokens } from './colors';
import { grid } from './grid';
import { motionPresets, duration, easing } from './motion';
import { opacity } from './opacity';
import { radius } from './radius';
import { darkShadows, shadows, type ShadowToken } from './shadows';
import { spacing } from './spacing';
import { typography } from './typography';
import { zIndex } from './zIndex';

/**
 * The complete design token set for one theme mode. Every category is
 * assembled here from its own dedicated file — this module contains no
 * token *values* of its own, only composition. If you're looking for where
 * a value comes from, it's never this file.
 */
export interface IDesignTokens {
  mode: 'light' | 'dark';
  colors: ISemanticColorTokens;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  // Not `typeof shadows`: light and dark use different rgba values behind
  // the same key set (a navy tint vs. a black tint — see shadows.ts), so
  // the type only fixes the *shape*, not literal string values.
  shadows: Record<ShadowToken, string>;
  motion: {
    duration: typeof duration;
    easing: typeof easing;
    presets: typeof motionPresets;
  };
  breakpoints: typeof breakpoints;
  grid: typeof grid;
  zIndex: typeof zIndex;
  opacity: typeof opacity;
}

const sharedTokens = {
  typography,
  spacing,
  radius,
  motion: { duration, easing, presets: motionPresets },
  breakpoints,
  grid,
  zIndex,
  opacity
};

export const lightTokens: IDesignTokens = {
  mode: 'light',
  colors: lightColors,
  shadows,
  ...sharedTokens
};

export const darkTokens: IDesignTokens = {
  mode: 'dark',
  colors: darkColors,
  shadows: darkShadows,
  ...sharedTokens
};

export function getTokens(mode: 'light' | 'dark'): IDesignTokens {
  return mode === 'dark' ? darkTokens : lightTokens;
}
