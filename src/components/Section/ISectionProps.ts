import type * as React from 'react';

import type { SpacingToken } from '@theme/spacing';

export type SectionElement = 'section' | 'div' | 'article' | 'aside';

export interface ISectionProps {
  /** Vertical rhythm (`padding-block`) between this section and its neighbors, as a semantic spacing token. @default 'xl' */
  spacing?: SpacingToken;
  /** @default 'section' */
  as?: SectionElement;
  className?: string;
  children: React.ReactNode;
}
