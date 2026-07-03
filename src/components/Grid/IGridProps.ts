import type * as React from 'react';

import type { SpacingToken } from '@theme/spacing';

/** Column count at the `laptop` breakpoint and up. Every option renders fewer columns below that automatically — see `Grid.module.scss`'s mobile-first column steps. */
export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;
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
