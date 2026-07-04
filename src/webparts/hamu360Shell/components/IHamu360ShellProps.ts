import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import type { EnvironmentName } from '@config/environment';
import type { IAnnouncement, ICurrentUser, IPartnerMessage, IQuickLink } from '@models/index';

/**
 * Root props for the web part's React tree. Deliberately still minimal —
 * this remains the pipeline-proving/verification root, not a feature, even
 * though it now mounts `ThemeProvider` and the Sprint 3 hero showcase (see
 * `HeroSectionShowcase`) instead of a static placeholder.
 *
 * `currentUser` (not just a display name, as Sprint 1 passed) is the full
 * `ICurrentUser` shape — `Header`'s user menu needs initials, and a future
 * sprint may need `email`/`loginName` too. `partnerMessage`/`announcements`/
 * `quickLinks` are Sprint 3's three Hero datasets. All four are resolved
 * once in `Hamu360ShellWebPart.onInit()` via the matching
 * `ServiceFactory.create*Service()` calls and handed down as plain data
 * from here on; nothing below this file talks to a service directly.
 */
export interface IHamu360ShellProps {
  currentUser: ICurrentUser;
  partnerMessage: IPartnerMessage;
  announcements: IAnnouncement[];
  quickLinks: IQuickLink[];
  environment: EnvironmentName;
  /** The live SharePoint tenant/site theme, forwarded to `ThemeProvider`'s `sharePointTheme` prop. `ThemeProvider` derives the Fluent interop theme from this itself — this component does not compute a theme. */
  sharePointTheme?: IReadonlyTheme;
}
