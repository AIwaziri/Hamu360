import * as React from 'react';

import { ThemeProvider } from '@theme/ThemeProvider';

import HubCardShowcase from './HubCardShowcase';
import type { IHamu360ShellProps } from './IHamu360ShellProps';

/**
 * App root mounted by `Hamu360ShellWebPart`. Owns the light/dark mode state
 * and mounts `ThemeProvider` above everything else in the tree — per
 * `ThemeProvider`'s own docblock, every web part must do this exactly once,
 * above anything that reads a design token.
 *
 * Renders `HubCardShowcase`, a TEMPORARY Sprint 4 verification page — see
 * that component's docblock. Sprint 3's `HeroSectionShowcase` (which this
 * file rendered previously) has been removed: its own docblock said to
 * delete it "once this verification is done and Sprint 4 replaces it",
 * which is exactly what this change is — the same lifecycle every prior
 * sprint's showcase had. This file's own job (mounting `ThemeProvider`) is
 * permanent; only the child it renders is meant to be swapped out again
 * once Sprint 5 feature work begins.
 *
 * There is still no end-user-facing dark-mode toggle anywhere in the
 * product, so `ThemeProvider` is left to default to `'light'` on its own.
 */
export default function Hamu360Shell(props: IHamu360ShellProps): React.ReactElement {
  const { currentUser, partnerMessage, announcements, quickLinks, environment, sharePointTheme } = props;

  return (
    <ThemeProvider sharePointTheme={sharePointTheme}>
      <HubCardShowcase
        currentUser={currentUser}
        partnerMessage={partnerMessage}
        announcements={announcements}
        quickLinks={quickLinks}
        environment={environment}
      />
    </ThemeProvider>
  );
}
