import * as React from 'react';

import { ThemeProvider } from '@theme/ThemeProvider';

import DesignSystemShowcase from './DesignSystemShowcase';
import type { IHamu360ShellProps } from './IHamu360ShellProps';

/**
 * App root mounted by `Hamu360ShellWebPart`. Owns the light/dark mode state
 * and mounts `ThemeProvider` above everything else in the tree — per
 * `ThemeProvider`'s own docblock, every web part must do this exactly once,
 * above anything that reads a design token.
 *
 * Renders `DesignSystemShowcase`, a TEMPORARY Sprint 1 verification page —
 * see that component's docblock. This file's own job (mounting
 * `ThemeProvider`, owning theme mode) is permanent; only the child it
 * renders is meant to be swapped out once Sprint 2 feature work begins.
 */
export default function Hamu360Shell(props: IHamu360ShellProps): React.ReactElement {
  const { currentUserDisplayName, environment, sharePointTheme } = props;
  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  const toggleMode = React.useCallback(() => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  return (
    <ThemeProvider mode={mode} sharePointTheme={sharePointTheme}>
      <DesignSystemShowcase
        currentUserDisplayName={currentUserDisplayName}
        environment={environment}
        mode={mode}
        onToggleMode={toggleMode}
      />
    </ThemeProvider>
  );
}
