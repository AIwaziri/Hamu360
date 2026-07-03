import * as React from 'react';
import { escape } from '@microsoft/sp-lodash-subset';
import * as strings from 'Hamu360ShellWebPartStrings';
import styles from './Hamu360Shell.module.scss';
import type { IHamu360ShellProps } from './IHamu360ShellProps';

/**
 * Foundation placeholder — confirms the SPFx + React + TypeScript + SCSS
 * Modules pipeline builds and renders. Replace with real feature web parts
 * in a later sprint; do not extend this component with feature UI.
 */
export default class Hamu360Shell extends React.Component<IHamu360ShellProps> {
  public render(): React.ReactElement<IHamu360ShellProps> {
    const { currentUserDisplayName, environment } = this.props;

    return (
      <section className={styles.hamu360Shell}>
        <h2 className={styles.title}>{strings.FoundationTitle}</h2>
        <p className={styles.subtitle}>
          {strings.FoundationSubtitle} Signed in as {escape(currentUserDisplayName)} ({environment}).
        </p>
      </section>
    );
  }
}
