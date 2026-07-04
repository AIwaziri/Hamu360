import * as React from 'react';

import styles from './Logo.module.scss';

/**
 * The Hamu Legal mark + wordmark. Not sourced from an image asset — Sprint 1
 * never added one (`src/assets/README.md` only documents the folder's
 * purpose; no logo file exists there yet), and the approved wireframe's own
 * `.logo` is itself text/CSS, not an `<img>` (`<div class="lm">H</div>` plus
 * two text lines). This component reproduces that same text-based treatment
 * with tokens. If a real logo image is added to `src/assets` in a later
 * sprint, only this file needs to change — nothing that renders `<Header>`
 * needs to know.
 */
export function Logo(): React.ReactElement {
  return (
    <div className={styles.root}>
      <div className={styles.mark} aria-hidden="true">
        H
      </div>
      <div className={styles.wordmark}>
        <span className={styles.title}>HAMU LEGAL</span>
        <span className={styles.tagline}>TRUST &amp; EXCELLENCE</span>
      </div>
    </div>
  );
}
