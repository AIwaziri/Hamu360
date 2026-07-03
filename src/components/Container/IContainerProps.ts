import type * as React from 'react';

export type ContainerMaxWidth = 'laptop' | 'desktop' | 'full';
export type ContainerElement = 'div' | 'section' | 'article' | 'main';

export interface IContainerProps {
  /**
   * `'laptop'` (1024px) / `'desktop'` (1180px, matches the wireframe's
   * `.shell` exactly) / `'full'` (no max-width, only the responsive gutter).
   * @default 'desktop'
   */
  maxWidth?: ContainerMaxWidth;
  /** @default 'div' */
  as?: ContainerElement;
  className?: string;
  children: React.ReactNode;
}
