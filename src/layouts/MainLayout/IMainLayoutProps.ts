import type * as React from 'react';

import type { ContainerMaxWidth } from '@components/Container';
import type { SpacingToken } from '@theme/spacing';

export interface IMainLayoutProps {
  /** Forwarded to the inner `Container`. @default 'desktop' */
  maxWidth?: ContainerMaxWidth;
  /** Forwarded to the inner `Section`'s vertical rhythm. @default 'xl' (Section's own default) */
  spacing?: SpacingToken;
  className?: string;
  children: React.ReactNode;
}
