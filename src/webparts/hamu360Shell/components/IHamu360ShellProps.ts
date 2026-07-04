import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import type { EnvironmentName } from '@config/environment';

/**
 * Root props for the web part's React tree. Deliberately still minimal —
 * this remains the pipeline-proving/verification root, not a feature, even
 * though it now mounts `ThemeProvider` and a design-system showcase (see
 * `DesignSystemShowcase`) instead of a static placeholder.
 */
export interface IHamu360ShellProps {
  currentUserDisplayName: string;
  environment: EnvironmentName;
  /** The live SharePoint tenant/site theme, forwarded to `ThemeProvider`'s `sharePointTheme` prop. `ThemeProvider` derives the Fluent interop theme from this itself — this component does not compute a theme. */
  sharePointTheme?: IReadonlyTheme;
}
