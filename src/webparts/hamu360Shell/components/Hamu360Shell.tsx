import * as React from 'react';

import { ThemeProvider } from '@theme/ThemeProvider';

import HomePage from './HomePage';
import type { IHamu360ShellProps } from './IHamu360ShellProps';

/**
 * App root mounted by `Hamu360ShellWebPart`. Owns the light/dark mode state
 * and mounts `ThemeProvider` above everything else in the tree — per
 * `ThemeProvider`'s own docblock, every web part must do this exactly once,
 * above anything that reads a design token.
 *
 * Sprint 6: renders the real `HomePage` in place of Sprint 5's temporary
 * `DashboardWidgetShowcase` (that folder has been deleted — its own
 * docblock said to remove it "once this verification is done and Sprint 6
 * replaces it", which is exactly what this change is). Every prop below is
 * forwarded straight through to `HomePage` unchanged; this file's only job
 * is mounting `ThemeProvider`, same as every prior sprint.
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
    userGroups,
    events,
    newJoiners,
    regulatoryUpdates,
    firmWins,
    pageStatus,
    loadError,
    failedSections,
    sharePointTheme
  } = props;

  return (
    <ThemeProvider sharePointTheme={sharePointTheme}>
      <HomePage
        currentUser={currentUser}
        partnerMessage={partnerMessage}
        announcements={announcements}
        quickLinks={quickLinks}
        userGroups={userGroups}
        events={events}
        newJoiners={newJoiners}
        regulatoryUpdates={regulatoryUpdates}
        firmWins={firmWins}
        pageStatus={pageStatus}
        loadError={loadError}
        failedSections={failedSections}
      />
    </ThemeProvider>
  );
}
