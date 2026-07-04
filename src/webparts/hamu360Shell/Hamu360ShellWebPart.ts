import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'Hamu360ShellWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { resolveEnvironment, type IEnvironmentConfig } from '@config/environment';
import type { IAnnouncement, ICurrentUser, IPartnerMessage, IQuickLink } from '@models/index';
import {
  createAnnouncementsService,
  createCurrentUserService,
  createPartnerMessageService,
  createQuickLinksService
} from '@services/ServiceFactory';

import Hamu360Shell from './components/Hamu360Shell';
import type { IHamu360ShellProps } from './components/IHamu360ShellProps';

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
  // down as plain data" treatment as `_currentUser`.
  private _partnerMessage: IPartnerMessage = {
    id: '',
    authorName: '',
    authorRole: '',
    authorInitials: '',
    message: '',
    publishedDate: ''
  };
  private _announcements: IAnnouncement[] = [];
  private _quickLinks: IQuickLink[] = [];

  public render(): void {
    const element: React.ReactElement<IHamu360ShellProps> = React.createElement(Hamu360Shell, {
      currentUser: this._currentUser,
      partnerMessage: this._partnerMessage,
      announcements: this._announcements,
      quickLinks: this._quickLinks,
      environment: this._environmentConfig.environment,
      sharePointTheme: this._sharePointTheme
    });

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this._environmentConfig = resolveEnvironment(this.context.isServedFromLocalhost);

    const currentUserService = createCurrentUserService(this.context, this._environmentConfig);
    const partnerMessageService = createPartnerMessageService(this.context, this._environmentConfig);
    const announcementsService = createAnnouncementsService(this.context, this._environmentConfig);
    const quickLinksService = createQuickLinksService(this.context, this._environmentConfig);

    const [currentUser, partnerMessage, announcements, quickLinks] = await Promise.all([
      currentUserService.getCurrentUser(),
      partnerMessageService.getPartnerMessage(),
      announcementsService.getAnnouncements(),
      quickLinksService.getQuickLinks()
    ]);

    this._currentUser = currentUser;
    this._partnerMessage = partnerMessage;
    this._announcements = announcements;
    this._quickLinks = quickLinks;
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
