import type * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
export type ButtonSize = 'sm' | 'md';

export interface IButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  /**
   * `'icon'` is a square, icon-only variant (equal padding on every side, no
   * visible label) — used by the mobile nav's hamburger toggle. Every
   * `'icon'`-variant button must be given an `aria-label` since it has no
   * visible text content.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /** @default 'md' */
  size?: ButtonSize;
  /** @default false */
  fullWidth?: boolean;
  className?: string;
}
