import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import type { EnvironmentName } from '@config/environment';
import type {
  IAnnouncement,
  ICurrentUser,
  IEvent,
  IFirmWin,
  INewJoiner,
  IPartnerMessage,
  IQuickLink,
  IRegulatoryUpdate
} from '@models/index';

/** Every dataset key that can independently fail without taking down the whole page — see `Hamu360Shell`'s docblock for how `failedSections` is used. */
export type Hamu360SectionKey =
  | 'partnerMessage'
  | 'announcements'
  | 'quickLinks'
  | 'audience'
  | 'events'
  | 'newJoiners'
  | 'regulatoryUpdates'
  | 'firmWins';

export type Hamu360PageStatus = 'loading' | 'ready' | 'error';

/**
 * Root props for the web part's React tree. This is the real Home page as
 * of Sprint 6 — `DashboardWidgetShowcase` (Sprint 5's temporary preview) has
 * been removed; `Hamu360Shell` itself now composes `AppShell`/`HeroSection`/
 * `HubCardGrid`/`DashboardWidgetGrid` directly. See `Hamu360Shell.tsx`'s own
 * docblock for the full loading/error architecture.
 *
 * `currentUser`/`announcements`/`quickLinks`/`events`/`newJoiners`/
 * `regulatoryUpdates`/`firmWins` are unchanged in shape from Sprint 5 —
 * every one of them can now be real, possibly-empty, possibly-slow-to-arrive
 * data instead of instant mock data, which is exactly why
 * `pageStatus`/`loadError`/`failedSections` exist alongside them rather than
 * replacing them: the underlying `T[]`/object shapes never needed to change
 * for real data, only this file (a route-level composition root, not a
 * reusable component) needed new props to describe *how* that data arrived.
 *
 * `partnerMessage` is the one exception, changed in the Sprint 6 closeout
 * from a required `IPartnerMessage` to `IPartnerMessage | undefined`: "no
 * News post from the Managing Partner's account this week" is a real,
 * expected state (see `IPartnerMessageService`'s docblock), and `undefined`
 * represents it directly instead of via a fabricated placeholder object.
 * `HeroSection` renders the existing `EmptyState` component when this is
 * `undefined` — `PartnerMessageCard` itself was not touched and still
 * requires a fully-populated `IPartnerMessage` whenever it is rendered.
 *
 * `userGroups` is new this sprint — Sprint 4/5's showcases each constructed
 * their own `MockAudienceService` locally as a documented one-off exception;
 * now that this is the real Home page, `Hamu360ShellWebPart.onInit()` fetches
 * it through `ServiceFactory.createAudienceService()` exactly like every
 * other dataset, and it arrives here as plain data like everything else.
 */
export interface IHamu360ShellProps {
  currentUser: ICurrentUser;
  partnerMessage: IPartnerMessage | undefined;
  announcements: IAnnouncement[];
  quickLinks: IQuickLink[];
  userGroups: string[];
  events: IEvent[];
  newJoiners: INewJoiner[];
  regulatoryUpdates: IRegulatoryUpdate[];
  firmWins: IFirmWin[];
  environment: EnvironmentName;
  /**
   * `'loading'` while `onInit()`'s data fetch is still in flight, `'error'`
   * only for a page-critical failure (today: `currentUser` itself couldn't
   * be resolved — there's no meaningful degraded Home page without an
   * identity), `'ready'` otherwise. Every other dataset degrades
   * independently instead of blocking the page — see `failedSections`.
   */
  pageStatus: Hamu360PageStatus;
  /** Set only when `pageStatus === 'error'`. */
  loadError?: string;
  /**
   * Which non-critical datasets failed to load and are showing their
   * documented fallback (an empty array, or — for `partnerMessage` —
   * `undefined`) instead of real data. Rendered as a single page-level
   * notice, not per-widget — see `Hamu360Shell.tsx`'s docblock for why
   * per-widget error isolation isn't achievable without changing
   * `HeroSection`/`HubCardGrid`/`DashboardWidgetGrid`'s props, which
   * Sprint 6's brief explicitly said not to do.
   *
   * Note `partnerMessage: undefined` on its own does NOT imply this array
   * contains `'partnerMessage'` — `undefined` is also the normal, successful
   * "no message this week" result. Only a genuine fetch failure adds it here
   * (see `Hamu360ShellWebPart.onInit()`).
   */
  failedSections: Hamu360SectionKey[];
  /** The live SharePoint tenant/site theme, forwarded to `ThemeProvider`'s `sharePointTheme` prop. `ThemeProvider` derives the Fluent interop theme from this itself — this component does not compute a theme. */
  sharePointTheme?: IReadonlyTheme;
}
