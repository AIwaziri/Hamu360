import { createTheme, type ITheme, type IPartialTheme } from '@fluentui/react';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { colorTokens } from './tokens';

/**
 * Merges the live SharePoint tenant/site theme (passed in from
 * `onThemeChanged`) with our own brand tokens, and returns a Fluent UI
 * `ITheme` ready to hand to a `ThemeProvider`. When `spTheme` is undefined
 * (local workbench, or the callback hasn't fired yet) we fall back to
 * `colorTokens` alone so components never render unthemed.
 */
export function createAppTheme(spTheme?: IReadonlyTheme): ITheme {
  const partialTheme: IPartialTheme = {
    palette: {
      themePrimary: spTheme?.palette?.themePrimary ?? colorTokens.brand.primary,
      themeDarker: spTheme?.palette?.themeDarker ?? colorTokens.brand.primaryDark
    },
    semanticColors: {
      bodyText: spTheme?.semanticColors?.bodyText ?? colorTokens.neutral.bodyText,
      bodySubtext: spTheme?.semanticColors?.bodySubtext ?? colorTokens.neutral.bodySubtext,
      bodyBackground: spTheme?.semanticColors?.bodyBackground ?? colorTokens.neutral.bodyBackground
    }
  };

  return createTheme(partialTheme);
}
