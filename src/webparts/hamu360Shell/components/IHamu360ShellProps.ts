import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import type { EnvironmentName } from '@config/environment';
import type { ICurrentUser } from '@models/index';

/**
 * Root props for the web part's React tree. Deliberately still minimal —
 * this remains the pipeline-proving/verification root, not a feature, even
 * though it now mounts `ThemeProvider` and the Sprint 2 application shell
 * (see `AppShellShowcase`) instead of a static placeholder.
 *
 * `currentUser` (not just a display name, as Sprint 1 passed) is the full
 * `ICurrentUser` shape — `Header`'s user menu needs initials, and a future
 * sprint may need `email`/`loginName` too. Resolved once in
 * `Hamu360ShellWebPart.onInit()` via `ServiceFactory.createCurrentUserService()`
 * and handed down as plain data from here on; nothing below this file talks
 * to a service directly.
 */
export interface IHamu360ShellProps {
  currentUser: ICurrentUser;
  environment: EnvironmentName;
  /** The live SharePoint tenant/site theme, forwarded to `ThemeProvider`'s `sharePointTheme` prop. `ThemeProvider` derives the Fluent interop theme from this itself — this component does not compute a theme. */
  sharePointTheme?: IReadonlyTheme;
}
