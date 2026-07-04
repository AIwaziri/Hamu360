import * as React from 'react';

import { ThemeProvider } from '@theme/ThemeProvider';

import AppShellShowcase from './AppShellShowcase';
import type { IHamu360ShellProps } from './IHamu360ShellProps';

/**
 * App root mounted by `Hamu360ShellWebPart`. Owns the light/dark mode state
 * and mounts `ThemeProvider` above everything else in the tree — per
 * `ThemeProvider`'s own docblock, every web part must do this exactly once,
 * above anything that reads a design token.
 *
 * Renders `AppShellShowcase`, a TEMPORARY Sprint 2 verification page — see
 * that component's docblock. Sprint 1's `DesignSystemShowcase` (which this
 * file rendered previously) has been removed: its own docblock said to
 * delete it "once Sprint 2 feature work begins", which is exactly what this
 * change is. This file's own job (mounting `ThemeProvider`, owning theme
 * mode) is permanent; only the child it renders is meant to be swapped out
 * again once Sprint 3 feature work begins.
 */
export default function Hamu360Shell(props: IHamu360ShellProps): React.ReactElement {
  const { currentUser, environment, sharePointTheme } = props;

  // Sprint 1's `mode` toggle state is gone along with `DesignSystemShowcase`
  // — there is still no end-user-facing dark-mode toggle anywhere in the
  // product (see `ThemeProvider`'s own docblock), so there is nothing for
  // this file to hold state for right now. `ThemeProvider` defaults to
  // `'light'` on its own; a future sprint that adds a real toggle (likely
  // surfaced from the header's user menu) is what should reintroduce this
  // `useState`, at the point it actually has a UI control to drive it.
  return (
    <ThemeProvider sharePointTheme={sharePointTheme}>
      <AppShellShowcase currentUser={currentUser} environment={environment} />
    </ThemeProvider>
  );
}
