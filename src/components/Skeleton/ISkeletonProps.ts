import type { RadiusToken } from '@theme/radius';

export interface ISkeletonProps {
  /** CSS width value (e.g. `'100%'`, `'120px'`). @default '100%' */
  width?: string;
  /** CSS height value (e.g. `'1em'`, `'32px'`). @default '1em' */
  height?: string;
  /** @default 'small' */
  radius?: RadiusToken;
  className?: string;
}
