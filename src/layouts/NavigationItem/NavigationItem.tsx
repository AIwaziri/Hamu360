import * as React from 'react';

import { Icon } from '@components/Icon';
import { classNames } from '@utils/index';

import type { INavigationItemProps } from './INavigationItemProps';
import styles from './NavigationItem.module.scss';

/**
 * Standalone, presentational nav entry — reusable anywhere a label/icon/
 * active tri-state is needed (primary nav today; a future breadcrumb, tab
 * strip, or sidebar could reuse it unchanged). Deliberately renders no
 * wrapping `<li>` of its own so a consumer controls the list semantics
 * (`Navigation` supplies the `<li>` — see its docblock).
 */
export function NavigationItem(props: INavigationItemProps): React.ReactElement {
  const { label, icon, active = false, as = 'button', href, onClick, className } = props;

  const content = (
    <>
      {icon ? <Icon name={icon} size="sm" className={styles.icon} /> : undefined}
      <span>{label}</span>
    </>
  );

  const sharedClassName = classNames(styles.root, active && styles.active, className);

  if (as === 'a') {
    return (
      <a href={href} className={sharedClassName} aria-current={active ? 'page' : undefined} onClick={onClick}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={sharedClassName} aria-current={active ? 'page' : undefined} onClick={onClick}>
      {content}
    </button>
  );
}
