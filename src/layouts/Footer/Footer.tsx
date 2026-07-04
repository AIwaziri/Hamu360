import * as React from 'react';

import { classNames } from '@utils/index';

import styles from './Footer.module.scss';
import type { IFooterProps } from './IFooterProps';

/**
 * The dark navy footer band from the approved wireframe (`.foot`/`.ft`):
 * firm name + tagline + product version on the left, copyright + rights
 * notice on the right. Pure presentation — no props needed beyond
 * `className`, since there's no business content or business logic here.
 */
export function Footer(props: IFooterProps): React.ReactElement {
  const { className } = props;
  const year = new Date().getFullYear();

  return (
    <footer className={classNames(styles.root, className)}>
      <p className={styles.line}>
        <span className={styles.dim}>HAMU LEGAL &middot; </span>
        <span className={styles.accent}>TRUST &amp; EXCELLENCE</span>
        <span className={styles.dim}> &middot; Hamu Operating System v1.0 &middot; Confidential</span>
      </p>
      <p className={styles.line}>
        <span className={styles.dim}>&copy; {year} Hamu Legal &middot; All rights reserved</span>
      </p>
    </footer>
  );
}
