import type * as React from 'react';

import type { IconName } from '@components/Icon';

export interface INavigationItemProps {
  label: string;
  icon?: IconName;
  /**
   * Whether this is the current section. Sprint 2 sets this from a plain
   * `React.useState` in the showcase only — there is no router yet, so
   * nothing computes this from the real URL. `Navigation`'s docblock
   * explains why that's fine for this sprint and what changes (nothing,
   * here) when real routing arrives.
   * @default false
   */
  active?: boolean;
  /**
   * `'button'` (the default) is deliberately chosen over `'a'`: there is no
   * real destination to link to yet, and an `<a href="#">` would both mislead
   * assistive tech into announcing a navigable link and cause an unwanted
   * scroll-to-top on click. Switch a given item to `'a'` (and pass `href`)
   * only once it has a real destination — no other prop needs to change.
   * @default 'button'
   */
  as?: 'button' | 'a';
  /** Only used when `as="a"`. */
  href?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  className?: string;
}
