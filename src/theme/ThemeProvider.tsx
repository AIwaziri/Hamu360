import { ThemeProvider as FluentThemeProvider } from '@fluentui/react';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as React from 'react';

import { createAppTheme } from './createAppTheme';
import { applyCssVariables, tokensToCssVariables } from './cssVariables';
import styles from './ThemeProvider.module.scss';
import { getTokens, type IDesignTokens } from './tokens';

export interface IThemeProviderProps {
  /**
   * `'dark'` is fully wired end-to-end (tokens, CSS variables, Fluent
   * interop) but not yet exposed to end users anywhere — there is no
   * dark-mode toggle in the product yet. This prop exists so that future
   * work is "flip the mode", not "build the dark theme".
   */
  mode?: 'light' | 'dark';
  /** The live SharePoint tenant/site theme, forwarded from a web part's `onThemeChanged`. Only affects the Fluent UI interop layer — see `createAppTheme`'s docblock. */
  sharePointTheme?: IReadonlyTheme;
  children: React.ReactNode;
}

interface IThemeContextValue {
  tokens: IDesignTokens;
  mode: 'light' | 'dark';
}

const ThemeContext = React.createContext<IThemeContextValue | undefined>(undefined);

/**
 * Root of the design system. Every web part must mount exactly one of these
 * above anything that reads design tokens: it's what actually puts the
 * `--h360-*` CSS custom properties (consumed by every `.module.scss` file
 * in this codebase) onto the DOM, and it's the only way a component can
 * read the current theme in JS via `useAppTheme()`.
 *
 * Two side effects on mount/update, deliberately kept separate:
 * 1. Sets `--h360-*` variables on its own root element (`useCssVariables`
 *    below) — this is what every future component's SCSS Module reads.
 * 2. Wraps children in Fluent's own `ThemeProvider` with a theme derived
 *    from `createAppTheme` — this is only for the handful of Fluent
 *    primitives (icons, etc.) this app still composes; it is not the
 *    styling mechanism for this design system's own primitives.
 */
export function ThemeProvider(props: IThemeProviderProps): React.ReactElement {
  const { mode = 'light', sharePointTheme, children } = props;
  const rootRef = React.useRef<HTMLDivElement>(null);

  const tokens = React.useMemo(() => getTokens(mode), [mode]);
  const fluentTheme = React.useMemo(() => createAppTheme(sharePointTheme), [sharePointTheme]);

  React.useLayoutEffect(() => {
    const element = rootRef.current;
    if (!element) {
      return;
    }
    applyCssVariables(element, tokensToCssVariables(tokens));
  }, [tokens]);

  const contextValue = React.useMemo<IThemeContextValue>(() => ({ tokens, mode }), [tokens, mode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <FluentThemeProvider theme={fluentTheme} applyTo="none">
        <div ref={rootRef} className={styles.root}>
          {children}
        </div>
      </FluentThemeProvider>
    </ThemeContext.Provider>
  );
}

/**
 * Escape hatch for the rare case a component needs a token's raw value in
 * JS rather than CSS (e.g. computing a canvas/SVG measurement). Every
 * ordinary styling decision should go through a `.module.scss` file reading
 * `--h360-*` variables, not this hook — reach for `useAppTheme` only when a
 * CSS custom property genuinely cannot do the job.
 */
export function useAppTheme(): IThemeContextValue {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme() was called outside a <ThemeProvider>. Wrap your web part in <ThemeProvider>.');
  }
  return context;
}
