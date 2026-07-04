import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration, PropertyPaneTextField } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'Hamu360ShellWebPartStrings';
import * as React from 'react';
import * as ReactDom from 'react-dom';

import { resolveEnvironment, type IEnvironmentConfig } from '@config/environment';
import { createCurrentUserService } from '@services/ServiceFactory';

import Hamu360Shell from './components/Hamu360Shell';
import type { IHamu360ShellProps } from './components/IHamu360ShellProps';

export interface IHamu360ShellWebPartProps {
  description: string;
}

export default class Hamu360ShellWebPart extends BaseClientSideWebPart<IHamu360ShellWebPartProps> {
  private _environmentConfig: IEnvironmentConfig = resolveEnvironment(false);
  private _sharePointTheme: IReadonlyTheme | undefined;
  private _currentUserDisplayName = '';

  public render(): void {
    const element: React.ReactElement<IHamu360ShellProps> = React.createElement(Hamu360Shell, {
      currentUserDisplayName: this._currentUserDisplayName,
      environment: this._environmentConfig.environment,
      sharePointTheme: this._sharePointTheme
    });

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    this._environmentConfig = resolveEnvironment(this.context.isServedFromLocalhost);

    const currentUserService = createCurrentUserService(this.context, this._environmentConfig);
    const currentUser = await currentUserService.getCurrentUser();
    this._currentUserDisplayName = currentUser.displayName;
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
