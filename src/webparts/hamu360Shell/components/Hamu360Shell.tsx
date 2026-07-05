import * as React from 'react';

import { ThemeProvider } from '@theme/ThemeProvider';

import DashboardWidgetShowcase from './DashboardWidgetShowcase';
import type { IHamu360ShellProps } from './IHamu360ShellProps';

/**
 * App root mounted by `Hamu360ShellWebPart`. Owns the light/dark mode state
 * and mounts `ThemeProvider` above everything else in the tree — per
 * `ThemeProvider`'s own docblock, every web part must do this exactly once,
 * above anything that reads a design token.
 *
 * Renders `DashboardWidgetShowcase`, a TEMPORARY Sprint 5 verification page
 * — see that component's docblock. Sprint 4's `HubCardShowcase` (which this
 * file rendered previously) has been removed: its own docblock said to
 * delete it "once this verification is done and Sprint 5 replaces it",
 * which is exactly what this change is — the same lifecycle every prior
 * sprint's showcase had. This file's own job (mounting `ThemeProvider`) is
 * permanent; only the child it renders is meant to be swapped out again
 * once Sprint 6 feature work begins.
 *
 * There is still no end-user-facing dark-mode toggle anywhere in the
 * product, so `ThemeProvider` is left to default to `'light'` on its own.
 */
export default function Hamu360Shell(props: IHamu360ShellProps): React.ReactElement {
  const {
    currentUser,
    partnerMessage,
    announcements,
    quickLinks,
    events,
    newJoiners,
    regulatoryUpdates,
    firmWins,
    environment,
    sharePointTheme
  } = props;

  return (
    <ThemeProvider sharePointTheme={sharePointTheme}>
      <DashboardWidgetShowcase
        currentUser={currentUser}
        partnerMessage={partnerMessage}
        announcements={announcements}
        quickLinks={quickLinks}
        events={events}
        newJoiners={newJoiners}
        regulatoryUpdates={regulatoryUpdates}
        firmWins={firmWins}
        environment={environment}
      />
    </ThemeProvider>
  );
}
