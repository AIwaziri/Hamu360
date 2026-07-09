import type * as React from 'react';

import type { SpacingToken } from '@theme/spacing';

/**
 * Column count at the `laptop` breakpoint and up. Every option renders fewer
 * columns below that automatically — see `Grid.module.scss`'s mobile-first
 * column steps.
 *
 * `5` was added in Sprint 7 to resolve `DESIGN_TOKEN_DEBT.md` entry 4:
 * `HubCardGrid` needed a 5-column layout and, until now, this enum didn't
 * support it, so that component hand-rolled its own local grid instead of
 * using this shared primitive (see that entry, and `HubCardGrid.module.scss`'s
 * former docblock, now removed along with the workaround it described).
 * `Grid.module.scss`'s `.columns5` ramp (2 → 3 → 5) is copied verbatim from
 * that hand-rolled version — this is a migration to the shared primitive,
 * not a new visual behavior.
 */
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridElement = 'div' | 'ul' | 'ol';

export interface IGridProps {
  /** @default 12 */
  columns?: GridColumns;
  /** @default 'md' */
  gap?: SpacingToken;
  /** @default 'div' */
  as?: GridElement;
  className?: string;
  children: React.ReactNode;
}
