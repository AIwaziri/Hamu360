import type * as React from 'react';

import type { TypographyRole } from '@theme/typography';

export type TypographyElement = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';

/**
 * Closed set of text colors a component is allowed to ask for — deliberately
 * a subset of `ISemanticColorTokens`, not the full set. Status colors
 * (success/warning/danger/info) belong to whatever badge/alert component
 * eventually renders them with their matching background tint, not to
 * free-floating text; a text color prop that accepted any semantic token
 * would make it too easy to write "red text" as a substitute for a real
 * status component.
 */
export type TypographyColor = 'primary' | 'secondary' | 'onPrimary' | 'muted' | 'accent' | 'inherit';

export interface ITypographyProps {
  /** Which entry in the type scale to render. @default 'body' */
  role?: TypographyRole;
  /** Underlying element. No default inferred from `role` on purpose — heading roles (`headingL`, etc.) are a *visual* size, not a document-outline level, so the caller must say explicitly whether this text is also an `h1`-`h6`. @default 'p' */
  as?: TypographyElement;
  /** @default 'primary' */
  color?: TypographyColor;
  align?: 'left' | 'center' | 'right';
  /** Single-line ellipsis truncation. @default false */
  truncate?: boolean;
  className?: string;
  children: React.ReactNode;
}
