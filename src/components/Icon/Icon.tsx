import * as React from 'react';

import { classNames } from '@utils/index';

import { ensureTablerIconFont } from './ensureTablerIconFont';
import styles from './Icon.module.scss';
import type { IconSize, IIconProps } from './IIconProps';

const sizeClassNames: Record<IconSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl
};

/**
 * Thin wrapper around a Tabler Icons glyph (`<i class="ti ti-{name}">`),
 * matching the approved wireframe's own icon markup exactly. See
 * `ensureTablerIconFont.ts` for why loading the font is isolated to a single
 * flagged utility rather than a blanket `<link>` in the SPFx manifest.
 */
export function Icon(props: IIconProps): React.ReactElement {
  const { name, size = 'md', className, label } = props;

  React.useEffect(() => {
    ensureTablerIconFont();
  }, []);

  return (
    <i
      className={classNames(styles.root, sizeClassNames[size], `ti ti-${name}`, className)}
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
    />
  );
}
