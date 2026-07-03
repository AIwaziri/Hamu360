import { createTheme, type IPartialTheme, type ITheme } from '@fluentui/react';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import { lightColors } from './colors';
import { fontFamilyBase } from './typography';

/**
 * Merges the live SharePoint tenant/site theme (passed in from
 * `onThemeChanged`) with our own brand tokens, and returns a Fluent UI
 * `ITheme`. This exists only so the small number of Fluent primitives this
 * app still relies on (icons, and any future Fluent control a component
 * composes internally) render with Hamu360's brand colors and typeface
 * instead of Fluent's stock blue — it is **not** how this design system's
 * own primitives get their styling. Those read `--h360-*` CSS custom
 * properties applied by `ThemeProvider` (see `ThemeProvider.tsx`), sourced
 * from `colors.ts`/`typography.ts` directly. This function is the Fluent
 * interop seam, not a second source of truth.
 */
export function createAppTheme(spTheme?: IReadonlyTheme): ITheme {
  const partialTheme: IPartialTheme = {
    palette: {
      themePrimary: spTheme?.palette?.themePrimary ?? lightColors.primary,
      themeDarker: spTheme?.palette?.themeDarker ?? lightColors.secondary,
      accent: spTheme?.palette?.accent ?? lightColors.accent
    },
    semanticColors: {
      bodyText: spTheme?.semanticColors?.bodyText ?? lightColors.textPrimary,
      bodySubtext: spTheme?.semanticColors?.bodySubtext ?? lightColors.textSecondary,
      bodyBackground: spTheme?.semanticColors?.bodyBackground ?? lightColors.surface
    },
    defaultFontStyle: {
      fontFamily: fontFamilyBase
    }
  };

  return createTheme(partialTheme);
}
