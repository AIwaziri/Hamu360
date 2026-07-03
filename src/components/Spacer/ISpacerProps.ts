import type { SpacingToken } from '@theme/spacing';

export interface ISpacerProps {
  /** Fixed size along `axis`. Omit for a flexible spacer that grows to fill available space (`flex: 1`) — e.g. to push the rest of a `Stack`'s children to the far edge. */
  size?: SpacingToken;
  /** Which axis `size` applies to. Irrelevant for a flexible spacer. @default 'vertical' */
  axis?: 'horizontal' | 'vertical';
}
