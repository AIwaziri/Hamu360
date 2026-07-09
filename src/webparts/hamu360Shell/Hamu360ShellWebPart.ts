import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'Hamu360ShellWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { resolveEnvironment, type IEnvironmentConfig } from '@config/environment';
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
import {
  createAnnouncementsService,
  createAudienceService,
  createCurrentUserService,
  createEventsService,
  createFirmWinsService,
  createNewJoinersService,
  createPartnerMessageService,
  createQuickLinksService,
  createRegulatoryUpdatesService
} from '@services/ServiceFactory';

import Hamu360Shell from './components/Hamu360Shell';
import type { Hamu360PageStatus, Hamu360SectionKey, IHamu360ShellProps } from './components/IHamu360ShellProps';

export interface IHamu360ShellWebPartProps {
  description: string;
}

export default class Hamu360ShellWebPart extends BaseClientSideWebPart<IHamu360ShellWebPartProps> {
  private _environmentConfig: IEnvironmentConfig = resolveEnvironment(false);
  private _sharePointTheme: IReadonlyTheme | undefined;
  // Sprint 2's `Header` needs more than a display name (initials for the
  // avatar, and potentially email/loginName later) — see
  // `IHamu360ShellProps.ts`'s docblock for why the full `ICurrentUser` is
  // threaded through now instead of just `displayName` as Sprint 1 did.
  private _currentUser: ICurrentUser = { id: '', displayName: '', email: '', loginName: '' };
  // Sprint 3's three Hero datasets — same "resolve once in onInit, pass
  // down as plain data" treatment as `_currentUser`. `_partnerMessage` is
  // `| undefined` as of the Sprint 6 closeout: `undefined` now means either
  // "still loading" (its initial value) or "no message from her this week"
  // (a real, resolved state) — see `IPartnerMessageService`'s docblock.
  // `HeroSection` renders `EmptyState` for either case, which is the
  // correct behavior for both: nothing to show yet is not a reason to show
  // stale or fabricated content.
  private _partnerMessage: IPartnerMessage | undefined = undefined;
  private _announcements: IAnnouncement[] = [];
  private _quickLinks: IQuickLink[] = [];
  // Sprint 4's audience gate — now fetched here like every other dataset
  // instead of a showcase-only workaround. See `IHamu360ShellProps.ts`'s
  // docblock.
  private _userGroups: string[] = [];
  // Sprint 5's four Dashboard Widget datasets.
  private _events: IEvent[] = [];
  private _newJoiners: INewJoiner[] = [];
  private _regulatoryUpdates: IRegulatoryUpdate[] = [];
  private _firmWins: IFirmWin[] = [];
  // Sprint 6: real network calls need real loading/error state — see
  // `Hamu360Shell.tsx`'s docblock for the full architecture this supports
  // and its documented limits.
  private _pageStatus: Hamu360PageStatus = 'loading';
  private _loadError: string | undefined;
  private _failedSections: Hamu360SectionKey[] = [];

  public render(): void {
    const element: React.ReactElement<IHamu360ShellProps> = React.createElement(Hamu360Shell, {
      currentUser: this._currentUser,
      partnerMessage: this._partnerMessage,
      announcements: this._announcements,
      quickLinks: this._quickLinks,
      userGroups: this._userGroups,
      events: this._events,
      newJoiners: this._newJoiners,
      regulatoryUpdates: this._regulatoryUpdates,
      firmWins: this._firmWins,
      environment: this._environmentConfig.environment,
      pageStatus: this._pageStatus,
      loadError: this._loadError,
      failedSections: this._failedSections,
      sharePointTheme: this._sharePointTheme
    });

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this._environmentConfig = resolveEnvironment(this.context.isServedFromLocalhost);

    // Paint the loading state immediately, before any network call
    // resolves — SPFx awaits `onInit()`'s returned promise before its own
    // first automatic `render()` call, so without this explicit call the
    // user would see nothing at all (not even a skeleton) until every
    // service below has already settled. `onThemeChanged` already
    // establishes that calling `this.render()` directly, outside the
    // framework's own lifecycle hooks, is a normal and supported pattern
    // in this codebase.
    this.render();

    const currentUserService = createCurrentUserService(this.context, this._environmentConfig);
    const partnerMessageService = createPartnerMessageService(this.context, this._environmentConfig);
    const announcementsService = createAnnouncementsService(this.context, this._environmentConfig);
    const quickLinksService = createQuickLinksService(this.context, this._environmentConfig);
    const audienceService = createAudienceService(this.context, this._environmentConfig);
    const eventsService = createEventsService(this.context, this._environmentConfig);
    const newJoinersService = createNewJoinersService(this.context, this._environmentConfig);
    const regulatoryUpdatesService = createRegulatoryUpdatesService(this.context, this._environmentConfig);
    const firmWinsService = createFirmWinsService(this.context, this._environmentConfig);

    // `currentUser` is fetched on its own, outside the `Promise.allSettled`
    // batch below, because it is the one dataset this page cannot
    // meaningfully degrade without — `Header`'s user menu, `AppShell`'s
    // whole chrome, and every other section's very reason for rendering
    // ("what does this signed-in person see") all assume a real identity.
    // Every other dataset below fails independently instead.
    let currentUser: ICurrentUser;
    try {
      currentUser = await currentUserService.getCurrentUser();
    } catch (error) {
      this._pageStatus = 'error';
      this._loadError = error instanceof Error ? error.message : 'Could not load your account details.';
      this.render();
      return;
    }

    const [
      partnerMessageResult,
      announcementsResult,
      quickLinksResult,
      audienceResult,
      eventsResult,
      newJoinersResult,
      regulatoryUpdatesResult,
      firmWinsResult
    ] = await Promise.allSettled([
      partnerMessageService.getPartnerMessage(),
      announcementsService.getAnnouncements(),
      quickLinksService.getQuickLinks(),
      audienceService.getUserGroups(),
      eventsService.getEvents(),
      newJoinersService.getNewJoiners(),
      regulatoryUpdatesService.getRegulatoryUpdates(),
      firmWinsService.getFirmWins()
    ]);

    const failedSections: Hamu360SectionKey[] = [];

    this._currentUser = currentUser;

    if (partnerMessageResult.status === 'fulfilled') {
      // `partnerMessageResult.value` may legitimately be `undefined` here —
      // that is "no message from her this week," not a failure, so it does
      // NOT get pushed onto `failedSections`. Only an actual rejection
      // (network/permission error) below does.
      this._partnerMessage = partnerMessageResult.value;
    } else {
      this._partnerMessage = undefined;
      failedSections.push('partnerMessage');
    }

    if (announcementsResult.status === 'fulfilled') {
      this._announcements = announcementsResult.value;
    } else {
      this._announcements = [];
      failedSections.push('announcements');
    }

    if (quickLinksResult.status === 'fulfilled') {
      this._quickLinks = quickLinksResult.value;
    } else {
      this._quickLinks = [];
      failedSections.push('quickLinks');
    }

    if (audienceResult.status === 'fulfilled') {
      this._userGroups = audienceResult.value;
    } else {
      // `GraphAudienceService`/`MockAudienceService` are both documented to
      // never reject — this branch is an extra safety net, not the
      // expected path. Fails closed the same way those services do
      // internally: least-privileged default, not an empty (and therefore
      // "sees nothing, including the Home page itself") array.
      this._userGroups = ['SG-HOS-AllStaff'];
      failedSections.push('audience');
    }

    if (eventsResult.status === 'fulfilled') {
      this._events = eventsResult.value;
    } else {
      this._events = [];
      failedSections.push('events');
    }

    if (newJoinersResult.status === 'fulfilled') {
      this._newJoiners = newJoinersResult.value;
    } else {
      this._newJoiners = [];
      failedSections.push('newJoiners');
    }

    if (regulatoryUpdatesResult.status === 'fulfilled') {
      this._regulatoryUpdates = regulatoryUpdatesResult.value;
    } else {
      this._regulatoryUpdates = [];
      failedSections.push('regulatoryUpdates');
    }

    if (firmWinsResult.status === 'fulfilled') {
      this._firmWins = firmWinsResult.value;
    } else {
      this._firmWins = [];
      failedSections.push('firmWins');
    }

    this._failedSections = failedSections;
    this._pageStatus = 'ready';
    this.render();
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    // Unlike Sprint 0 (which mutated `--bodyText`/`--bodySubtext` custom
    // properties directly and relied on the browser to recompute styles
    // without a React re-render), `sharePointTheme` is now a React prop
    // consumed by `ThemeProvider`'s `createAppTheme(sharePointTheme)` call
    // — so an actual re-render is required for a tenant theme change to
    // reach the Fluent interop layer.
    this._sharePointTheme = currentTheme;
    this.render();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
