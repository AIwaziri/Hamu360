import * as React from 'react';

import type { SpacingToken } from '@theme/spacing';
import { classNames } from '@utils/index';

import type { ISpacerProps } from './ISpacerProps';
import styles from './Spacer.module.scss';

const verticalClassNames: Record<SpacingToken, string> = {
  none: styles.verticalNone,
  xxs: styles.verticalXxs,
  xs: styles.verticalXs,
  sm: styles.verticalSm,
  md: styles.verticalMd,
  lg: styles.verticalLg,
  xl: styles.verticalXl,
  xxl: styles.verticalXxl,
  xxxl: styles.verticalXxxl
};

const horizontalClassNames: Record<SpacingToken, string> = {
  none: styles.horizontalNone,
  xxs: styles.horizontalXxs,
  xs: styles.horizontalXs,
  sm: styles.horizontalSm,
  md: styles.horizontalMd,
  lg: styles.horizontalLg,
  xl: styles.horizontalXl,
  xxl: styles.horizontalXxl,
  xxxl: styles.horizontalXxxl
};

/**
 * Explicit spacing when a `Stack`'s uniform `gap` isn't the right tool —
 * either a fixed-size gap (`size` set) or a flexible one that grows to push
 * sibling content apart (`size` omitted). A leaf element: it never takes
 * children.
 */
export function Spacer(props: ISpacerProps): React.ReactElement {
  const { size, axis = 'vertical' } = props;
  const sizeClassNames = axis === 'horizontal' ? horizontalClassNames : verticalClassNames;

  return <div aria-hidden="true" className={classNames(styles.root, size ? sizeClassNames[size] : styles.flexible)} />;
}
