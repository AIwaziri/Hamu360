import type * as React from 'react';

import type { SpacingToken } from '@theme/spacing';

export type StackDirection = 'row' | 'column';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type StackElement = 'div' | 'section' | 'article' | 'header' | 'footer' | 'nav' | 'ul' | 'ol' | 'li';

export interface IStackProps {
  /** @default 'column' */
  direction?: StackDirection;
  /** Gap between children, as a semantic spacing token — never a raw px value. @default 'md' */
  gap?: SpacingToken;
  /** @default 'stretch' */
  align?: StackAlign;
  /** @default 'start' */
  justify?: StackJustify;
  /** @default false */
  wrap?: boolean;
  /** Underlying element rendered. @default 'div' */
  as?: StackElement;
  className?: string;
  children: React.ReactNode;
}
