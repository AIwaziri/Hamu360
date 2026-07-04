import * as React from 'react';

import { ThemeProvider } from '@theme/ThemeProvider';

import HeroSectionShowcase from './HeroSectionShowcase';
import type { IHamu360ShellProps } from './IHamu360ShellProps';

/**
 * App root mounted by `Hamu360ShellWebPart`. Owns the light/dark mode state
 * and mounts `ThemeProvider` above everything else in the tree — per
 * `ThemeProvider`'s own docblock, every web part must do this exactly once,
 * above anything that reads a design token.
 *
 * Renders `HeroSectionShowcase`, a TEMPORARY Sprint 3 verification page —
 * see that component's docblock. Sprint 2's `AppShellShowcase` (which this
 * file rendered previously) has been removed: its own docblock said to
 * delete it "before Sprint 3 begins", which is exactly what this change is
 * — the same lifecycle Sprint 1's `DesignSystemShowcase` had before it.
 * This file's own job (mounting `ThemeProvider`) is permanent; only the
 * child it renders is meant to be swapped out again once Sprint 4 feature
 * work begins.
 *
 * Sprint 1's `mode` toggle state is still gone (see the Sprint 2 removal
 * note this docblock replaced) — there is still no end-user-facing
 * dark-mode toggle anywhere in the product, so `ThemeProvider` is left to
 * default to `'light'` on its own.
 */
export default function Hamu360Shell(props: IHamu360ShellProps): React.ReactElement {
  const { currentUser, partnerMessage, announcements, quickLinks, environment, sharePointTheme } = props;

  return (
    <ThemeProvider sharePointTheme={sharePointTheme}>
      <HeroSectionShowcase
        currentUser={currentUser}
        partnerMessage={partnerMessage}
        announcements={announcements}
        quickLinks={quickLinks}
        environment={environment}
      />
    </ThemeProvider>
  );
}
