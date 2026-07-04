import * as React from 'react';

import { NavigationItem } from '@layouts/NavigationItem';
import { classNames } from '@utils/index';

import type { INavigationProps } from './INavigationProps';
import styles from './Navigation.module.scss';

/**
 * Renders the primary nav landmark and its item list. Deliberately has no
 * opinion on responsive collapse/hamburger behavior — that's `Header`'s job
 * (see `Header.module.scss`'s mobile rules), because whether a given
 * `Navigation` instance should collapse below a breakpoint is a fact about
 * where it's mounted, not about what a navigation list inherently is.
 */
export function Navigation(props: INavigationProps): React.ReactElement {
  const { items, activeItemId, onItemSelect, id, className } = props;

  return (
    <nav aria-label="Primary" id={id} className={classNames(styles.root, className)}>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <NavigationItem
              label={item.label}
              icon={item.icon}
              active={item.id === activeItemId}
              onClick={() => onItemSelect?.(item.id)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
